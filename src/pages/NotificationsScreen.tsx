import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Calendar, Info, AlertTriangle, Sparkles, Users, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { formatDate } from '../services/mockData';

const NotificationsScreen = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    loading, 
    error,
    markAsRead,
    markAllAsRead
  } = useNotifications(user?.uid || 'user123');
  
  useEffect(() => {
    // Marcar notificações como visualizadas quando a página é aberta
  }, []);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'ai':
        return <Sparkles className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'location':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'bg-primary/10 text-primary';
      case 'alert':
        return 'bg-warning/10 text-warning';
      case 'ai':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'social':
        return 'bg-secondary/10 text-secondary';
      case 'location':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          {notifications.length > 0 && (
            <p className="text-sm text-text-secondary mt-1">
              {notifications.filter(n => !n.isRead).length} não lidas de {notifications.length} total
            </p>
          )}
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" onClick={handleMarkAllAsRead} size="sm">
            Marcar todas como lidas
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="bg-error/10 p-4 rounded-lg">
            <p className="text-error">{error}</p>
          </div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 1 }}
              whileHover={{ scale: 0.99 }}
              className={`card p-4 transition-all duration-200 ${
                !notification.isRead 
                  ? 'border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex">
                <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold truncate pr-2 ${
                      !notification.isRead ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {notification.title}
                      {!notification.isRead && (
                        <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2"></span>
                      )}
                    </h3>
                    <span className="text-xs text-text-secondary flex-shrink-0">
                      {formatDate(notification.timestamp, 'dd MMM, HH:mm')}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-3 text-sm leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex justify-between items-center">
                    {notification.eventId ? (
                      <Link 
                        to={`/event/${notification.eventId}`} 
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        Ver evento →
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-text-secondary text-sm hover:text-primary transition-colors"
                      >
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full inline-flex mx-auto mb-4">
            <Bell className="w-12 h-12 text-text-secondary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Sem notificações</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Você não tem notificações no momento. Quando houver novidades sobre eventos, 
            atualizações ou recomendações personalizadas, você será notificado aqui!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsScreen;