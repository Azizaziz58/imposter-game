import { MessageCircle, Clock, Send, Shield, AlertCircle, Target } from 'lucide-react';
import { Player, ChatMessage } from '../types/game';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscussionProps {
  timeLeft: number;
  players: Player[];
  playerId: string;
  isImposter: boolean;
  word: string | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export const Discussion = ({
  timeLeft,
  players,
  playerId,
  isImposter,
  word,
  messages,
  onSendMessage
}: DiscussionProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / 60) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pb-24 md:pb-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl h-[85vh] grid md:grid-cols-[1fr_350px] gap-6"
      >
        <div className="flex flex-col h-full cyber-card neon-border-cyan overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-black tracking-widest text-sm uppercase">Secure Channel</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Encypted</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  className="h-full flex items-center justify-center text-gray-500 italic text-sm font-mono tracking-widest uppercase"
                >
                  Listening for transmissions...
                </motion.div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col ${msg.senderId === playerId ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-2">
                      <span className={`text-[10px] font-mono uppercase tracking-widest ${msg.senderId === playerId ? 'text-cyan-500' : 'text-purple-400'
                        }`}>
                        {msg.senderName}
                      </span>
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] break-words shadow-lg ${msg.senderId === playerId
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none'
                      : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5 backdrop-blur-md'
                      }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Broadcasting..."
              className="w-full glass-input pr-14 font-mono text-sm tracking-wider"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 text-white rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6 h-full">
          <div className="cyber-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-48 group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-500/60">Time Extraction</span>
            </div>
            <div className={`text-6xl font-black font-mono tracking-tighter ${timeLeft <= 10 ? 'text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-white'
              }`}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden border border-white/5">
              <motion.div
                className={`h-full ${timeLeft <= 10 ? 'bg-red-500' : 'bg-cyan-500'}`}
                initial={{ width: "100%" }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </div>

          <div className={`cyber-card p-6 flex-1 flex flex-col relative overflow-hidden ${isImposter ? 'neon-border-purple' : 'neon-border-cyan'
            }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${isImposter ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                {isImposter ? <AlertCircle size={20} /> : <Shield size={20} />}
              </div>
              <h3 className="font-black tracking-widest text-sm uppercase">Intel Report</h3>
            </div>

            <div className="space-y-6 flex-1">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                  <Target size={40} />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-500 mb-2">Payload Word</p>
                <p className={`text-4xl font-black tracking-widest uppercase ${isImposter ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600' : 'neon-text-cyan'
                  }`}>
                  {isImposter ? 'UNKNOWN' : word}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 ml-2">Active Squad</p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {players.map((player) => (
                    <div key={player.id} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                      <span className="text-xs font-bold text-white truncate uppercase">{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-500/40 mb-2">Tactical Tips</p>
              <ul className="text-[10px] text-gray-500 space-y-1 italic leading-tight font-sans">
                <li>• Watch for hesitation in responses</li>
                <li>• Use code-words to verify agents</li>
                <li>• Imposters must blend or deflect</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
