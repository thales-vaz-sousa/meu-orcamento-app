import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem.');
    }
    
    if (password.length < 6) {
        return setError('A senha deve ter pelo menos 6 caracteres.');
    }

    try {
      setLoading(true);
      await signup(email, password); 
      navigate('/'); // Redireciona para a rota protegida
    } catch (err) {
      console.error(err);
      setError('Falha ao cadastrar. Verifique o email ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-gray p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-primary-blue mb-6">
          Criar Nova Conta
        </h2>
        
        {error && (
          <div className="bg-danger-red/10 border-l-4 border-danger-red text-danger-red p-3 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            type="email" 
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Senha (Mínimo 6 caracteres)" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input 
            label="Confirmar Senha" 
            type="password" 
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button 
            className="w-full mt-6 bg-success-green hover:bg-green-700" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
          <p className="mt-4 text-center text-sm text-text-dark">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-blue font-semibold hover:underline">
              Fazer Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;