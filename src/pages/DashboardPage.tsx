import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useNotification } from '../context/NotificationContext';
import { Trophy, Star, Users, Calendar, PlusCircle, Bell, CheckCircle, Gamepad2 } from 'lucide-react';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { getUserTournaments, getUserStats, getGameById } = useGame();
  const { notifications, markAsRead } = useNotification();
  
  useEffect(() => {
    document.title = 'Dashboard - BITS Games';
  }, []);
  
  const userTournaments = getUserTournaments();
  const userStats = getUserStats(currentUser?.id || '');
  
  // Get user notifications
  const userNotifications = notifications
    .filter(n => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        className="bg-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500">
            <img 
              src={currentUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.username || 'User')}&background=random`} 
              alt={currentUser?.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Welcome, {currentUser?.username}</h1>
            <p className="text-slate-400">Track your gaming progress and upcoming tournaments</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/tournaments" className="btn-primary">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Tournament
          </Link>
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Wins</h3>
            <Trophy className="h-6 w-6 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold">{userStats?.wins || 0}</p>
          <p className="text-slate-400 text-sm">Across all games</p>
        </motion.div>
        
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall Rank</h3>
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">#{userStats?.rank || '-'}</p>
          <p className="text-slate-400 text-sm">Among all players</p>
        </motion.div>
        
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tournaments</h3>
            <Users className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold">{userTournaments.length}</p>
          <p className="text-slate-400 text-sm">Participated in</p>
        </motion.div>
        
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Games Played</h3>
            <Gamepad2 className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">{userStats?.gamesPlayed || 0}</p>
          <p className="text-slate-400 text-sm">Total matches</p>
        </motion.div>
      </div>
      
      {/* Tournaments and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Tournaments */}
        <motion.div 
          className="lg:col-span-2 card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your Tournaments</h2>
            <Link to="/tournaments" className="text-indigo-500 hover:text-indigo-400 text-sm">
              View All
            </Link>
          </div>
          
          {userTournaments.length > 0 ? (
            <div className="space-y-4">
              {userTournaments.slice(0, 3).map((tournament) => {
                const game = getGameById(tournament.gameId);
                return (
                  <Link 
                    key={tournament.id}
                    to={`/tournaments/${tournament.id}`}
                    className="block bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{tournament.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-slate-400 mr-4">Game: {game?.name}</span>
                          <span className="text-xs px-2 py-1 rounded bg-slate-600 text-slate-300">
                            {tournament.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {format(new Date(tournament.startDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <Users className="h-4 w-4 text-slate-400 mr-1" />
                      <span className="text-sm text-slate-400">
                        {tournament.participants.length} participants
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">You haven't joined any tournaments yet</p>
              <Link to="/tournaments" className="btn-primary">
                Browse Tournaments
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* Notifications */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Notifications</h2>
            <Bell className="h-5 w-5 text-slate-400" />
          </div>
          
          {userNotifications.length > 0 ? (
            <div className="space-y-4">
              {userNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg ${notification.read ? 'bg-slate-800/50' : 'bg-slate-700/50 border-l-2 border-indigo-500'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <p className={`text-sm ${notification.read ? 'text-slate-400' : 'text-slate-200'}`}>
                      {notification.content}
                    </p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No new notifications</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;