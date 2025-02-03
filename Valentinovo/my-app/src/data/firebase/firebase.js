// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqRm9sFWkla3vwFesLCsFnfEfn9WXIQu0",
  authDomain: "valentinovo-128a4.firebaseapp.com",
  projectId: "valentinovo-128a4",
  storageBucket: "valentinovo-128a4.firebasestorage.app",
  messagingSenderId: "107725535097",
  appId: "1:107725535097:web:63066d9fac32ac214021a8",
  measurementId: "G-52HR781J21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);