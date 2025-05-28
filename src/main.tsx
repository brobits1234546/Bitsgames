import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';
import { initializeDemoData } from './utils/storage';

// Initialize demo data
initializeDemoData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <ChatProvider>
            <NotificationProvider>
              <App />
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#1e293b',
                    color: '#f8fafc',
                    border: '1px solid #334155'
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#f8fafc'
                    }
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#f8fafc'
                    }
                  }
                }}
              />
            </NotificationProvider>
          </ChatProvider>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);