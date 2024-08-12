import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxMbARoJOEit5lxpz1cwHpSb0GzCOWnQM",
  authDomain: "tarefasplus2024.firebaseapp.com",
  projectId: "tarefasplus2024",
  storageBucket: "tarefasplus2024.appspot.com",
  messagingSenderId: "171568346275",
  appId: "1:171568346275:web:85bcdfb732d57c76da3b16"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };