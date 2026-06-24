import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB9pH4EKr3-nBYkHBMQFokqBOgljMT_7O0",
  authDomain: "pour-pals.firebaseapp.com",
  projectId: "pour-pals",
  storageBucket: "pour-pals.firebasestorage.app",
  messagingSenderId: "14012079937",
  appId: "1:14012079937:web:89645270c69f594a21cbc0",
  measurementId: "G-EZJ43TD7D1"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// 匿名登录 — 点进链接就自动进，无需注册
export function signInAnon() {
  return signInAnonymously(auth)
}

export function onAuthChange(callback: (uid: string | null, name: string | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user.uid, user.displayName || null)
    } else {
      callback(null, null)
    }
  })
}
