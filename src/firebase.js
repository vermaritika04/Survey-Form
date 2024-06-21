// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHnz7z3OdO2rnYvgY2S069Tgh5mdxil0M",
  authDomain: "survey-form-4f996.firebaseapp.com",
  projectId: "survey-form-4f996",
  storageBucket: "survey-form-4f996.appspot.com",
  messagingSenderId: "841669835064",
  appId: "1:841669835064:web:1031aa0da0a4883f7da9cd",
  measurementId: "G-597B9CP5NR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export default database;