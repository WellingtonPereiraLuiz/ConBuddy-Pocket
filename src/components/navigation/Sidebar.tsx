import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Home, Heart, Bell, User, Map, Calendar, Compass, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../hooks/useFavorites';
import { useAgenda } from '../../hooks/useAgenda';
import { useNotifications } from '../../hooks/useNotifications';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const { agendaCount } = useAgenda();
  const { unreadCount } = useNotifications(user?.uid || 'user123');
  const navigate = useNavigate();

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Início',
      badge: null
    },
    { 
      path: '/favorites', 
      icon: Heart, 
      label: 'Favoritos',
      badge: favoritesCount > 0 ? favoritesCount : null
    },
    { 
      path: '/notifications', 
      icon: Bell, 
      label: 'Notificações',
      badge: unreadCount > 0 ? unreadCount : null
    },
    { 
      path: '/agenda', 
      icon: Calendar, 
      label: 'Minha Agenda',
      badge: agendaCount > 0 ? agendaCount : null
    },
    { 
      path: '/profile', 
      icon: User, 
      label: 'Perfil',
      badge: null
    },
    { 
      path: '/map', 
      icon: Map, 
      label: 'Mapa',
      badge: null
    }
  ];

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="flex items-center mb-8">
        <Compass className="w-8 h-8 text-primary mr-2" />
        <h1 className="text-xl font-bold">ConBuddy</h1>
      </div>

      <div className="flex flex-col flex-1">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Perfil do Usuário */}
      <div
        className="flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        onClick={handleProfileClick}
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{user?.displayName || 'Usuário'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      {/* Botão de Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center p-4 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors mt-2"
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span>Sair</span>
      </button>
    </aside>
  );
};

export default Sidebar;