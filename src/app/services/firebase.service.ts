import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB6J9EvWTSJz0KMEdtvyIqrBUmRWRg5n3w',
  authDomain: 'daisukekaraoke-auth.firebaseapp.com',
  projectId: 'daisukekaraoke-auth',
  storageBucket: 'daisukekaraoke-auth.appspot.com',
  messagingSenderId: '348208515791',
  appId: '1:348208515791:web:0492ae073319f09d2445ba',
  measurementId: 'G-W3WM1VDRTF',
};

// Function to initialize Firebase
export function initializeFirebase() {
  // Checks if Firebase has already been initialized
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp(); // Returns the existing instance
  }
}

// Initializes Auth from the initialized app
export const app = initializeFirebase();
export const auth = getAuth(app);
