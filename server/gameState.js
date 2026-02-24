import { wordList } from './wordList.js';

export class GameState {
  constructor() {
    this.rooms = new Map();
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  createRoom(hostId, hostName, maxPlayers = 8) {
    const code = this.generateRoomCode();
    const room = {
      code,
      hostId,
      players: [{
        id: hostId,
        name: hostName,
        isReady: false,
        isImposter: false
      }],
      phase: 'lobby',
      word: null,
      votes: [],
      imposters: [],
      maxPlayers: parseInt(maxPlayers) || 8
    };
    this.rooms.set(code, room);
    return room;
  }

  joinRoom(roomCode, playerId, playerName) {
    console.log(`[GameState] Player ${playerName} (${playerId}) joining room ${roomCode}`);
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new Error('Room not found');
    }
    if (room.phase !== 'lobby') {
      throw new Error('Game already in progress');
    }
    if (room.players.length >= room.maxPlayers) {
      throw new Error('Room is full');
    }
    if (room.players.some(p => p.id === playerId)) {
      return room;
    }

    room.players.push({
      id: playerId,
      name: playerName,
      isReady: false,
      isImposter: false
    });
    return room;
  }

  toggleReady(roomCode, playerId) {
    const room = this.rooms.get(roomCode);
    if (!room) throw new Error('Room not found');

    const player = room.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');

    if (player.id === room.hostId) {
      throw new Error('Host cannot ready up');
    }

    player.isReady = !player.isReady;
    return room;
  }

  startGame(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) throw new Error('Room not found');

    console.log(`[GameState] Starting game in room ${roomCode}. Players: ${room.players.length}/${room.maxPlayers}`);

    if (room.players.length < room.maxPlayers) {
      throw new Error(`Wait for ${room.maxPlayers} players to join`);
    }

    const allReady = room.players.every(p => p.id === room.hostId || p.isReady);
    if (!allReady) {
      throw new Error('Not all players are ready');
    }

    const imposterCount = room.players.length <= 5 ? 1 : 2;
    const shuffled = [...room.players].sort(() => Math.random() - 0.5);

    for (let i = 0; i < imposterCount; i++) {
      shuffled[i].isImposter = true;
      room.imposters.push(shuffled[i].id);
    }

    room.word = wordList[Math.floor(Math.random() * wordList.length)];
    room.phase = 'reveal';
    return room;
  }

  updatePhase(roomCode, phase) {
    const room = this.rooms.get(roomCode);
    if (room) {
      room.phase = phase;
    }
  }

  submitVote(roomCode, voterId, targetId) {
    const room = this.rooms.get(roomCode);
    if (!room) throw new Error('Room not found');

    const existingVote = room.votes.find(v => v.voterId === voterId);
    if (existingVote) {
      existingVote.targetId = targetId;
    } else {
      room.votes.push({ voterId, targetId });
    }
    return room;
  }

  calculateResults(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) throw new Error('Room not found');

    const voteCounts = {};
    room.votes.forEach(vote => {
      voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
    });

    let maxVotes = 0;
    let mostVotedIds = [];

    Object.entries(voteCounts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostVotedIds = [id];
      } else if (count === maxVotes) {
        mostVotedIds.push(id);
      }
    });

    const votedOutPlayer = mostVotedIds.length === 1 ?
      room.players.find(p => p.id === mostVotedIds[0]) : null;

    const imposterVotedOut = votedOutPlayer && votedOutPlayer.isImposter;
    const impostersWin = !imposterVotedOut;

    return {
      winner: impostersWin ? 'imposters' : 'players',
      votedOutPlayer: votedOutPlayer ? {
        name: votedOutPlayer.name,
        isImposter: votedOutPlayer.isImposter
      } : null,
      imposters: room.imposters,
      word: room.word,
      voteCounts
    };
  }

  resetRoom(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) throw new Error('Room not found');

    room.phase = 'lobby';
    room.word = null;
    room.votes = [];
    room.imposters = [];
    room.players.forEach(p => {
      p.isReady = false;
      p.isImposter = false;
    });
    return room;
  }

  removePlayer(playerId) {
    for (const [code, room] of this.rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
          this.rooms.delete(code);
          return null;
        }

        if (room.hostId === playerId && room.players.length > 0) {
          room.hostId = room.players[0].id;
        }

        return code;
      }
    }
    return null;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }
}
