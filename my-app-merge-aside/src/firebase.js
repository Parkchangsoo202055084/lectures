// src/firebase.js

// Firebase 앱 및 Firestore, Auth SDK를 가져옵니다.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 여러분의 Firebase 프로젝트 설정 정보입니다.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBrRxaKFrT96sbO8NVt_Jp5RbaoYz2RK9Y",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "lectures-84eaa.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "lectures-84eaa",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "lectures-84eaa.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1037373196085",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1037373196085:web:8b53a6ce80287d4eadee7c",
};

// Firebase 앱을 초기화합니다.
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 객체를 만들고 내보냅니다.
export const db = getFirestore(app);

// Firebase Auth 객체를 만들고 내보냅니다.
export const auth = getAuth(app);