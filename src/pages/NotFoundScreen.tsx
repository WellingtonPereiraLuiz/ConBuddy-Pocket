import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFoundScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="bg-primary/10 p-6 rounded-full inline-flex mx-auto mb-6">
        <AlertTriangle className="w-16 h-16 text-primary" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Página não encontrada</h2>
      <p className="text-text-secondary mb-8 max-w-md">
        Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido removida, renomeada ou está temporariamente indisponível.
      </p>
      
      <Link to="/">
        <Button>
          <Home className="mr-2 h-5 w-5" />
          Voltar para o início
        </Button>
      </Link>
    </motion.div>
  );
};

export default NotFoundScreen;