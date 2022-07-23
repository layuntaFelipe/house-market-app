import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoOebKIeuTE4BVpT-mVNSkaXHtchzRGn8",
  authDomain: "house-market-app-c2ee9.firebaseapp.com",
  projectId: "house-market-app-c2ee9",
  storageBucket: "house-market-app-c2ee9.appspot.com",
  messagingSenderId: "636078561874",
  appId: "1:636078561874:web:cde13d65ae2b04f22b1d8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();