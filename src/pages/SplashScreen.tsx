import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

const SplashScreen = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-screen bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.3 
        }}
        className="text-white text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-white p-5 rounded-full">
            <Compass className="w-16 h-16 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Bolso ConBuddy</h1>
        <p className="text-white/80">Seu guia inteligente para eventos</p>
      </motion.div>
      
      <motion.div
        className="absolute bottom-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="animate-pulse-slow">
          <div className="w-8 h-8 border-t-4 border-white rounded-full animate-spin"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;