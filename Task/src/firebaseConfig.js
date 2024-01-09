import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "graduation-task-17777.firebaseapp.com",
  projectId: "graduation-task-17777",
  storageBucket: "graduation-task-17777.appspot.com",
  messagingSenderId: "8783741869", 
  appId: "1:8783741869:web:ef27e88ac3ac0ae55b5724"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };