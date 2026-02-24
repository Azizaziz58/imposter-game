import { Shield, Target, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleRevealProps {
  isImposter: boolean;
  word: string | null;
}

export const RoleReveal = ({ isImposter, word }: RoleRevealProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-950/20 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`inline-flex p-6 rounded-3xl border-2 mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${isImposter
              ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-red-500/20'
              : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-500 shadow-cyan-500/20'
              }`}
          >
            {isImposter ? <Target size={48} className="animate-pulse" /> : <Shield size={48} />}
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-5xl font-black italic tracking-tighter mb-2 ${isImposter ? 'neon-text-magenta' : 'neon-text-cyan'
              }`}
          >
            {isImposter ? 'INFILTRATOR' : 'SECURE AGENT'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-white font-mono uppercase tracking-[0.3em] text-xs"
          >
            Identity Authenticated
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`cyber-card p-10 text-center relative overflow-hidden group ${isImposter ? 'neon-border-purple' : 'neon-border-cyan'
            }`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            {isImposter ? <AlertCircle size={80} /> : <Info size={80} />}
          </div>

          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-500 mb-4">
            Your Mission Word:
          </p>

          {isImposter ? (
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-600 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                UNKNOWN
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-[200px] mx-auto uppercase">
                Infiltrate the squad. Descrypt the cipher through observation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] uppercase">
                {word}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-[200px] mx-auto uppercase">
                Protect this cipher. Identify the infiltrators among you.
              </p>
            </div>
          )}

          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className={`absolute top-0 left-0 h-[1px] w-full opacity-30 ${isImposter ? 'bg-purple-500' : 'bg-cyan-500'
              }`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400/60 bg-cyan-500/5 px-4 py-2 rounded-full border border-cyan-500/10">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
            MISSION COMMENCING IN 5S
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
