import React from 'react';
import Layout from '../components/Layout';
import useExpenses from '../hooks/useExpenses'; 
import ExpenseTable from '../components/ExpenseTable'; 
import ExpensePieChart from '../components/PieChart'; 
import { useAuth } from '../context/AuthContext';
import { FaDollarSign, FaMoneyBillWave, FaWallet, FaChartPie, FaRegCreditCard } from 'react-icons/fa';

// Definição de cores (DEVE ser a mesma do PieChart.jsx)
const COLORS = ['#FF4C6A', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e74c3c'];


const Dashboard = () => {
  const { currentUser } = useAuth();
  
  const { 
    expenses, 
    loading, 
    error, 
    monthlyExpenses, 
    remainingBudget,
    totalIncomes, 
    totalBalance,
    expensesByCategory, 
    fetchExpensesAndBudgets
  } = useExpenses(); 
  
  const displayName = currentUser?.email.split('@')[0] || 'Usuário';

  const formatCurrency = (amount) => {
    const num = parseFloat(amount); 
    if (isNaN(num)) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const getRemainingColor = (amount) => {
    // Usando classes Padrões Tailwind
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getBalanceColor = (amount) => {
    // Usando classes Padrões Tailwind
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };
    
  // Dados dos cartões de resumo
  const summaryCards = [
    {
      title: "Saldo Total",
      value: totalBalance,
      color: getBalanceColor(totalBalance),
      icon: FaWallet,
      borderColor: 'border-green-500',
    },
    {
      title: "Receitas Acumuladas",
      value: totalIncomes,
      color: 'text-indigo-600',
      icon: FaMoneyBillWave,
      borderColor: 'border-indigo-500',
    },
    {
      title: "Despesas do Mês",
      value: monthlyExpenses * -1, 
      color: 'text-red-600',
      icon: FaRegCreditCard,
      borderColor: 'border-red-500',
    },
    {
      title: "Orçamento Restante",
      value: remainingBudget,
      color: getRemainingColor(remainingBudget),
      icon: FaDollarSign,
      borderColor: 'border-blue-500', 
    },
  ];

  return (
    <Layout>
      {/* Container principal com fundo CLARO (gray-50) e espaçamento */}
      <div className="p-10 bg-gray-50 min-h-screen"> 
        <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                👋 Olá, {displayName}!
            </h1>
            <p className="text-lg text-gray-600">
                Visão geral rápida de suas finanças.
            </p>
        </header>

        {/* --- Cartões de Resumo (Layout 4 colunas com GRID) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {summaryCards.map((card, index) => (
            <div 
                key={index}
                className={`p-6 bg-white border border-gray-200 rounded-xl shadow-lg transition-transform hover:shadow-xl transform hover:scale-[1.02] border-l-4 ${card.borderColor}`}
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <p className={`text-3xl font-bold ${card.color} mt-1`}>
                {loading ? '...' : formatCurrency(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* --- Layout de Duas Colunas (Gráfico + Tabela com GRID) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Coluna 1: Gráfico de Pizza (Ocupa 2/5) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center space-x-2">
                    <FaChartPie className="w-5 h-5 text-blue-600" />
                    <span>Distribuição de Despesas</span>
                </h2>
                
                {loading ? (
                    <div className="p-20 text-center text-blue-600">Carregando dados...</div>
                ) : (
                    <>
                        <ExpensePieChart data={expensesByCategory} />
                        
                        {/* Legenda colorida com bom contraste */}
                        {expensesByCategory.length > 0 && (
                            <div className="mt-4 text-sm space-y-2 max-h-40 overflow-y-auto pr-2">
                                {expensesByCategory.map((item, index) => (
                                    <div key={item.name} className="flex justify-between items-center text-gray-700 border-b border-gray-100 last:border-b-0 pb-1">
                                        <div className="flex items-center space-x-2">
                                            <div style={{ backgroundColor: COLORS[index % COLORS.length] }} className="w-3 h-3 rounded-full shadow-md"></div>
                                            <span className="font-semibold">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold">{item.percent}%</span>
                                            <span className="text-xs ml-2 text-gray-500">({formatCurrency(item.value)})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                         {/* Mensagem de fallback para quando não há dados */}
                        {expensesByCategory.length === 0 && (
                            <div className="text-center p-10 text-gray-500">
                                Nenhuma despesa registrada para o cálculo do gráfico.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Coluna 2: Histórico Recente de Despesas (Ocupa 3/5) */}
            <div className="lg:col-span-3">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Histórico Recente
                 </h2>
                
                {loading && (
                    <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-200">
                        <p className="text-lg text-blue-600">Carregando tabela...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center p-5 bg-red-100 text-red-600 border border-red-300 rounded">
                        <p>{error}</p>
                    </div>
                )}
                
                {!loading && !error && (
                    // O ExpenseTable pode precisar de estilo adicional para o tema claro, mas vamos manter por enquanto
                    <ExpenseTable expenses={expenses} onExpenseChange={fetchExpensesAndBudgets} /> 
                )}
            </div>
        </div>
        
      </div>
    </Layout>
  );
};

export default Dashboard;