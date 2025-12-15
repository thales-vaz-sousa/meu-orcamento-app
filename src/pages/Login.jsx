import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Chama a função de login do AuthContext
      await login(email, password);
      
      // Navega para o Dashboard após o login bem-sucedido
      navigate('/'); 
    } catch (err) {
      console.error("Erro no login:", err);
      
      // Tratamento de erros específicos do Firebase para mensagens amigáveis
      let errorMessage = 'Falha ao fazer login. Verifique seu e-mail e senha.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Credenciais inválidas. O e-mail ou senha estão incorretos.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Acesso temporariamente bloqueado devido a muitas tentativas falhas.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary-gray">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-primary-blue">
          Entrar na Conta
        </h2>
        
        {/* Exibição de Erros */}
        {error && (
          <div className="bg-danger-red/10 border-l-4 border-danger-red text-danger-red p-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="E-mail" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Senha" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-primary-blue hover:bg-indigo-700 font-bold transition duration-200"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="text-center text-sm text-text-dark">
          Ainda não tem uma conta?{' '}
          <Link to="/register" className="text-primary-blue hover:text-indigo-700 font-semibold">
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;