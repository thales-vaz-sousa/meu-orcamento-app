import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

/**
 * Componente que verifica se o usuário está autenticado.
 * Se estiver logado, renderiza o conteúdo da rota (Outlet).
 * Caso contrário, redireciona para a tela de Login.
 */
const PrivateRoute = () => {
  const { currentUser, loading } = useAuth(); // Pega o usuário e o estado de carregamento do Firebase

  // 1. Aguarda o Firebase verificar o estado inicial do usuário
  if (loading) {
    // Você pode colocar um spinner ou uma tela de carregamento bonita aqui
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-gray">
        <p className="text-xl font-semibold text-primary-blue">
            Carregando usuário...
        </p>
      </div>
    );
  }

  // 2. Se o usuário estiver logado, permite a navegação para a rota filha.
  // O <Outlet /> renderiza o componente que está dentro do PrivateRoute no App.jsx (ex: Dashboard).
  if (currentUser) {
    return <Outlet />;
  } 
  
  // 3. Se não estiver logado, redireciona para a tela de Login.
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;