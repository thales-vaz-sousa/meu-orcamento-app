import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; 

// --- Páginas do Aplicativo ---
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ExpenseEntry from './pages/ExpenseEntry'; // ⚠️ CORRIGIDO: Assumindo o nome ExpenseEntry
import IncomeRegister from './pages/IncomeRegister';
import Orcamentos from './pages/Orcamentos'; // ⚠️ CORRIGIDO: Assumindo o nome Orcamentos


// Componente de Rota Protegida (Protege rotas que exigem login)
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    
    if (loading) {
        return <div className="flex items-center justify-center h-screen text-primary-blue text-xl">Carregando...</div>;
    }
    
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

// Componente principal
function App() {
  return (
    <Router>
        <AuthProvider>
            <Routes>
                
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* ---------------------------------------------------- */}
                {/* Rotas Protegidas */}
                {/* ---------------------------------------------------- */}
                
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/registrar-despesa" element={
                    <ProtectedRoute>
                        <ExpenseEntry /> {/* ⚠️ CORRIGIDO */}
                    </ProtectedRoute>
                } />

                <Route path="/registrar-receita" element={
                    <ProtectedRoute>
                        <IncomeRegister />
                    </ProtectedRoute>
                } />

                <Route path="/orcamentos" element={
                    <ProtectedRoute>
                        <Orcamentos /> {/* ⚠️ CORRIGIDO */}
                    </ProtectedRoute>
                } />
                
                <Route path="*" element={
                    <div className="flex flex-col items-center justify-center h-screen">
                        <h1 className="text-4xl font-bold text-danger-red">404</h1>
                        <p className="text-lg text-text-dark mt-2">Página não encontrada.</p>
                        {/* Redirecionamento pode ser melhorado com useNavigate ou Link */}
                        <a href="/dashboard" className="mt-4 text-primary-blue hover:underline">Voltar para o Dashboard</a>
                    </div>
                } />

            </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;