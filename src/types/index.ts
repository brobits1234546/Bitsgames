export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed password
  createdAt: string;
  profileImage?: string;
}

export interface Game {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Tournament {
  id: string;
  name: string;
  gameId: string;
  createdBy: string;
  createdAt: string;
  startDate: string;
  participants: string[]; // Array of user IDs
  status: 'upcoming' | 'active' | 'completed';
  winners: string[]; // Array of user IDs
}

export interface Match {
  id: string;
  tournamentId: string;
  gameId: string;
  participants: string[]; // Array of user IDs
  winnerId?: string;
  date: string;
  status: 'scheduled' | 'completed';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'tournament_invite' | 'match_reminder' | 'match_result';
  content: string;
  timestamp: string;
  read: boolean;
  referenceId?: string; // ID of tournament or match
}

export interface PlayerStats {
  userId: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  rank: number;
  gameStats: {
    [gameId: string]: {
      wins: number;
      losses: number;
      rank: number;
    }
  }
}