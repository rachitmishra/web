import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

const firebaseConfig = {
  // Your Firebase project configuration
};

function GameStatus() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // Request permission for notifications
    getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('FCM token:', currentToken);
          // Possibly send token to your server if needed for further actions
        } else {
          console.log('No FCM registration token available. You may need to request permission to show notifications.');
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving the FCM token.', err);
      });

    // Handle incoming FCM messages
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      if (payload.data.status === 'gameStarted') {
        setIsGameStarted(true);
        // Redirect to scoreboard page using Next.js router
        router.push('/scorecard');
      }
    });

    return () => {
      // Cleanup functions when component unmounts
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {isGameStarted ? (
        <p>The game has started!</p>
      ) : (
        <p>Waiting for the game to start...</p>
      )}
    </div>
  );
}

export default GameStatus;
