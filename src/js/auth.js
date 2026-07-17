import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import { auth } from "../config/firebase.js";

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
  return signOut(auth);
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function requireAuth(redirectPath = "../index.html") {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.replace(redirectPath);
    }
  });
}

export function redirectAuthenticatedUser(path = "./pages/dashboard.html") {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.replace(path);
    }
  });
}
