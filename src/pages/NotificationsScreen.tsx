import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Calendar, Info, AlertTriangle } from 'lucide-react';
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
  } = useNotifications(user?.uid || 'user123'); // Use mock ID for demo
  
  useEffect(() => {
    // Mark notifications as viewed when the page is opened
    // In a real app, you might want to mark them as read only when they're actually viewed
  }, []);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
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
      default:
        return 'bg-secondary/10 text-secondary';
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
        <h1 className="text-2xl font-bold">Notificações</h1>
        {notifications.length > 0 && (
          <Button variant="ghost" onClick={handleMarkAllAsRead}>
            Marcar todas como lidas
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-error">{error}</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 1 }}
              whileHover={{ scale: 0.99 }}
              className={`card p-4 ${!notification.isRead ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex">
                <div className={`p-3 rounded-full mr-4 ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${!notification.isRead ? 'text-primary' : ''}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-text-secondary">
                      {formatDate(notification.timestamp, 'dd MMM, HH:mm')}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-2">{notification.message}</p>
                  <div className="flex justify-between items-center">
                    {notification.eventId ? (
                      <Link to={`/event/${notification.eventId}`} className="text-primary text-sm font-medium">
                        Ver evento
                      </Link>
                    ) : (
                      <div></div> // Empty div to maintain the flex layout
                    )}
                    
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-text-secondary text-sm hover:text-primary"
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
          <p className="text-text-secondary">
            Você não tem notificações no momento. Confira novamente mais tarde!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsScreen;