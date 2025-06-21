import { useState, useEffect } from 'react';
import { Notification } from '../models/types';
import { mockNotifications } from '../services/mockData';

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 300));

        const userNotifications = mockNotifications.filter(
          notification => notification.id === userId
        );

        setNotifications(userNotifications);

        const count = userNotifications.filter(n => !n.isRead).length;
        setUnreadCount(count);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Erro ao carregar notificações. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );

      setUnreadCount(prev =>
        Math.max(0, prev - 1)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};