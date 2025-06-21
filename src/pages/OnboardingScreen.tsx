import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ChevronRight, ChevronLeft, Map, Calendar, Bell, Navigation } from 'lucide-react';

const OnboardingScreen = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  
  const slides = [
    {
      title: 'Bem-vindo ao Bolso ConBuddy',
      description: 'Seu guia inteligente para eventos geek!',
      icon: <Navigation className="w-12 h-12 text-primary" />,
      color: 'bg-primary/10',
    },
    {
      title: 'Descubra eventos',
      description: 'Encontre os melhores eventos e painéis baseados nos seus interesses.',
      icon: <Map className="w-12 h-12 text-secondary" />,
      color: 'bg-secondary/10',
    },
    {
      title: 'Agenda personalizada',
      description: 'Crie sua agenda com os eventos que você não quer perder.',
      icon: <Calendar className="w-12 h-12 text-accent" />,
      color: 'bg-accent/10',
    },
    {
      title: 'Notificações em tempo real',
      description: 'Receba alertas sobre os eventos que estão prestes a começar.',
      icon: <Bell className="w-12 h-12 text-success" />,
      color: 'bg-success/10',
    },
  ];
  
  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/login');
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const handleSkip = () => {
    navigate('/login');
  };
  
  return (
    <div className="h-screen flex flex-col">
      {/* Progress bar */}
      <div className="flex w-full">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 flex-1 transition-all duration-300 ${index <= step ? 'bg-primary' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      
      {/* Skip button */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={handleSkip}
          className="text-text-secondary font-medium"
        >
          Pular
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className={`${slides[step].color} p-6 rounded-full inline-flex mx-auto mb-8`}>
            {slides[step].icon}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{slides[step].title}</h1>
          <p className="text-text-secondary mb-8">{slides[step].description}</p>
        </motion.div>
      </div>
      
      {/* Navigation buttons */}
      <div className="p-8 flex justify-between">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          disabled={step === 0}
          className={step === 0 ? 'invisible' : ''}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Button onClick={handleNext}>
          {step === slides.length - 1 ? 'Começar' : 'Próximo'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingScreen;