import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmrjGjhd0UYl4r0NjC0p5x8H1ko46p6Fw",
  authDomain: "jordania-erp.firebaseapp.com",
  projectId: "jordania-erp",
  storageBucket: "jordania-erp.firebasestorage.app",
  messagingSenderId: "578453002858",
  appId: "1:578453002858:web:f7a75181f9351936d40813"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);