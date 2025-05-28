import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, ChevronDown } from 'lucide-react';

const LeaderboardPage = () => {
  const { games, playerStats } = useGame();
  const [selectedGameId, setSelectedGameId] = useState<string>('overall');
  
  useEffect(() => {
    document.title = 'Leaderboard - BITS Games';
  }, []);
  
  // Get users from localStorage
  interface User {
    id: string;
    username: string;
    profileImage?: string;
  }
  
  const getUsers = (): User[] => {
    try {
      const usersJSON = localStorage.getItem('users');
      if (!usersJSON) return [];
      return JSON.parse(usersJSON);
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  };
  
  const users = getUsers();
  
  // Get username by ID
  const getUsernameById = (userId: string): string => {
    const user = users.find(user => user.id === userId);
    return user?.username || 'Unknown Player';
  };
  
  // Get user avatar by ID
  const getUserAvatarById = (userId: string): string => {
    const user = users.find(user => user.id === userId);
    return user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUsernameById(userId))}&background=random`;
  };
  
  // Get sorted player stats based on selected game
  const getSortedPlayerStats = () => {
    if (selectedGameId === 'overall') {
      // Sort by overall wins
      return [...playerStats].sort((a, b) => b.wins - a.wins);
    } else {
      // Sort by game-specific wins
      return [...playerStats]
        .filter(stat => stat.gameStats[selectedGameId])
        .sort((a, b) => 
          (b.gameStats[selectedGameId]?.wins || 0) - 
          (a.gameStats[selectedGameId]?.wins || 0)
        );
    }
  };
  
  const sortedStats = getSortedPlayerStats();
  
  // Get medal color based on rank
  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0: return 'text-yellow-500'; // Gold
      case 1: return 'text-slate-400'; // Silver
      case 2: return 'text-amber-600'; // Bronze
      default: return 'text-slate-600';
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-slate-400">See who's dominating the competition</p>
      </motion.div>
      
      {/* Game Filter */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative inline-block w-full max-w-md">
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="input appearance-none pr-10 w-full"
          >
            <option value="overall">Overall Ranking</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name} Ranking
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </motion.div>
      
      {/* Top 3 Players */}
      {sortedStats.length > 0 && (
        <motion.div 
          className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* 2nd Place */}
          {sortedStats.length > 1 && (
            <div className="flex flex-col items-center order-2 md:order-1">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-400">
                  <img 
                    src={getUserAvatarById(sortedStats[1].userId)} 
                    alt={getUsernameById(sortedStats[1].userId)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-700 rounded-full p-1 border-2 border-slate-400">
                  <Medal className="h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-semibold text-slate-300">{getUsernameById(sortedStats[1].userId)}</h3>
                <p className="text-sm text-slate-400">
                  {selectedGameId === 'overall' 
                    ? `${sortedStats[1].wins} wins` 
                    : `${sortedStats[1].gameStats[selectedGameId]?.wins || 0} wins`}
                </p>
              </div>
            </div>
          )}
          
          {/* 1st Place */}
          <div className="flex flex-col items-center order-1 md:order-2 scale-110">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-500 shadow-lg shadow-yellow-500/20">
                <img 
                  src={getUserAvatarById(sortedStats[0].userId)} 
                  alt={getUsernameById(sortedStats[0].userId)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-700 rounded-full p-1 border-2 border-yellow-500">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="font-bold text-white text-lg">{getUsernameById(sortedStats[0].userId)}</h3>
              <p className="text-sm text-indigo-300 font-medium">
                {selectedGameId === 'overall' 
                  ? `${sortedStats[0].wins} wins` 
                  : `${sortedStats[0].gameStats[selectedGameId]?.wins || 0} wins`}
              </p>
            </div>
          </div>
          
          {/* 3rd Place */}
          {sortedStats.length > 2 && (
            <div className="flex flex-col items-center order-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-600">
                  <img 
                    src={getUserAvatarById(sortedStats[2].userId)} 
                    alt={getUsernameById(sortedStats[2].userId)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-700 rounded-full p-1 border-2 border-amber-600">
                  <Medal className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-semibold text-slate-300">{getUsernameById(sortedStats[2].userId)}</h3>
                <p className="text-sm text-slate-400">
                  {selectedGameId === 'overall' 
                    ? `${sortedStats[2].wins} wins` 
                    : `${sortedStats[2].gameStats[selectedGameId]?.wins || 0} wins`}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Leaderboard Table */}
      <motion.div 
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-slate-700 p-4 border-b border-slate-600">
          <h2 className="font-bold">
            {selectedGameId === 'overall' ? 'Overall Rankings' : `${games.find(g => g.id === selectedGameId)?.name} Rankings`}
          </h2>
        </div>
        
        {sortedStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800">
                  <th className="py-3 px-4 text-left">Rank</th>
                  <th className="py-3 px-4 text-left">Player</th>
                  <th className="py-3 px-4 text-right">Wins</th>
                  <th className="py-3 px-4 text-right">Losses</th>
                  <th className="py-3 px-4 text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {sortedStats.map((stat, index) => {
                  const wins = selectedGameId === 'overall' 
                    ? stat.wins 
                    : stat.gameStats[selectedGameId]?.wins || 0;
                  
                  const losses = selectedGameId === 'overall' 
                    ? stat.losses 
                    : stat.gameStats[selectedGameId]?.losses || 0;
                  
                  const winRate = wins + losses > 0 
                    ? Math.round((wins / (wins + losses)) * 100) 
                    : 0;
                    
                  return (
                    <tr 
                      key={stat.userId}
                      className={`border-t border-slate-700 hover:bg-slate-700/50 ${index < 3 ? 'bg-slate-800/50' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <Medal className={`h-5 w-5 mr-2 ${getMedalColor(index)}`} />
                          ) : (
                            <span className="w-7 text-center">{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                            <img 
                              src={getUserAvatarById(stat.userId)} 
                              alt={getUsernameById(stat.userId)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium">{getUsernameById(stat.userId)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-green-400">{wins}</td>
                      <td className="py-3 px-4 text-right font-medium text-red-400">{losses}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center">
                          <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden mr-2">
                            <div 
                              className="h-full bg-indigo-500"
                              style={{ width: `${winRate}%` }}
                            ></div>
                          </div>
                          <span>{winRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No player data yet</h3>
            <p className="text-slate-400">
              Complete some matches to see rankings appear here
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;