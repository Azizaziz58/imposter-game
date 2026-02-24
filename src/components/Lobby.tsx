import { Copy, Check, Crown, User, Shield, Zap, Target, LogOut, Play } from 'lucide-react';
import { useState } from 'react';
import { Player } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

interface LobbyProps {
  roomCode: string;
  players: Player[];
  playerId: string;
  hostId: string;
  maxPlayers: number;
  onReady: () => void;
  onStartGame: () => void;
  onLeave: () => void;
}

export const Lobby = ({ roomCode, players, playerId, hostId, maxPlayers = 8, onReady, onStartGame, onLeave }: LobbyProps) => {
  const [copied, setCopied] = useState(false);
  const isHost = playerId === hostId;
  const currentPlayer = players.find(p => p.id === playerId);
  const allReady = players.every(p => p.id === hostId || p.isReady);
  const canStart = players.length >= 3 && allReady;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pb-24 md:pb-6">
      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start"
      >
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="text-left">
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">OPERATIONAL LOBBY</h2>
            <div className="h-1 w-20 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="cyber-card neon-border-cyan p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-500/60 mb-1">Access Protocol</p>
              <p className="text-4xl font-mono font-black text-white tracking-widest">{roomCode}</p>
            </div>
            <button
              onClick={copyRoomCode}
              className="p-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all duration-200"
            >
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
            <div className="cyber-card p-4 text-center">
              <Shield className="mx-auto text-cyan-400 mb-2" size={20} />
              <p className="text-[10px] uppercase font-mono text-gray-400">Status</p>
              <p className="text-sm font-bold text-white">SECURE</p>
            </div>
            <div className="cyber-card p-4 text-center">
              <Zap className="mx-auto text-purple-400 mb-2" size={20} />
              <p className="text-[10px] uppercase font-mono text-gray-400">Ping</p>
              <p className="text-sm font-bold text-white">24MS</p>
            </div>
            <div className="cyber-card p-4 text-center">
              <Target className="mx-auto text-pink-400 mb-2" size={20} />
              <p className="text-[10px] uppercase font-mono text-gray-400">Room</p>
              <p className="text-sm font-bold text-white">ACTIVE</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3 pt-4">
            {!isHost && (
              <button
                onClick={onReady}
                className={`w-full py-5 rounded-2xl font-black text-xl tracking-widest transition-all duration-300 ${currentPlayer?.isReady
                    ? 'bg-white/5 text-gray-400 border border-white/10'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_30px_rgba(8,145,178,0.3)] hover:scale-[1.02]'
                  }`}
              >
                {currentPlayer?.isReady ? 'READY CONFIRMED' : 'INITIATE READY'}
              </button>
            )}

            {isHost && (
              <button
                onClick={onStartGame}
                disabled={!canStart || players.length < (maxPlayers || 3)}
                className="w-full py-5 rounded-2xl font-black text-xl tracking-widest bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Play fill="currentColor" size={24} />
                {!canStart && players.length < maxPlayers && 'WAITING FOR SQUAD...'}
                {!canStart && players.length >= maxPlayers && 'WAITING FOR READY...'}
                {canStart && players.length >= maxPlayers && 'LAUNCH MISSION'}
              </button>
            )}

            <button
              onClick={onLeave}
              className="w-full py-4 rounded-2xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              DISCONNECT
            </button>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">Active Agents</h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
              {players.length}/{maxPlayers}
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            className="space-y-3 custom-scrollbar max-h-[60vh] overflow-y-auto pr-2"
          >
            <AnimatePresence mode="popLayout">
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 20 }}
                  className={`cyber-card p-4 flex items-center justify-between group h-20 ${player.id === playerId ? 'ring-2 ring-cyan-500/50 bg-cyan-500/5' : ''
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${player.id === hostId
                        ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                        : player.isReady
                          ? 'bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                          : 'bg-white/5 text-gray-500'
                      }`}>
                      {player.id === hostId ? <Crown size={24} /> : <User size={24} />}
                    </div>
                    <div>
                      <p className="font-black text-lg tracking-tight group-hover:neon-text-cyan transition-all duration-300 uppercase">
                        {player.name}
                        {player.id === playerId && <span className="ml-2 text-[10px] text-cyan-500 font-mono font-normal tracking-normal">(YOU)</span>}
                      </p>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        {player.id === hostId ? 'Squad Leader' : player.isReady ? 'Ready & Armed' : 'Pending Auth...'}
                      </p>
                    </div>
                  </div>
                  {player.isReady && player.id !== hostId && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-green-500/20 text-green-500 p-2 rounded-lg border border-green-500/30"
                    >
                      <Check size={20} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4"
          >
            <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mb-1">Mission Control</p>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              Ensure all squad members have confirmed readiness before initiating protocol launch. Imposters are currently infiltrating the network.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
