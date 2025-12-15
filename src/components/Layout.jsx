import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaMinusCircle, FaPlusCircle, FaRegCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

// O Layout principal da sua aplicação (Sidebar + Conteúdo)
const Layout = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Falha ao fazer logout:", error);
            alert("Erro ao sair. Tente novamente.");
        }
    };

    // Definição dos links de navegação
    const navLinks = [
        { path: '/dashboard', name: 'Dashboard', icon: FaTachometerAlt },
        { path: '/registrar-despesa', name: 'Reg. Despesa', icon: FaMinusCircle },
        { path: '/registrar-receita', name: 'Reg. Receita', icon: FaPlusCircle }, // Ajuste o path se for diferente
        { path: '/orcamentos', name: 'Orçamentos', icon: FaRegCalendarAlt },
    ];

    return (
        // 1. CONTAINER GERAL: Fundo CLARO (Branco) e texto escuro
        <div className="flex min-h-screen bg-gray-100 text-gray-900">
            
            {/* 2. SIDEBAR */}
            <aside className="w-64 bg-white shadow-xl flex flex-col justify-between p-4">
                <div>
                    <div className="text-2xl font-extrabold text-blue-600 mb-8 border-b pb-2">
                        Meu Orçamento
                    </div>
                    
                    {/* Links de Navegação */}
                    <nav className="space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition duration-150"
                            >
                                <link.icon className="w-5 h-5" />
                                <span className="font-semibold">{link.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Botão de Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 mt-4 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition duration-150"
                >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span className="font-semibold">Sair</span>
                </button>
            </aside>

            {/* 3. CONTEÚDO PRINCIPAL (Dashboard, Register Expense, etc.) */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;