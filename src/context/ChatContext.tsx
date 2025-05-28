import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage } from '../types';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  clearChat: () => void;
  getUnreadCount: () => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Load messages from localStorage
    const storedMessages = getFromLocalStorage<ChatMessage[]>('chatMessages') || [];
    setMessages(storedMessages);
  }, []);

  const sendMessage = (content: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to send messages');
      return;
    }
    
    if (!content.trim()) {
      return;
    }
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      senderId: currentUser.id,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveToLocalStorage('chatMessages', updatedMessages);
  };

  const clearChat = () => {
    setMessages([]);
    saveToLocalStorage('chatMessages', []);
    toast.success('Chat cleared');
  };

  const getUnreadCount = () => {
    if (!currentUser) return 0;
    return messages.filter(m => !m.read && m.senderId !== currentUser.id).length;
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearChat, getUnreadCount }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};