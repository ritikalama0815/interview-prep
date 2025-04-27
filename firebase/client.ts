// Import the functions you need from the SDKs you need
import {initializeApp, getApps, getApp} from 'firebase/app'
import { getFirestore } from '@firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp3KArJP5bFct5o_4sBFGJOqJnEAl61xY",
  authDomain: "yuegui-d636b.firebaseapp.com",
  projectId: "yuegui-d636b",
  storageBucket: "yuegui-d636b.firebasestorage.app",
  messagingSenderId: "670263647323",
  appId: "1:670263647323:web:ecf8b107db259edc28337e",
  measurementId: "G-2JXL74H6FN"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db=getFirestore(app);