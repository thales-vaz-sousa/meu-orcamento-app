import { NavLink } from 'react-router-dom';
// Ícones: Recomendo instalar 'react-icons' (npm install react-icons)
// Exemplo: import { Home, DollarSign, BarChart, Settings, LogOut } from 'lucide-react'; // ou react-icons

const navItems = [
  { name: 'Dashboard', path: '/', icon: '🏠' },
  { name: 'Nova Despesa', path: '/despesa/nova', icon: '📝' },
  { name: 'Gerenciar Orçamentos', path: '/orcamentos', icon: '💰' },
  { name: 'Relatórios', path: '/relatorios', icon: '📈' },
];

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-100 h-screen shadow-2xl">
      
      {/* 💳 Logo */}
      <div className="p-6 text-center border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-primary-blue tracking-wider">
          MEU BUDGET
        </h1>
      </div>
      
      {/* 🧭 Navegação */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            // Usa classes diferentes se estiver ativo (destaque moderno)
            className={({ isActive }) => 
              `flex items-center p-3 my-2 rounded-lg transition duration-150 ease-in-out font-medium 
              ${isActive 
                ? 'bg-primary-blue text-white shadow-lg' 
                : 'text-gray-600 hover:bg-secondary-gray'}`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      {/* ⚙️ Configurações / Logout */}
      <div className="p-4 border-t border-gray-100">
        <NavLink to="/profile" className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-secondary-gray font-medium">
          <span className="mr-3 text-lg">👤</span>
          Configurações
        </NavLink>
        <button className="flex items-center p-3 w-full rounded-lg text-danger-red hover:bg-red-50 font-medium mt-2">
          <span className="mr-3 text-lg">🚪</span>
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;