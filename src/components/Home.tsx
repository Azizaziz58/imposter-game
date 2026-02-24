import { useState } from 'react';
import { Search, Plus, User, ArrowRight, Shield, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeProps {
  onCreateRoom: (playerName: string, maxPlayers: number) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
}

export const Home = ({ onCreateRoom, onJoinRoom }: HomeProps) => {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) onCreateRoom(playerName, maxPlayers);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && roomCode.trim()) onJoinRoom(roomCode.toUpperCase(), playerName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {mode === 'menu' && (
          <motion.div
            key="menu"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg text-center"
          >
            <div className="mb-12 relative inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 opacity-20"
              >
                <div className="w-full h-full rounded-full border-2 border-dashed border-cyan-500" />
              </motion.div>
              <h1 className="text-8xl font-black italic tracking-tighter mb-2 relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  WORD
                </span>
                <br />
                <span className="glitch-text text-white">IMPOSTER</span>
              </h1>
              <div className="h-1 w-32 bg-cyan-500 mx-auto rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
            </div>

            <div className="grid gap-6">
              <button
                onClick={() => setMode('create')}
                className="btn-cyber-primary group relative overflow-hidden text-xl py-6"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <Plus size={24} />
                  <span>INITIALIZE ROOM</span>
                </div>
              </button>

              <button
                onClick={() => setMode('join')}
                className="btn-cyber-secondary group relative overflow-hidden text-xl py-6"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <ArrowRight size={24} />
                  <span>DECRYPT & JOIN</span>
                </div>
              </button>
            </div>

            <div className="mt-12 flex justify-center gap-8 text-cyan-400 opacity-60">
              <div className="flex flex-col items-center gap-2">
                <Shield size={20} />
                <span className="text-[10px] uppercase font-mono">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap size={20} />
                <span className="text-[10px] uppercase font-mono">Fast</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Target size={20} />
                <span className="text-[10px] uppercase font-mono">Tactical</span>
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div
            key="create"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md cyber-card neon-border-cyan p-8"
          >
            <h2 className="text-3xl font-black text-cyan-400 mb-8 flex items-center gap-3">
              <Plus className="bg-cyan-500/20 p-1.5 rounded-lg" size={32} />
              CONFIGURE ROOM
            </h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-cyan-500/60 mb-2 ml-1">Agent Alias</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" />
                  <input
                    autoFocus
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter Alias..."
                    className="glass-input w-full pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-cyan-500/60 mb-2 ml-1">Team Capacity</label>
                <div className="grid grid-cols-6 gap-2">
                  {[3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMaxPlayers(num)}
                      className={`py-3 rounded-lg font-bold border transition-all duration-200 ${maxPlayers === num
                        ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  ABORT
                </button>
                <button type="submit" className="flex-[2] btn-cyber-primary py-4">
                  LAUNCH MISSION
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div
            key="join"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md cyber-card neon-border-purple p-8"
          >
            <h2 className="text-3xl font-black text-purple-400 mb-8 flex items-center gap-3">
              <ArrowRight className="bg-purple-500/20 p-1.5 rounded-lg" size={32} />
              DECRYPT ACCESS
            </h2>
            <form onSubmit={handleJoin} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-purple-500/60 mb-2 ml-1">Agent Alias</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/50" />
                  <input
                    autoFocus
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter Alias..."
                    className="glass-input w-full pl-12 focus:border-purple-500/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-purple-500/60 mb-2 ml-1">Access Code</label>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/50" />
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Enter Code..."
                    className="glass-input w-full pl-12 uppercase tracking-[0.2em] font-mono focus:border-purple-500/50"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  BACK
                </button>
                <button type="submit" className="flex-[2] btn-cyber-secondary py-4">
                  ENTER ROOM
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
