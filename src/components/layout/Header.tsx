import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Menu, X, Bell, Trophy, User, LogOut, MessageSquare, ChevronDown, ChevronUp, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-indigo-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              BITS Games
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
              location.pathname === '/' ? 'text-indigo-500' : 'text-slate-200'
            }`}>
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                  location.pathname === '/dashboard' ? 'text-indigo-500' : 'text-slate-200'
                }`}>
                  Dashboard
                </Link>
                <Link to="/tournaments" className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                  location.pathname.includes('/tournaments') ? 'text-indigo-500' : 'text-slate-200'
                }`}>
                  Tournaments
                </Link>
              </>
            )}
            <Link to="/leaderboard" className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
              location.pathname === '/leaderboard' ? 'text-indigo-500' : 'text-slate-200'
            }`}>
              Leaderboard
            </Link>
          </nav>
          
          {/* Auth Buttons or User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <Link to="/dashboard" className="relative p-1 rounded-full hover:bg-slate-800">
                  <Bell className="h-5 w-5 text-slate-200" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                
                {/* Chat Link */}
                <Link to="/chat" className="p-1 rounded-full hover:bg-slate-800">
                  <MessageSquare className="h-5 w-5 text-slate-200" />
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500">
                      <img 
                        src={currentUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.username || 'User')}&background=random`} 
                        alt={currentUser?.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="hidden sm:inline-block text-sm font-medium text-slate-200">
                      {currentUser?.username}
                    </span>
                    {isProfileOpen ? 
                      <ChevronUp className="h-4 w-4 text-slate-400" /> : 
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    }
                  </button>
                  
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 py-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50"
                      >
                        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <Link to="/tournaments" className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">
                          <Trophy className="h-4 w-4 mr-2" />
                          My Tournaments
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-200 hover:text-white">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign up
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-slate-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-4 py-4">
                <Link to="/" className={`text-base font-medium ${
                  location.pathname === '/' ? 'text-indigo-500' : 'text-slate-200'
                }`}>
                  Home
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" className={`text-base font-medium ${
                      location.pathname === '/dashboard' ? 'text-indigo-500' : 'text-slate-200'
                    }`}>
                      Dashboard
                    </Link>
                    <Link to="/tournaments" className={`text-base font-medium ${
                      location.pathname.includes('/tournaments') ? 'text-indigo-500' : 'text-slate-200'
                    }`}>
                      Tournaments
                    </Link>
                    <Link to="/profile" className={`text-base font-medium ${
                      location.pathname === '/profile' ? 'text-indigo-500' : 'text-slate-200'
                    }`}>
                      Profile
                    </Link>
                    <Link to="/chat" className={`text-base font-medium ${
                      location.pathname === '/chat' ? 'text-indigo-500' : 'text-slate-200'
                    }`}>
                      Chat
                    </Link>
                  </>
                )}
                <Link to="/leaderboard" className={`text-base font-medium ${
                  location.pathname === '/leaderboard' ? 'text-indigo-500' : 'text-slate-200'
                }`}>
                  Leaderboard
                </Link>
                {isAuthenticated && (
                  <button 
                    onClick={handleLogout}
                    className="text-left text-base font-medium text-red-400"
                  >
                    Log out
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;