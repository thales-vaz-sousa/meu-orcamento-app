import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // <-- NOVO: Importa o Firestore

// ⚠️ CONFIGURAÇÃO DO SEU FIREBASE (SUBSTITUA ESTES VALORES!)
const firebaseConfig = {
  apiKey: "AIzaSyDhhHM5VPq5UJo4aF_ji7y0tw3oH6-5fF4",
  authDomain: "test-budget-55b2c.firebaseapp.com",
  projectId: "test-budget-55b2c",
  storageBucket: "test-budget-55b2c.firebasestorage.app",
  messagingSenderId: "203669315542",
  appId: "1:203669315542:web:da24ca392ef2c8c5044e77",
  measurementId: "G-3Q6Y9B8SCS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // <-- EXPORTE O AUTH AQUI
export const db = getFirestore(app); // <-- EXPORTE O DB AQUI (Já estava, mas reconfirme)

const AuthContext = createContext();

// Hook personalizado para usar a autenticação facilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funções de Autenticação
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  // Monitora o estado de autenticação (mantém o usuário logado)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Só renderiza a aplicação (children) depois que o Firebase 
        verificar o estado inicial de autenticação (evita redirecionamentos rápidos).
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
};