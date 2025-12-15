import React from 'react';
import Layout from '../components/Layout';

// Componente para um Card de Estatística Reutilizável
const StatCard = ({ name, value, colorClass, icon }) => (
  <div className="p-6 bg-white rounded-xl shadow-custom hover:shadow-lg transition duration-300 border-l-4 border-primary-blue">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{name}</p>
      <span className={`text-xl ${colorClass}`}>{icon}</span>
    </div>
    <p className={`mt-2 text-4xl font-extrabold ${colorClass}`}>{value}</p>
  </div>
);

// Componente Principal do Dashboard
const Dashboard = () => {
  // Dados de Exemplo (Em uma aplicação real, viriam de uma API/Contexto)
  const stats = [
    { name: 'Saldo Disponível', value: 'R$ 5.450,00', color: 'text-success-green', icon: '✅' },
    { name: 'Orçamento Restante', value: 'R$ 1.200,00', color: 'text-primary-blue', icon: '⏳' },
    { name: 'Total de Despesas', value: 'R$ 3.800,00', color: 'text-danger-red', icon: '🔻' },
  ];

  // Dados de Exemplo para o Histórico/Transações Recentes
  const recentTransactions = [
    { id: 1, description: 'Mensalidade Academia', amount: -120.00, date: '14/12/2025', type: 'Despesa' },
    { id: 2, description: 'Salário (Dezembro)', amount: 6000.00, date: '05/12/2025', type: 'Receita' },
    { id: 3, description: 'Compra Supermercado', amount: -450.75, date: '01/12/2025', type: 'Despesa' },
  ];
  
  // Função auxiliar para determinar a cor do texto na tabela
  const getAmountColor = (amount) => {
    return amount > 0 ? 'text-success-green' : 'text-danger-red';
  };

  return (
    <Layout>
      <h1 className="text-4xl font-extrabold text-text-dark mb-8">
        Visão Geral do Mês 👋
      </h1>

      {/* 📊 Seção de Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard 
            key={stat.name}
            name={stat.name}
            value={stat.value}
            colorClass={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* 📈 Seção de Gráficos (Inovador e Moderno) */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-10">
          <h3 className="text-2xl font-bold text-text-dark mb-4 border-b pb-2">
              Progresso do Orçamento (Dezembro)
          </h3>
          <div className="h-80 flex items-center justify-center bg-secondary-gray/30 rounded-lg">
             {/* Aqui entraria o GRÁFICO (usando uma biblioteca como Recharts ou Chart.js).
               Ele mostraria visualmente o quanto foi gasto em relação ao orçamento. 
             */}
             <p className="text-gray-500 italic">
                Espaço para Gráfico de Despesas por Categoria ou Fluxo de Caixa.
             </p>
          </div>
      </div>
      
      {/* 🧾 Histórico de Transações Recentes */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-text-dark mb-6 border-b pb-2">
            Transações Recentes
        </h3>
        
        {/* Tabela Clean e Minimalista */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-secondary-gray">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition duration-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-dark">{tx.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'Receita' ? 'bg-success-green/20 text-success-green' : 'bg-danger-red/20 text-danger-red'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${getAmountColor(tx.amount)}`}>
                    {tx.amount < 0 ? `- R$ ${Math.abs(tx.amount).toFixed(2).replace('.', ',')}` : `+ R$ ${tx.amount.toFixed(2).replace('.', ',')}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </Layout>
  );
};

export default Dashboard;