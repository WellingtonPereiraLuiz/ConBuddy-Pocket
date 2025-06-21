import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Compass, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/', { replace: true }); // Adicionado { replace: true }
    } catch (err) {
      console.error(err);
      setError('Email ou senha incorretos. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Compass className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
          <p className="text-text-secondary">Faça login para continuar sua jornada</p>
        </div>
        
        {error && (
          <div className="bg-error/10 p-4 rounded-lg mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-error mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder="********"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                Esqueceu a senha?
              </a>
            </div>
          </div>
          
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-text-secondary">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginScreen;