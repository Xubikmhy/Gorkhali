import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Safely access environment variables with fallbacks for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Check if any Firebase apps are already initialized
let app
let auth
let db
let storage

// Only initialize Firebase if we're in a browser and it hasn't been initialized yet
if (isBrowser) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)

    // Create mock services for development/preview
    auth = {} as ReturnType<typeof getAuth>
    db = {} as ReturnType<typeof getFirestore>
    storage = {} as ReturnType<typeof getStorage>
  }
} else {
  // Server-side placeholder objects
  auth = {} as ReturnType<typeof getAuth>
  db = {} as ReturnType<typeof getFirestore>
  storage = {} as ReturnType<typeof getStorage>
}

export { app, auth, db, storage }
