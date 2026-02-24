export interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isImposter?: boolean;
}

export interface Room {
  code: string;
  hostId: string;
  players: Player[];
  phase: 'lobby' | 'reveal' | 'discussion' | 'voting' | 'result';
  word: string | null;
  votes: Vote[];
  imposters: string[];
  maxPlayers: number;
}

export interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Vote {
  voterId: string;
  targetId: string;
}

export interface GameResult {
  winner: 'imposters' | 'players';
  votedOutPlayer: {
    name: string;
    isImposter: boolean;
  } | null;
  imposters: string[];
  word: string;
  voteCounts: Record<string, number>;
}
