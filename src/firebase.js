import firebase from 'firebase/app';
import 'firebase/firestore';


const config = {
    apiKey: "AIzaSyBmxgjCOGiaA5AufjAs_qDfYGVa8Th0YWE",
    authDomain: "habit-reminder-653cd.firebaseapp.com",
    databaseURL: "https://habit-reminder-653cd.firebaseio.com",
    projectId: "habit-reminder-653cd",
    storageBucket: "habit-reminder-653cd.appspot.com",
    messagingSenderId: "369945436017",
    appId: "1:369945436017:web:f5d62a8f20ba0e9a1920d0"
  };
  // Initialize Firebase
  firebase.initializeApp(config);
  const database = firebase.firestore()

export default database