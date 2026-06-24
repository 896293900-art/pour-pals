import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

// ⚠️ 把你自己的 Firebase 配置填这里
// Firebase Console → 项目设置 → 您的应用 → Web 应用 → 复制配置
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
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
