import { useState, useEffect } from 'react';
import { messaging, db } from '../firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useNotifications = () => {
  const { effectiveUid } = useAuth();
  const { showToast } = useToast();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'granted' && effectiveUid) {
          activateNotifications();
      }
    }
  }, [effectiveUid]);

  const activateNotifications = async () => {
    if (!effectiveUid) return;
    
    try {
        // Note: You need to add VITE_FIREBASE_VAPID_KEY to your .env file
        // Get it from Firebase Console -> Project Settings -> Cloud Messaging -> Web Configuration
        const options = VAPID_KEY ? { vapidKey: VAPID_KEY } : undefined;
        
        const token = await getToken(messaging, options);
        if (token) {
            setFcmToken(token);
            // Save to Firestore
            const userRef = doc(db, 'users', effectiveUid);
            await setDoc(userRef, {
                fcmTokens: arrayUnion(token)
            }, { merge: true });
            
            showToast("Notifications enabled!");
            return true;
        } else {
            console.log('No registration token available.');
            return false;
        }
    } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
        // showToast("Failed to enable notifications. Check VAPID key.");
        return false;
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      showToast("Notifications not supported in this browser.");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        const success = await activateNotifications();
        return success;
      } else {
        showToast("Notification permission denied.");
        return false;
      }
    } catch (error) {
      console.error("Error requesting permission", error);
      return false;
    }
  };

  const deactivateNotifications = async () => {
      if (!effectiveUid) return;
      // We assume the current token is what we want to remove.
      // If we don't have it in state (e.g. page reload), we might need to get it again to remove it?
      // Or just clear the list? No, user might have other devices.
      // For now, if we have fcmToken, remove it.
      if (fcmToken) {
        try {
            const userRef = doc(db, 'users', effectiveUid);
            await setDoc(userRef, {
                fcmTokens: arrayRemove(fcmToken)
            }, { merge: true });
            setFcmToken(null);
            showToast("Notifications disabled.");
        } catch (e) {
            console.error("Error removing token", e);
        }
      } else {
          // Just reset UI if no token to remove
          setFcmToken(null);
          showToast("Notifications disabled.");
      }
  };

  useEffect(() => {
      // Foreground message listener
      const unsubscribe = onMessage(messaging, (payload) => {
          console.log('Message received. ', payload);
          if (payload.notification) {
              showToast(`${payload.notification.title}: ${payload.notification.body}`);
          }
      });
      return () => unsubscribe();
  }, []);

  return { notificationPermission, requestPermission, deactivateNotifications, isEnabled: !!fcmToken };
};
