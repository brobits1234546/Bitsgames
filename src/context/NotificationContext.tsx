import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../types';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (userId: string, type: Notification['type'], content: string, referenceId?: string) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // Load notifications from localStorage
    const storedNotifications = getFromLocalStorage<Notification[]>('notifications') || [];
    setNotifications(storedNotifications);
  }, []);

  useEffect(() => {
    // Update unread count whenever notifications or current user changes
    if (currentUser) {
      const userNotifications = notifications.filter(n => n.userId === currentUser.id);
      const unread = userNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [notifications, currentUser]);

  const addNotification = (userId: string, type: Notification['type'], content: string, referenceId?: string) => {
    const newNotification: Notification = {
      id: uuidv4(),
      userId,
      type,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      referenceId
    };
    
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    saveToLocalStorage('notifications', updatedNotifications);
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    saveToLocalStorage('notifications', updatedNotifications);
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    
    const updatedNotifications = notifications.map(notification => 
      notification.userId === currentUser.id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    saveToLocalStorage('notifications', updatedNotifications);
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    
    const updatedNotifications = notifications.filter(notification => notification.userId !== currentUser.id);
    setNotifications(updatedNotifications);
    saveToLocalStorage('notifications', updatedNotifications);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};