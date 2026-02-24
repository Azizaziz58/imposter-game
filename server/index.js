import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameState } from './gameState.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const gameState = new GameState();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', ({ playerName, maxPlayers }) => {
    const room = gameState.createRoom(socket.id, playerName, maxPlayers);
    socket.join(room.code);
    socket.emit('roomCreated', { room, playerId: socket.id });
  });

  socket.on('joinRoom', ({ roomCode, playerName }) => {
    try {
      const room = gameState.joinRoom(roomCode, socket.id, playerName);
      socket.join(roomCode);
      socket.emit('roomJoined', { room, playerId: socket.id });
      io.to(roomCode).emit('playerListUpdate', {
        players: room.players,
        hostId: room.hostId
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('sendMessage', ({ roomCode, message }) => {
    console.log(`[Socket] Message from ${socket.id} to room ${roomCode}: ${message}`);
    const room = gameState.getRoom(roomCode);
    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        io.to(roomCode).emit('newMessage', {
          senderId: socket.id,
          senderName: player.name,
          text: message,
          timestamp: Date.now()
        });
      }
    }
  });

  socket.on('leaveRoom', ({ roomCode }) => {
    console.log(`[Socket] ${socket.id} requested to leave room ${roomCode}`);
    const roomCodeToRemove = gameState.removePlayer(socket.id);
    if (roomCodeToRemove) {
      socket.leave(roomCodeToRemove);
      const room = gameState.getRoom(roomCodeToRemove);
      if (room) {
        io.to(roomCodeToRemove).emit('playerListUpdate', {
          players: room.players,
          hostId: room.hostId
        });
      }
    }
    socket.emit('leftRoom');
  });

  socket.on('playerReady', ({ roomCode, playerId }) => {
    try {
      const room = gameState.toggleReady(roomCode, playerId);
      io.to(roomCode).emit('playerListUpdate', {
        players: room.players,
        hostId: room.hostId
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('startGame', ({ roomCode }) => {
    try {
      const room = gameState.startGame(roomCode);

      room.players.forEach((player) => {
        const playerSocket = io.sockets.sockets.get(player.id);
        if (playerSocket) {
          playerSocket.emit('gameStarted', {
            isImposter: player.isImposter,
            word: player.isImposter ? null : room.word
          });
        }
      });

      console.log(`[Socket] Game started in room ${roomCode}`);

      setTimeout(() => {
        io.to(roomCode).emit('phaseChange', { phase: 'discussion' });
        gameState.updatePhase(roomCode, 'discussion');
        startDiscussionTimer(roomCode);
      }, 5000);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('submitVote', ({ roomCode, voterId, targetId }) => {
    try {
      const room = gameState.submitVote(roomCode, voterId, targetId);
      io.to(roomCode).emit('voteUpdate', { votes: room.votes });

      if (room.votes.length === room.players.length) {
        const result = gameState.calculateResults(roomCode);
        io.to(roomCode).emit('gameEnded', result);
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('restartGame', ({ roomCode }) => {
    try {
      const room = gameState.resetRoom(roomCode);
      io.to(roomCode).emit('gameReset', { room });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const roomCodeToRemove = gameState.removePlayer(socket.id);
    if (roomCodeToRemove) {
      const room = gameState.getRoom(roomCodeToRemove);
      if (room) {
        io.to(roomCodeToRemove).emit('playerListUpdate', {
          players: room.players,
          hostId: room.hostId
        });
      }
    }
  });

  function startDiscussionTimer(roomCode) {
    let timeLeft = 60;
    const interval = setInterval(() => {
      timeLeft--;
      io.to(roomCode).emit('timerUpdate', { timeLeft });

      if (timeLeft <= 0) {
        clearInterval(interval);
        gameState.updatePhase(roomCode, 'voting');
        io.to(roomCode).emit('phaseChange', { phase: 'voting' });
      }
    }, 1000);
  }
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
