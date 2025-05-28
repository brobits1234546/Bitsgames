import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { hashPassword, verifyPassword } from '../utils/auth';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Load user from localStorage on startup
    const storedUser = getFromLocalStorage<User>('currentUser');
    const storedUsers = getFromLocalStorage<User[]>('users') || [];
    
    if (storedUser && storedUsers.some(user => user.id === storedUser.id)) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Validate inputs
    if (!username || !email || !password) {
      toast.error('All fields are required');
      return false;
    }
    
    const users = getFromLocalStorage<User[]>('users') || [];
    
    // Check if username or email already exists
    if (users.some(user => user.username === username)) {
      toast.error('Username already taken');
      return false;
    }
    
    if (users.some(user => user.email === email)) {
      toast.error('Email already in use');
      return false;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`
    };
    
    // Save user
    users.push(newUser);
    saveToLocalStorage('users', users);
    
    // Auto-login
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    saveToLocalStorage('currentUser', newUser);
    
    toast.success('Registration successful!');
    return true;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = getFromLocalStorage<User[]>('users') || [];
    const user = users.find(u => u.username === username);
    
    if (!user) {
      toast.error('Invalid username or password');
      return false;
    }
    
    const passwordValid = await verifyPassword(password, user.password);
    
    if (!passwordValid) {
      toast.error('Invalid username or password');
      return false;
    }
    
    setCurrentUser(user);
    setIsAuthenticated(true);
    saveToLocalStorage('currentUser', user);
    
    toast.success('Login successful!');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};