import { Trophy, Users, RefreshCw, LogOut, Shield, AlertTriangle } from 'lucide-react';
import { Player } from '../types/game';
import { motion } from 'framer-motion';

interface ResultProps {
  winner: 'players' | 'imposters';
  players: Player[];
  votedOutPlayer: { name: string; isImposter: boolean } | null;
  imposters: string[];
  word: string;
  isHost: boolean;
  onRestart: () => void;
  onLeave: () => void;
}

export const Result = ({ winner, players, imposters, word, votedOutPlayer, isHost, onRestart, onLeave }: ResultProps) => {
  const imposterNames = players
    .filter((p) => imposters.includes(p.id))
    .map((p) => p.name);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-950/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`inline-flex p-6 rounded-3xl border-2 mb-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${winner === 'players'
              ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-cyan-500/20'
              : 'bg-magenta-500/10 border-magenta-500/50 text-magenta-500 shadow-magenta-500/20'
              }`}
          >
            <Trophy size={64} className="animate-bounce" />
          </motion.div>

          <motion.h2
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-7xl font-black italic tracking-tighter mb-4 ${winner === 'players' ? 'neon-text-cyan' : 'neon-text-magenta'
              }`}
          >
            {winner === 'players' ? 'AGENTS VICTORIOUS' : 'INFILTRATION SUCCESS'}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="text-white font-mono uppercase tracking-[0.5em] text-sm"
          >
            Protocol Terminated - Results Finalized
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="cyber-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 opacity-30 group-hover:opacity-100 transition-opacity" />
            <Shield className="text-cyan-400 mb-4" size={40} />
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">The Encrypted Word</p>
            <h3 className="text-5xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {word}
            </h3>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="cyber-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-magenta-500 opacity-30 group-hover:opacity-100 transition-opacity" />
            <AlertTriangle className="text-magenta-500 mb-4" size={40} />
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">The Infiltrators</p>
            <div className="flex flex-wrap justify-center gap-3">
              {imposterNames.map((name, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-magenta-500/10 border border-magenta-500/30 text-magenta-400 font-black tracking-tight text-xl uppercase">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {votedOutPlayer && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className={`cyber-card p-6 mb-8 text-center border-2 ${votedOutPlayer.isImposter
              ? 'border-green-500/30 bg-green-500/5'
              : 'border-red-500/30 bg-red-500/5'
              }`}
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Voted Out</p>
            <h4 className="text-2xl font-black text-white uppercase">{votedOutPlayer.name}</h4>
            <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${votedOutPlayer.isImposter ? 'text-green-400' : 'text-red-400'}`}>
              {votedOutPlayer.isImposter ? 'Identity Confirmed: Infiltrator' : 'Identity Confirmed: Innocent Agent'}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users size={20} className="text-cyan-400" />
            <h3 className="text-sm font-black tracking-widest uppercase">Squad Performance</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-2xl border transition-all duration-300 ${imposters.includes(player.id)
                  ? 'bg-magenta-500/5 border-magenta-500/20'
                  : 'bg-cyan-500/5 border-cyan-500/20'
                  }`}
              >
                <p className="font-bold text-white truncate text-center">{player.name}</p>
                <p className={`text-[10px] font-mono uppercase tracking-widest text-center mt-1 ${imposters.includes(player.id) ? 'text-magenta-500' : 'text-cyan-500'
                  }`}>
                  {imposters.includes(player.id) ? 'Infiltrator' : 'Agent'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {isHost && (
            <button
              onClick={onRestart}
              className="px-12 py-5 rounded-2xl bg-white text-black font-black tracking-widest hover:scale-[1.05] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <RefreshCw size={24} />
              RE-INITIATE
            </button>
          )}

          {!isHost && (
            <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-xl p-4 flex items-center justify-center">
              <p className="text-gray-400 text-center">
                Waiting for host to start a new game...
              </p>
            </div>
          )}

          <button
            onClick={onLeave}
            className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold tracking-widest hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <LogOut size={24} />
            TERMINATE
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
