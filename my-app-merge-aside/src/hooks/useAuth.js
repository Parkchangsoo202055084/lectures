// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('이메일 로그인 성공!');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('새 계정 생성 및 로그인 성공!');
        } catch (createError) {
          console.error('계정 생성 실패:', createError);
        }
      } else if (error.code === 'auth/wrong-password') {
        console.error('잘못된 비밀번호입니다.');
      } else {
        console.error('이메일 로그인 실패:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    logout
  };
};