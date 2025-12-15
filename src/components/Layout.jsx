import Sidebar from './Sidebar';

// Este layout deve ser usado para todas as rotas que não são Login/Register
const Layout = ({ children }) => {
  // Nota: Em um projeto real, você verificaria o estado de login aqui e redirecionaria para /login se necessário.
  
  return (
    <div className="flex bg-secondary-gray min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;