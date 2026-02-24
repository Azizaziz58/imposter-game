import { useState, useEffect } from 'react';
import { useSocket } from './contexts/SocketContext';
import { Home } from './components/Home';
import { Lobby } from './components/Lobby';
import { RoleReveal } from './components/RoleReveal';
import { Discussion } from './components/Discussion';
import { Voting } from './components/Voting';
import { Result } from './components/Result';
import { Room, GameResult, ChatMessage } from './types/game';

type GamePhase = 'home' | 'lobby' | 'reveal' | 'discussion' | 'voting' | 'result';

function App() {
  const { socket } = useSocket();
  const [phase, setPhase] = useState<GamePhase>('home');
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [isImposter, setIsImposter] = useState(false);
  const [word, setWord] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('roomCreated', ({ room, playerId }) => {
      setRoom(room);
      setPlayerId(playerId);
      setPhase('lobby');
      setMessages([]);
    });

    socket.on('roomJoined', ({ room, playerId }) => {
      setRoom(room);
      setPlayerId(playerId);
      setPhase('lobby');
      setMessages([]);
    });

    socket.on('playerListUpdate', ({ players, hostId }) => {
      setRoom((prev) => prev ? { ...prev, players, hostId: hostId || prev.hostId } : null);
    });

    socket.on('gameStarted', ({ isImposter, word }) => {
      setIsImposter(isImposter);
      setWord(word);
      setPhase('reveal');
      setMessages([]);
    });

    socket.on('phaseChange', ({ phase }) => {
      setPhase(phase as GamePhase);
      if (phase === 'discussion') {
        setTimeLeft(60);
      }
    });

    socket.on('newMessage', (message: ChatMessage) => {
      console.log('[App] New message received:', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on('leftRoom', () => {
      setRoom(null);
      setPhase('home');
      setMessages([]);
    });

    socket.on('timerUpdate', ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    });

    socket.on('voteUpdate', ({ votes }) => {
      setRoom((prev) => prev ? { ...prev, votes } : null);
    });

    socket.on('gameEnded', (gameResult) => {
      setResult(gameResult);
      setPhase('result');
    });

    socket.on('gameReset', ({ room }) => {
      setRoom(room);
      setPhase('lobby');
      setIsImposter(false);
      setWord(null);
      setTimeLeft(60);
      setResult(null);
      setMessages([]);
    });

    socket.on('error', ({ message }) => {
      setError(message);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('playerListUpdate');
      socket.off('gameStarted');
      socket.off('phaseChange');
      socket.off('newMessage');
      socket.off('leftRoom');
      socket.off('timerUpdate');
      socket.off('voteUpdate');
      socket.off('gameEnded');
      socket.off('gameReset');
      socket.off('error');
    };
  }, [socket]);

  const handleCreateRoom = (playerName: string, maxPlayers: number) => {
    socket?.emit('createRoom', { playerName, maxPlayers });
  };

  const handleJoinRoom = (roomCode: string, playerName: string) => {
    socket?.emit('joinRoom', { roomCode, playerName });
  };

  const handleLeaveRoom = () => {
    if (room) {
      socket?.emit('leaveRoom', { roomCode: room.code });
    } else {
      setPhase('home');
    }
  };

  const handleSendMessage = (message: string) => {
    if (room && message.trim()) {
      socket?.emit('sendMessage', { roomCode: room.code, message });
    }
  };

  const handleReady = () => {
    if (room) {
      socket?.emit('playerReady', { roomCode: room.code, playerId });
    }
  };

  const handleStartGame = () => {
    if (room) {
      socket?.emit('startGame', { roomCode: room.code });
    }
  };

  const handleVote = (targetId: string) => {
    if (room) {
      socket?.emit('submitVote', { roomCode: room.code, voterId: playerId, targetId });
    }
  };

  const handleRestart = () => {
    if (room) {
      socket?.emit('restartGame', { roomCode: room.code });
    }
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      <div className="nebula-bg" />

      <div className="relative z-10">
        {phase === 'home' && (
          <Home onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
        )}

        {phase === 'lobby' && room && (
          <Lobby
            roomCode={room.code}
            players={room.players}
            playerId={playerId}
            hostId={room.hostId}
            maxPlayers={room.maxPlayers}
            onReady={handleReady}
            onStartGame={handleStartGame}
            onLeave={handleLeaveRoom}
          />
        )}

        {phase === 'reveal' && (
          <RoleReveal isImposter={isImposter} word={word} />
        )}

        {phase === 'discussion' && room && (
          <Discussion
            timeLeft={timeLeft}
            players={room.players}
            playerId={playerId}
            isImposter={isImposter}
            word={word}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        )}

        {phase === 'voting' && room && (
          <Voting
            players={room.players}
            playerId={playerId}
            votes={room.votes}
            onVote={handleVote}
          />
        )}

        {phase === 'result' && result && room && (
          <Result
            winner={result.winner}
            players={room.players}
            votedOutPlayer={result.votedOutPlayer}
            imposters={result.imposters}
            word={result.word}
            isHost={playerId === room.hostId}
            onRestart={handleRestart}
            onLeave={handleLeaveRoom}
          />
        )}
      </div>

      {!socket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
            <p className="text-cyan-400 font-mono tracking-widest animate-pulse">ESTABLISHING UPLINK...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-red-950/90 border border-red-500/50 text-red-200 px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] backdrop-blur-xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            {error}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
