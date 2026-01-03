importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDwv89h8vSyIjwkqStlw-omiXcdTzUMWTM",
  authDomain: "kannadablitz.firebaseapp.com",
  projectId: "kannadablitz",
  storageBucket: "kannadablitz.firebasestorage.app",
  messagingSenderId: "569869531050",
  appId: "1:569869531050:web:3ebf1cd0305bab6c4f5dd3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  if (payload.notification) {
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon-96x96.png',
        data: payload.data
      };
    
      self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
