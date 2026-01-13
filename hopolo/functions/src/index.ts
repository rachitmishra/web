import * as admin from 'firebase-admin';

admin.initializeApp();

export const helloWorld = () => {
  console.log('Hello World');
};
