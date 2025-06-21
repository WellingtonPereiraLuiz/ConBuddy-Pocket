import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, Heart, Bell, User, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/navigation/Sidebar';

const MainLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Explorar Eventos';
      case '/favorites':
        return 'Meus Favoritos';
      case '/notifications':
        return 'Notificações';
      case '/profile':
        return 'Meu Perfil';
      case '/map':
        return 'Mapa do Evento';
      default:
        if (location.pathname.includes('/event/')) {
          return 'Detalhes do Evento';
        }
        return 'Bolso ConBuddy';
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/favorites', icon: Heart, label: 'Favoritos' },
    { path: '/notifications', icon: Bell, label: 'Notificações' },
    { path: '/profile', icon: User, label: 'Perfil' },
    { path: '/map', icon: Map, label: 'Mapa' }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 bg-white dark:bg-card z-30 border-b border-border md:ml-64`}
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : -64 }}
        transition={{ duration: 0.2 }}
      >
        <div className="container h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Main content */}
      <main className="main-content pt-16 pb-16">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="bottom-nav md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MainLayout;