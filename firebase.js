// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAkzrWlExBtCHWa6L4FUGWIShO-YJJXk50',
  authDomain: 'invoice-app-f5c53.firebaseapp.com',
  projectId: 'invoice-app-f5c53',
  storageBucket: 'invoice-app-f5c53.appspot.com',
  messagingSenderId: '990303275567',
  appId: '1:990303275567:web:5b11615f7d2d99ec2554da',
  measurementId: 'G-7ELS0C94C3',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }
