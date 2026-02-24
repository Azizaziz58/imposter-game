import { Target, User, AlertTriangle } from 'lucide-react';
import { Player, Vote } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

interface VotingProps {
  players: Player[];
  playerId: string;
  votes: Vote[];
  onVote: (targetId: string) => void;
}

export const Voting = ({ players, playerId, votes, onVote }: VotingProps) => {
  const hasVoted = votes.some((v) => v.voterId === playerId);
  const voterCount = votes.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-950/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] mb-6"
          >
            <Target size={32} className="animate-pulse" />
          </motion.div>
          <h2 className="text-5xl font-black italic tracking-tighter text-white mb-2">
            ELIMINATION PROTOCOL
          </h2>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.4em]">Identify & Neutralize Infiltrators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {players.map((player) => {
              const voteCountForPlayer = votes.filter((v) => v.targetId === player.id).length;
              const isSelected = hasVoted && votes.find(v => v.voterId === playerId)?.targetId === player.id;

              return (
                <motion.button
                  key={player.id}
                  layout
                  whileHover={!hasVoted ? { scale: 1.02, y: -5 } : {}}
                  whileTap={!hasVoted ? { scale: 0.98 } : {}}
                  disabled={hasVoted}
                  onClick={() => onVote(player.id)}
                  className={`cyber-card p-6 flex flex-col items-center gap-4 text-center relative group transition-all duration-300 ${isSelected ? 'neon-border-cyan ring-2 ring-cyan-500/50 bg-cyan-500/10' : 'hover:neon-border-purple'
                    } ${hasVoted && !isSelected ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className={`p-4 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500 group-hover:bg-purple-500/20 group-hover:text-purple-400'
                    }`}>
                    <User size={32} />
                  </div>

                  <div>
                    <p className="text-xl font-black tracking-tight uppercase group-hover:neon-text-cyan transition-all duration-300">
                      {player.name}
                      {player.id === playerId && <span className="ml-2 text-[10px] text-gray-500 font-normal tracking-normal">(YOU)</span>}
                    </p>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                      {player.id === playerId ? 'Identity Secured' : 'Subject Under Review'}
                    </p>
                  </div>

                  {voteCountForPlayer > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white font-mono text-xs font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-950"
                    >
                      {voteCountForPlayer}
                    </motion.div>
                  )}

                  {isSelected && (
                    <div className="absolute top-2 left-2 text-cyan-500 animate-pulse">
                      <Target size={20} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 px-10 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-left">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Authorization Progress</p>
              <div className="flex gap-2">
                {players.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i < voterCount ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-gray-800'
                      }`}
                  />
                ))}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm tracking-widest">
              <span className="animate-pulse">{voterCount}/{players.length}</span>
              <span className="text-gray-600">AUTH. VOTES</span>
            </div>
          </div>
        </motion.div>

        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest backdrop-blur-xl"
          >
            <AlertTriangle size={16} />
            Transmission Sent - Waiting for Squad Consensus
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
