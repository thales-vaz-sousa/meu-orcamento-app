import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ExpenseEntry from './pages/ExpenseEntry';
// Importe as outras telas quando as criar (Register, Budget, Reports)

function App() {
  return (
    // O Router engloba toda a aplicação
    <Router>
      <Routes>
        {/* Rota para as telas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<p>Tela de Cadastro (A ser implementada)</p>} />
        
        {/* Rota Protegida (Idealmente, você verificaria se o usuário está logado aqui) */}
        <Route path="/" element={<Dashboard />} /> {/* Rota inicial após login */}
        <Route path="/despesa/nova" element={<ExpenseEntry />} />
        {/* Outras Rotas protegidas (Budget Management, Reports, Profile) */}
        <Route path="/orcamentos" element={<p>Gestão de Orçamentos (A ser implementada)</p>} />
        <Route path="/relatorios" element={<p>Relatórios e Análises (A ser implementada)</p>} />

        {/* Rota para Not Found (Opcional) */}
        <Route path="*" element={<p className="text-center mt-20 text-xl font-bold">404 - Página não encontrada</p>} />
      </Routes>
    </Router>
  );
}

export default App;