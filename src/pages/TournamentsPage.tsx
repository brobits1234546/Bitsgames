import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useNotification } from '../context/NotificationContext';
import { Trophy, CalendarPlus, Users, Calendar, Plus, ChevronDown, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const TournamentsPage = () => {
  const { currentUser } = useAuth();
  const { tournaments, games, createTournament, joinTournament, getGameById } = useGame();
  const { addNotification } = useNotification();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [selectedGameId, setSelectedGameId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [filter, setFilter] = useState('all'); // all, joined, upcoming, active, completed
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    document.title = 'Tournaments - BITS Games';
  }, []);
  
  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tournamentName || !selectedGameId || !startDate) {
      return;
    }
    
    createTournament(tournamentName, selectedGameId, startDate);
    
    // Reset form
    setTournamentName('');
    setSelectedGameId('');
    setStartDate('');
    setShowCreateForm(false);
    
    // Send notification to creator
    if (currentUser) {
      addNotification(
        currentUser.id,
        'tournament_invite',
        `You created a new tournament: ${tournamentName}`
      );
    }
  };
  
  const handleJoinTournament = (tournamentId: string, tournamentName: string) => {
    joinTournament(tournamentId);
    
    // Send notification to joiner
    if (currentUser) {
      addNotification(
        currentUser.id,
        'tournament_invite',
        `You joined the tournament: ${tournamentName}`
      );
    }
  };
  
  // Filter and search tournaments
  const filteredTournaments = tournaments.filter(tournament => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'joined' && currentUser && tournament.participants.includes(currentUser.id)) ||
      (filter === 'upcoming' && tournament.status === 'upcoming') ||
      (filter === 'active' && tournament.status === 'active') ||
      (filter === 'completed' && tournament.status === 'completed');
    
    const matchesSearch = 
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getGameById(tournament.gameId)?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
          <p className="text-slate-400">Create, join, and compete in tournaments</p>
        </div>
        <button 
          className="btn-primary mt-4 md:mt-0"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Tournament
        </button>
      </motion.div>
      
      {/* Create Tournament Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Create New Tournament</h2>
            <form onSubmit={handleCreateTournament} className="space-y-4">
              <div>
                <label htmlFor="tournamentName" className="label">
                  Tournament Name
                </label>
                <input
                  id="tournamentName"
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="input"
                  placeholder="Enter tournament name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="game" className="label">
                  Game
                </label>
                <div className="relative">
                  <select
                    id="game"
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                    className="input appearance-none pr-10"
                    required
                  >
                    <option value="">Select a game</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="startDate" className="label">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <CalendarPlus className="mr-2 h-5 w-5" />
                  Create Tournament
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <Filter className="h-5 w-5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="all">All Tournaments</option>
            <option value="joined">My Tournaments</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Tournaments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((tournament, index) => {
            const game = getGameById(tournament.gameId);
            const isJoined = currentUser && tournament.participants.includes(currentUser.id);
            
            return (
              <motion.div 
                key={tournament.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div 
                  className="h-32 bg-center bg-cover relative"
                  style={{ backgroundImage: `url(${game?.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-slate-800 text-slate-200">
                      {game?.name}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{tournament.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-slate-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {format(new Date(tournament.startDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      tournament.status === 'upcoming' ? 'bg-blue-900/50 text-blue-300' :
                      tournament.status === 'active' ? 'bg-green-900/50 text-green-300' :
                      'bg-gray-800 text-gray-300'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-slate-400 mb-4">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {tournament.participants.length} participants
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/tournaments/${tournament.id}`}
                      className="btn-ghost flex-1"
                    >
                      View Details
                    </Link>
                    {!isJoined && tournament.status === 'upcoming' && (
                      <button 
                        className="btn-primary flex-1"
                        onClick={() => handleJoinTournament(tournament.id, tournament.name)}
                      >
                        Join
                      </button>
                    )}
                    {isJoined && (
                      <div className="badge-primary flex items-center">
                        <Trophy className="h-3 w-3 mr-1" />
                        Joined
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Trophy className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
            <p className="text-slate-400 mb-6">
              {searchQuery 
                ? "No tournaments match your search criteria" 
                : "There are no tournaments available yet"}
            </p>
            <button 
              className="btn-primary"
              onClick={() => {
                setShowCreateForm(true);
                setSearchQuery('');
                setFilter('all');
              }}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Tournament
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// AnimatePresence component for framer-motion
const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default TournamentsPage;