const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Triggered when a user document is updated.
 * Checks for changes in the 'nudges' field and sends a notification.
 */
exports.sendNudgeNotification = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    // Check if nudges field exists and has changed
    if (!newData.nudges || JSON.stringify(newData.nudges) === JSON.stringify(previousData.nudges)) {
      return null;
    }

    // Identify the new nudge sender(s)
    const oldNudges = previousData.nudges || {};
    const newNudges = newData.nudges;
    
    // Find keys in newNudges that are new or updated timestamps
    const senders = Object.keys(newNudges).filter(uid => !oldNudges[uid] || oldNudges[uid] !== newNudges[uid]);

    if (senders.length === 0) return null;

    const fcmTokens = newData.fcmTokens;
    if (!fcmTokens || fcmTokens.length === 0) {
        console.log("No FCM tokens for user", context.params.userId);
        return null;
    }

    // Construct notification payloads
    const notifications = await Promise.all(senders.map(async (senderUid) => {
        // Fetch sender's name
        const senderDoc = await admin.firestore().collection("users").doc(senderUid).get();
        const senderName = senderDoc.exists ? (senderDoc.data().userName || "A friend") : "A friend";
        
        return {
            notification: {
                title: "Nudge Alert! ⚡",
                body: `${senderName} nudged you to practice Kannada!`,
            },
            tokens: fcmTokens // Send to all user's devices
        };
    }));

    // Send notifications
    const promises = notifications.map(payload => admin.messaging().sendMulticast(payload));
    return Promise.all(promises);
  });

/**
 * Scheduled Daily Reminder.
 * Runs every day at 09:00 UTC.
 * Sends a reminder to users who haven't played today.
 */
exports.scheduledDailyReminder = functions.pubsub.schedule('every day 09:00').onRun(async (context) => {
    const snapshot = await admin.firestore().collection("users").get();
    
    const promises = [];
    const today = new Date();
    
    snapshot.forEach(doc => {
        const data = doc.data();
        if (!data.fcmTokens || data.fcmTokens.length === 0) return;
        
        // Check if played today
        let playedToday = false;
        if (data.lastPlayedDate) {
            const lastPlayed = new Date(data.lastPlayedDate);
            playedToday = lastPlayed.getDate() === today.getDate() && 
                          lastPlayed.getMonth() === today.getMonth() &&
                          lastPlayed.getFullYear() === today.getFullYear();
        }
        
        if (!playedToday) {
            const message = {
                notification: {
                    title: "KannadaBlitz Daily 📅",
                    body: "Keep your streak alive! 5 minutes of practice today?",
                },
                tokens: data.fcmTokens
            };
            promises.push(admin.messaging().sendMulticast(message));
        }
    });
    
    return Promise.all(promises);
});
