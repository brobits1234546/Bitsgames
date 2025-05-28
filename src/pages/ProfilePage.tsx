import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Trophy, Star, Users, Calendar, ChevronDown, ChevronUp, TowerControl as GameController } from 'lucide-react';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { getUserStats, getUserTournaments, getGameById, getPlayerRanking } = useGame();
  const [activeTab, setActiveTab] = useState<'overview' | 'tournaments' | 'stats'>('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    recentActivity: true,
    gameStats: true
  });
  
  useEffect(() => {
    document.title = 'Profile - BITS Games';
  }, []);
  
  const userStats = getUserStats(currentUser?.id || '');
  const userTournaments = getUserTournaments();
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div 
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500">
            <img 
              src={currentUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=random`} 
              alt={currentUser.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-2xl font-bold">{currentUser.username}</h1>
            <p className="text-slate-400">Member since {format(new Date(currentUser.createdAt), 'MMMM yyyy')}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              <div className="badge-primary flex items-center">
                <Trophy className="h-3 w-3 mr-1" />
                Rank #{userStats?.rank || '-'}
              </div>
              <div className="badge-secondary flex items-center">
                <Star className="h-3 w-3 mr-1" />
                {userStats?.wins || 0} Wins
              </div>
              <div className="badge flex items-center bg-slate-700 text-slate-200">
                <GameController className="h-3 w-3 mr-1" />
                {userStats?.gamesPlayed || 0} Games Played
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button 
          className={`px-4 py-2 font-medium ${
            activeTab === 'overview' 
              ? 'text-indigo-500 border-b-2 border-indigo-500' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 font-medium ${
            activeTab === 'tournaments' 
              ? 'text-indigo-500 border-b-2 border-indigo-500' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('tournaments')}
        >
          Tournaments
        </button>
        <button 
          className={`px-4 py-2 font-medium ${
            activeTab === 'stats' 
              ? 'text-indigo-500 border-b-2 border-indigo-500' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Overall Rank</h3>
                  <Trophy className="h-5 w-5 text-indigo-500" />
                </div>
                <p className="text-3xl font-bold">#{userStats?.rank || '-'}</p>
                <p className="text-sm text-slate-400">Among all players</p>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Win/Loss Ratio</h3>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold">
                  {userStats ? (
                    userStats.wins + userStats.losses > 0 
                      ? `${Math.round((userStats.wins / (userStats.wins + userStats.losses)) * 100)}%`
                      : '0%'
                  ) : '0%'}
                </p>
                <div className="mt-2 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500"
                    style={{ 
                      width: userStats && (userStats.wins + userStats.losses) > 0
                        ? `${(userStats.wins / (userStats.wins + userStats.losses)) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>W: {userStats?.wins || 0}</span>
                  <span>L: {userStats?.losses || 0}</span>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Tournaments</h3>
                  <Users className="h-5 w-5 text-emerald-500" />
                </div>
                <p className="text-3xl font-bold">{userTournaments.length}</p>
                <p className="text-sm text-slate-400">Participated in</p>
              </div>
            </motion.div>
            
            {/* Recent Activity */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div 
                className="p-4 border-b border-slate-700 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('recentActivity')}
              >
                <h2 className="font-bold">Recent Activity</h2>
                {expandedSections.recentActivity ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>
              
              {expandedSections.recentActivity && (
                userTournaments.length > 0 ? (
                  <div className="divide-y divide-slate-700">
                    {userTournaments.slice(0, 5).map((tournament) => {
                      const game = getGameById(tournament.gameId);
                      return (
                        <div key={tournament.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{tournament.name}</h3>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-slate-400">Game: {game?.name}</span>
                                <span className="mx-2 text-slate-600">•</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                                  {tournament.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-slate-400">
                              {format(new Date(tournament.startDate), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400">No recent activity</p>
                  </div>
                )
              )}
            </motion.div>
            
            {/* Game-Specific Stats */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div 
                className="p-4 border-b border-slate-700 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('gameStats')}
              >
                <h2 className="font-bold">Game Statistics</h2>
                {expandedSections.gameStats ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>
              
              {expandedSections.gameStats && (
                userStats && Object.keys(userStats.gameStats).length > 0 ? (
                  <div className="divide-y divide-slate-700">
                    {Object.entries(userStats.gameStats).map(([gameId, stats]) => {
                      const game = getGameById(gameId);
                      const rank = getPlayerRanking(currentUser.id, gameId);
                      return (
                        <div key={gameId} className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{game?.name}</h3>
                            <div className="badge-primary flex items-center">
                              Rank #{rank}
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-slate-400">Wins</p>
                              <p className="font-bold text-green-400">{stats.wins}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">Losses</p>
                              <p className="font-bold text-red-400">{stats.losses}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">Win Rate</p>
                              <p className="font-bold">
                                {stats.wins + stats.losses > 0 
                                  ? `${Math.round((stats.wins / (stats.wins + stats.losses)) * 100)}%`
                                  : '0%'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500"
                              style={{ 
                                width: (stats.wins + stats.losses) > 0
                                  ? `${(stats.wins / (stats.wins + stats.losses)) * 100}%`
                                  : '0%'
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <GameController className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400">No game statistics yet</p>
                  </div>
                )
              )}
            </motion.div>
          </>
        )}
        
        {activeTab === 'tournaments' && (
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 border-b border-slate-700">
              <h2 className="font-bold">My Tournaments</h2>
            </div>
            
            {userTournaments.length > 0 ? (
              <div className="divide-y divide-slate-700">
                {userTournaments.map((tournament) => {
                  const game = getGameById(tournament.gameId);
                  return (
                    <div key={tournament.id} className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="font-medium">{tournament.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-slate-400">Game: {game?.name}</span>
                            <span className="mx-2 text-slate-600">•</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              tournament.status === 'upcoming' ? 'bg-blue-900/50 text-blue-300' :
                              tournament.status === 'active' ? 'bg-green-900/50 text-green-300' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {tournament.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <div className="mr-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-slate-400 mr-1" />
                              <span className="text-sm text-slate-400">
                                {tournament.participants.length} participants
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-slate-400">
                            {format(new Date(tournament.startDate), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">You haven't joined any tournaments yet</p>
                <a href="/tournaments" className="btn-primary">
                  Browse Tournaments
                </a>
              </div>
            )}
          </motion.div>
        )}
        
        {activeTab === 'stats' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Overall Stats */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Overall Statistics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-slate-400">Games Played</p>
                  <p className="text-2xl font-bold">{userStats?.gamesPlayed || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Wins</p>
                  <p className="text-2xl font-bold text-green-400">{userStats?.wins || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Losses</p>
                  <p className="text-2xl font-bold text-red-400">{userStats?.losses || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Win Rate</p>
                  <p className="text-2xl font-bold">
                    {userStats && (userStats.wins + userStats.losses) > 0
                      ? `${Math.round((userStats.wins / (userStats.wins + userStats.losses)) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-400">Win/Loss Ratio</span>
                  <span className="text-sm text-slate-400">
                    {userStats?.wins || 0}/{userStats?.losses || 0}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500"
                    style={{ 
                      width: userStats && (userStats.wins + userStats.losses) > 0
                        ? `${(userStats.wins / (userStats.wins + userStats.losses)) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Game-Specific Detailed Stats */}
            {userStats && Object.keys(userStats.gameStats).length > 0 && (
              <div className="space-y-6">
                {Object.entries(userStats.gameStats).map(([gameId, stats]) => {
                  const game = getGameById(gameId);
                  const rank = getPlayerRanking(currentUser.id, gameId);
                  
                  return (
                    <div key={gameId} className="card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">{game?.name}</h2>
                        <div className="badge-primary flex items-center">
                          Rank #{rank}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-sm text-slate-400">Games Played</p>
                          <p className="text-2xl font-bold">{stats.wins + stats.losses}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Wins</p>
                          <p className="text-2xl font-bold text-green-400">{stats.wins}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Losses</p>
                          <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Win Rate</p>
                          <p className="text-2xl font-bold">
                            {(stats.wins + stats.losses) > 0
                              ? `${Math.round((stats.wins / (stats.wins + stats.losses)) * 100)}%`
                              : '0%'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-slate-400">Win/Loss Ratio</span>
                          <span className="text-sm text-slate-400">
                            {stats.wins}/{stats.losses}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500"
                            style={{ 
                              width: (stats.wins + stats.losses) > 0
                                ? `${(stats.wins / (stats.wins + stats.losses)) * 100}%`
                                : '0%'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {(!userStats || Object.keys(userStats.gameStats).length === 0) && (
              <div className="card p-8 text-center">
                <GameController className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400">No game statistics available yet</p>
                <p className="text-sm text-slate-500 mt-2">Play some games to see your stats!</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;