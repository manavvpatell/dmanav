import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Trophy, Calendar, Gift, Check, Clock } from 'lucide-react';
import { AppConfig } from '../types';

interface ProposalScreenProps {
  config: AppConfig;
}

export default function ProposalScreen({ config }: ProposalScreenProps) {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noBtnOffset, setNoBtnOffset] = useState({ x: 0, y: 0 });
  const [daysTogether, setDaysTogether] = useState<number | null>(null);

  // Funny excuses for the "No" button
  const funnyExcuses = [
    "No",
    "Are you absolutely sure? 🥺",
    "Error: Option disabled! ❌",
    "Nice try, try YES! 😉",
    "But my heart will break... 💔",
    "No is not an option! ❤️",
    "Think of our sweet coffee dates! ☕",
    "But I bought the velvet ring box... 💍",
    "Access Denied! 😜",
    "No way! 💕"
  ];

  const handleNoInteraction = () => {
    // Relocate to a random offset within bounds
    const maxX = 130;
    const maxY = 100;
    const randomX = (Math.random() * 2 - 1) * maxX;
    const randomY = (Math.random() * 2 - 1) * maxY;
    
    setNoBtnOffset({ x: randomX, y: randomY });
    setNoCount(prev => (prev + 1) % funnyExcuses.length);
  };

  const handleYes = () => {
    setHasAccepted(true);
  };

  // Calculate days together from anniversary date
  useEffect(() => {
    if (config.anniversaryDate) {
      const annDate = new Date(config.anniversaryDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - annDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysTogether(diffDays);
    }
  }, [config.anniversaryDate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 sm:p-6 z-10 font-sans">
      <AnimatePresence mode="wait">
        {!hasAccepted ? (
          <motion.div
            key="proposal-question-card"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -50 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 shadow-[0_30px_70px_rgba(244,63,94,0.12)] border-4 border-rose-100/80 text-center relative overflow-hidden"
          >
            {/* Soft decorative visual overlays */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-rose-100/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-pink-100/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              
              {/* Proposal Ring Box Image */}
              <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-lg border-4 border-rose-100/60 mb-8 relative group">
                <img
                  src="/src/assets/images/ring_box_1783417495924.jpg"
                  alt="Velvet Ring Box"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-rose-100/10 mix-blend-overlay pointer-events-none" />
              </div>

              {/* Badges */}
              <span className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold tracking-[0.25em] uppercase inline-flex items-center gap-1.5 mb-6 border border-rose-100/50">
                <Sparkles className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                The Ultimate Question
              </span>

              {/* Main Proposal Text */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-rose-950 font-bold italic leading-tight mb-6">
                {config.proposalQuestion}
              </h1>

              <p className="text-rose-800/80 text-base sm:text-lg leading-relaxed max-w-lg mb-10 font-serif italic">
                "{config.proposalMessage}"
              </p>

              {/* Interactive Buttons */}
              <div className="relative h-28 w-full max-w-md flex items-center justify-center gap-6">
                
                {/* YES BUTTON */}
                <motion.button
                  onClick={handleYes}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-rose-500 text-white rounded-full font-serif text-2xl shadow-lg hover:bg-rose-600 transition-all border-2 border-rose-400 flex items-center gap-3 font-semibold cursor-pointer z-30"
                >
                  <Heart className="w-6 h-6 fill-current animate-bounce text-white" />
                  YES! 💖
                </motion.button>

                {/* NO BUTTON (Escapes!) */}
                <motion.button
                  onMouseEnter={handleNoInteraction}
                  onClick={handleNoInteraction}
                  animate={{ x: noBtnOffset.x, y: noBtnOffset.y }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="px-6 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-serif rounded-full border border-gray-200 transition-all text-sm absolute z-20 whitespace-nowrap cursor-pointer"
                  style={{
                    // Centered starting position on the opposite side
                    right: '15%',
                  }}
                >
                  {funnyExcuses[noCount]}
                </motion.button>

              </div>
              
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="celebration-card"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-full max-w-2xl bg-[#fffdfb] rounded-[3rem] p-8 sm:p-12 shadow-[0_40px_100px_rgba(244,63,94,0.18)] border-8 border-rose-100 text-center relative overflow-hidden"
          >
            {/* Heavy festive background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              
              {/* Confetti celebration icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex p-6 bg-rose-50 rounded-full text-rose-500 mb-8 relative border border-rose-100/50 shadow-sm"
              >
                <Heart className="w-16 h-16 fill-rose-500 text-rose-600 animate-pulse" />
                <Sparkles className="w-8 h-8 text-yellow-400 absolute top-2 right-2 animate-bounce" />
                <Sparkles className="w-6 h-6 text-rose-400 absolute bottom-3 left-2 animate-pulse" />
              </motion.div>

              <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-rose-900 mb-2 italic">
                She Said YES! 💖💍
              </h1>
              <p className="text-rose-600 font-serif font-bold text-lg tracking-wide uppercase mb-8">
                {config.senderName} & {config.partnerName} • Bound Forever
              </p>

              {/* Days Together Counter */}
              {daysTogether && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-10 text-left font-serif">
                  <div className="bg-white rounded-[1.5rem] p-5 border border-rose-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl text-rose-500 border border-rose-100/50">
                      <Clock className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest font-serif">Time in Love</p>
                      <p className="text-2xl font-bold text-rose-950 italic">{daysTogether} Days</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-[1.5rem] p-5 border border-rose-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl text-rose-500 border border-rose-100/50">
                      <Calendar className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest font-serif">Where it Began</p>
                      <p className="text-2xl font-bold text-rose-950 italic">
                        {new Date(config.anniversaryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lifelong Commitment Letter */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full bg-[#fdfdfc] rounded-3xl p-6 sm:p-8 border-2 border-dashed border-rose-200 text-left relative shadow-sm"
              >
                <div className="absolute top-4 right-4 text-rose-200 text-4xl font-serif opacity-30 select-none">
                  ♥
                </div>

                <div className="pl-6 border-l-2 border-rose-200 font-serif text-rose-950 leading-relaxed text-base sm:text-lg space-y-4">
                  <p className="font-extrabold text-rose-900 text-xl font-serif italic">My Lifetime Promise to You:</p>
                  
                  <p className="italic text-rose-900/95">
                    From this day forward, you will never have to walk alone. I promise to be your biggest cheerleader in times of joy, your soft shoulder in times of sorrow, and your constant safe harbor through all of life's unpredictable tides.
                  </p>

                  <p className="italic text-rose-900/95">
                    I promise to always listen with an open heart, to fill our home with laughter, to respect your dreams as much as my own, and to love you more with every single sunrise.
                  </p>

                  <p className="font-extrabold text-rose-800 text-right pt-4 italic">
                    Forever and always yours,
                  </p>
                  <p className="font-extrabold text-rose-700 text-xl text-right italic">
                    {config.senderName}
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
