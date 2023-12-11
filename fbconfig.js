import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADncoOPo0aPojMf-sc-YW1p7skWH3NgXg",
  authDomain: "travelsnapbackend.firebaseapp.com",
  projectId: "travelsnapbackend",
  storageBucket: "travelsnapbackend.appspot.com",
  messagingSenderId: "858582959972",
  appId: "1:858582959972:web:cbd8e2f0ea627e37051c71",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
