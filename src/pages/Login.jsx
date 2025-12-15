// Exemplo de como usar Tailwind para um Login Clean
import Input from '../components/Input';
import Button from '../components/Button'; // Você criaria este componente

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-gray">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-primary-blue mb-6">
          Entrar no Meu Orçamento
        </h2>
        <form>
          <Input label="Email" type="email" placeholder="seu@email.com" />
          <Input label="Senha" type="password" placeholder="••••••••" />
          <Button className="w-full mt-4 bg-primary-blue hover:bg-indigo-700">
            Fazer Login
          </Button>
          <p className="mt-4 text-center text-sm text-text-dark">
            Não tem uma conta?{' '}
            <a href="/register" className="text-primary-blue font-semibold hover:underline">
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;