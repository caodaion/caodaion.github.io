import firebase from "firebase/app";
import "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAnwlY1ftsfJLWfn-5PCbftOaQ1_4wRKxo",
  authDomain: "caodaion-5167e.firebaseapp.com",
  projectId: "caodaion-5167e",
  storageBucket: "caodaion-5167e.appspot.com",
  messagingSenderId: "671089239835",
  appId: "1:671089239835:web:d2ec42f54b02f0fed115be",
  measurementId: "G-8EMJZEB65T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();
