import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, Tournament, Match, PlayerStats } from '../types';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface GameContextType {
  games: Game[];
  tournaments: Tournament[];
  matches: Match[];
  playerStats: PlayerStats[];
  createTournament: (name: string, gameId: string, startDate: string) => void;
  joinTournament: (tournamentId: string) => void;
  recordMatchResult: (matchId: string, winnerId: string) => void;
  getPlayerRanking: (userId: string, gameId?: string) => number;
  getUserStats: (userId: string) => PlayerStats | undefined;
  getGameById: (gameId: string) => Game | undefined;
  getUserTournaments: () => Tournament[];
  startMatch: (tournamentId: string, participants: string[]) => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedGames = getFromLocalStorage<Game[]>('games') || [];
    const storedTournaments = getFromLocalStorage<Tournament[]>('tournaments') || [];
    const storedMatches = getFromLocalStorage<Match[]>('matches') || [];
    const storedPlayerStats = getFromLocalStorage<PlayerStats[]>('playerStats') || [];
    
    setGames(storedGames);
    setTournaments(storedTournaments);
    setMatches(storedMatches);
    setPlayerStats(storedPlayerStats);
  }, []);

  const getGameById = (gameId: string): Game | undefined => {
    return games.find(game => game.id === gameId);
  };

  const createTournament = (name: string, gameId: string, startDate: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to create a tournament');
      return;
    }
    
    const newTournament: Tournament = {
      id: uuidv4(),
      name,
      gameId,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      startDate,
      participants: [currentUser.id], // Creator automatically joins
      status: 'upcoming',
      winners: []
    };
    
    const updatedTournaments = [...tournaments, newTournament];
    setTournaments(updatedTournaments);
    saveToLocalStorage('tournaments', updatedTournaments);
    
    toast.success('Tournament created successfully!');
  };

  const joinTournament = (tournamentId: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to join a tournament');
      return;
    }
    
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      toast.error('Tournament not found');
      return;
    }
    
    const tournament = tournaments[tournamentIndex];
    
    if (tournament.participants.includes(currentUser.id)) {
      toast.error('You are already in this tournament');
      return;
    }
    
    const updatedTournaments = [...tournaments];
    updatedTournaments[tournamentIndex] = {
      ...tournament,
      participants: [...tournament.participants, currentUser.id]
    };
    
    setTournaments(updatedTournaments);
    saveToLocalStorage('tournaments', updatedTournaments);
    
    toast.success('Joined tournament successfully!');
  };

  const startMatch = (tournamentId: string, participants: string[]): string => {
    if (!currentUser) {
      toast.error('You must be logged in to start a match');
      return '';
    }
    
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
      toast.error('Tournament not found');
      return '';
    }
    
    // Validate participants are in tournament
    if (!participants.every(p => tournament.participants.includes(p))) {
      toast.error('All players must be tournament participants');
      return '';
    }
    
    const newMatch: Match = {
      id: uuidv4(),
      tournamentId,
      gameId: tournament.gameId,
      participants,
      date: new Date().toISOString(),
      status: 'scheduled'
    };
    
    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    saveToLocalStorage('matches', updatedMatches);
    
    toast.success('Match started!');
    return newMatch.id;
  };

  const recordMatchResult = (matchId: string, winnerId: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to record results');
      return;
    }
    
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) {
      toast.error('Match not found');
      return;
    }
    
    const match = matches[matchIndex];
    
    if (match.status === 'completed') {
      toast.error('Match has already been completed');
      return;
    }
    
    if (!match.participants.includes(winnerId)) {
      toast.error('Winner must be a match participant');
      return;
    }
    
    // Update match
    const updatedMatches = [...matches];
    updatedMatches[matchIndex] = {
      ...match,
      winnerId,
      status: 'completed'
    };
    
    setMatches(updatedMatches);
    saveToLocalStorage('matches', updatedMatches);
    
    // Update player stats
    const updatedPlayerStats = [...playerStats];
    
    match.participants.forEach(participantId => {
      const isWinner = participantId === winnerId;
      const playerStatIndex = updatedPlayerStats.findIndex(p => p.userId === participantId);
      
      if (playerStatIndex === -1) {
        // Create new player stats
        updatedPlayerStats.push({
          userId: participantId,
          wins: isWinner ? 1 : 0,
          losses: isWinner ? 0 : 1,
          gamesPlayed: 1,
          rank: 0, // Will be calculated later
          gameStats: {
            [match.gameId]: {
              wins: isWinner ? 1 : 0,
              losses: isWinner ? 0 : 1,
              rank: 0 // Will be calculated later
            }
          }
        });
      } else {
        // Update existing player stats
        const playerStat = updatedPlayerStats[playerStatIndex];
        const gameStats = playerStat.gameStats[match.gameId] || { wins: 0, losses: 0, rank: 0 };
        
        updatedPlayerStats[playerStatIndex] = {
          ...playerStat,
          wins: playerStat.wins + (isWinner ? 1 : 0),
          losses: playerStat.losses + (isWinner ? 0 : 1),
          gamesPlayed: playerStat.gamesPlayed + 1,
          gameStats: {
            ...playerStat.gameStats,
            [match.gameId]: {
              wins: gameStats.wins + (isWinner ? 1 : 0),
              losses: gameStats.losses + (isWinner ? 0 : 1),
              rank: 0 // Will be calculated later
            }
          }
        };
      }
    });
    
    // Calculate rankings
    calculateRankings(updatedPlayerStats);
    
    setPlayerStats(updatedPlayerStats);
    saveToLocalStorage('playerStats', updatedPlayerStats);
    
    toast.success('Match result recorded!');
  };

  const calculateRankings = (stats: PlayerStats[]) => {
    // Calculate overall rankings
    const sortedByWins = [...stats].sort((a, b) => b.wins - a.wins);
    sortedByWins.forEach((stat, index) => {
      stat.rank = index + 1;
    });
    
    // Calculate game-specific rankings
    games.forEach(game => {
      const playersWithGameStats = stats.filter(stat => stat.gameStats[game.id]);
      const sortedByGameWins = [...playersWithGameStats].sort((a, b) => 
        (b.gameStats[game.id]?.wins || 0) - (a.gameStats[game.id]?.wins || 0)
      );
      
      sortedByGameWins.forEach((stat, index) => {
        if (stat.gameStats[game.id]) {
          stat.gameStats[game.id].rank = index + 1;
        }
      });
    });
  };

  const getPlayerRanking = (userId: string, gameId?: string): number => {
    const playerStat = playerStats.find(p => p.userId === userId);
    
    if (!playerStat) return 0;
    
    if (gameId) {
      return playerStat.gameStats[gameId]?.rank || 0;
    }
    
    return playerStat.rank;
  };

  const getUserStats = (userId: string): PlayerStats | undefined => {
    return playerStats.find(p => p.userId === userId);
  };

  const getUserTournaments = (): Tournament[] => {
    if (!currentUser) return [];
    return tournaments.filter(t => t.participants.includes(currentUser.id));
  };

  return (
    <GameContext.Provider value={{
      games,
      tournaments,
      matches,
      playerStats,
      createTournament,
      joinTournament,
      recordMatchResult,
      getPlayerRanking,
      getUserStats,
      getGameById,
      getUserTournaments,
      startMatch
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};