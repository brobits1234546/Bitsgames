import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Send, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ChatPage = () => {
  const { currentUser } = useAuth();
  const { messages, sendMessage, clearChat } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    document.title = 'Chat - BITS Games';
  }, []);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };
  
  // Get all users from messages
  const getUsers = () => {
    const users = getFromLocalStorage<User[]>('users') || [];
    return users;
  };
  
  // Get user by ID
  const getUserById = (userId: string) => {
    const users = getUsers();
    return users.find(user => user.id === userId);
  };
  
  // Load users from localStorage
  interface User {
    id: string;
    username: string;
    profileImage?: string;
  }
  
  const getFromLocalStorage = <T,>(key: string): T | null => {
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error parsing data from localStorage for key "${key}":`, error);
      return null;
    }
  };
  
  return (
    <div className="h-[calc(100vh-200px)]">
      <motion.div 
        className="h-full flex flex-col card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">Team Chat</h1>
          <button 
            className="btn-ghost text-sm"
            onClick={clearChat}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Chat
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-slate-700 rounded-full p-4 mb-4">
                <Send className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No messages yet</h3>
              <p className="text-slate-400">
                Send a message to start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === currentUser?.id;
                const sender = getUserById(message.senderId);
                
                return (
                  <div 
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isCurrentUser && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                        <img 
                          src={sender?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(sender?.username || 'User')}&background=random`} 
                          alt={sender?.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                      <div 
                        className={`rounded-lg p-3 break-words ${
                          isCurrentUser 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-slate-700 text-white rounded-bl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className={`mt-1 text-xs text-slate-400 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="mr-1">{sender?.username || 'Unknown'}</span>
                        <span>• {format(new Date(message.timestamp), 'h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t border-slate-700">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="input flex-grow"
            />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!newMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPage;