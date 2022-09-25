import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: 'fir-react-chat-8b117.firebaseapp.com',
  projectId: 'fir-react-chat-8b117',
  storageBucket: 'fir-react-chat-8b117.appspot.com',
  messagingSenderId: '786915545257',
  appId: '1:786915545257:web:393b2520984c1bd7ac19b8',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()

// Create a root reference
export const storage = getStorage()

//Create Firestore DB
export const db = getFirestore()
