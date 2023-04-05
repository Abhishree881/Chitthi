import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRt3Dy84lo4duTS28mrvCmdPzCIS_KbbA",
  authDomain: "chatappdbms.firebaseapp.com",
  projectId: "chatappdbms",
  storageBucket: "chatappdbms.appspot.com",
  messagingSenderId: "732133841462",
  appId: "1:732133841462:web:cfb1c2fe80ff02fe7c9697",
  measurementId: "G-1HS77SSKC3",
};

// // Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
