import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Lock, MailOpen, ArrowRight, Sparkles } from 'lucide-react';
import { AppConfig } from '../types';

interface IntroScreenProps {
  config: AppConfig;
  onComplete: () => void;
}

export default function IntroScreen({ config, onComplete }: IntroScreenProps) {
  const [nameInput, setNameInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = nameInput.trim().toLowerCase();
    const cleanPartnerName = config.partnerName.trim().toLowerCase();

    if (!cleanInput) {
      setErrorText("Please enter your name, sweetie! ❤️");
      return;
    }

    // Allow flexible match, but if they enter anything, let them proceed (it's a proposal app, no strict locks, but make it playful!)
    if (cleanInput === cleanPartnerName) {
      setIsUnlocked(true);
      setErrorText('');
    } else {
      setErrorText(`Wait, this letter is strictly sealed for ${config.partnerName}! But... since you look beautiful, I will let you open it anyway! 😉`);
      setTimeout(() => {
        setIsUnlocked(true);
        setErrorText('');
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-6 z-10 font-sans">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="unlock-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-10 shadow-[0_30px_70px_rgba(244,63,94,0.12)] border-2 border-rose-100/80 text-center relative overflow-hidden"
          >
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex p-4 bg-rose-50 rounded-full text-rose-500 mb-6 relative">
                <Heart className="w-8 h-8 fill-rose-400 text-rose-500 animate-pulse" />
                <Sparkles className="w-4 h-4 text-rose-400 absolute top-2 right-2 animate-bounce" />
              </div>

              <p className="text-rose-400 uppercase tracking-[0.3em] text-xs font-semibold mb-2">Our Forever Story</p>
              <h1 className="text-3xl font-serif text-rose-900 font-bold italic mb-3">
                A Sealed Invitation
              </h1>
              <p className="text-rose-700/80 text-sm mb-8 font-serif leading-relaxed">
                Welcome, my love. An interactive love diary, custom memory lanes, and a very special question are waiting inside. Please enter your name to unlock.
              </p>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-5 py-4 bg-rose-50/50 hover:bg-rose-50/80 focus:bg-white border-2 border-rose-100 focus:border-rose-300 rounded-2xl text-rose-950 placeholder-rose-300 outline-none text-center font-serif italic text-lg transition-all duration-300"
                  />
                </div>

                {errorText && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 text-xs font-semibold px-2 font-serif"
                  >
                    {errorText}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-serif text-lg font-bold rounded-full border-2 border-rose-400 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Unlock My Letter
                </button>
              </form>
            </div>
          </motion.div>
        ) : !isEnvelopeOpened ? (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            className="w-full max-w-lg flex flex-col items-center"
          >
            <p className="text-rose-400 uppercase tracking-[0.4em] text-xs font-semibold mb-6 animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              Sealed with love • Click envelope to open
            </p>

            <motion.div
              onClick={() => setIsEnvelopeOpened(true)}
              whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6] rounded-[2.5rem] border-4 border-rose-200/60 p-8 shadow-[0_35px_70px_rgba(244,63,94,0.15)] text-center relative w-full aspect-[4/3] flex flex-col items-center justify-center border-dashed overflow-hidden"
            >
              {/* Envelope flap aesthetic */}
              <div className="absolute top-0 inset-x-0 h-0 border-t-[80px] border-t-rose-200/30 border-x-[150px] border-x-transparent pointer-events-none" />
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-rose-400 mb-4"
              >
                <MailOpen className="w-20 h-20 fill-rose-100 stroke-1.5 text-rose-400" />
              </motion.div>

              <h2 className="text-3xl font-serif text-rose-900 font-bold italic tracking-wide mb-1">
                To My Darling, {config.partnerName}
              </h2>
              <p className="text-rose-400 text-xs tracking-widest uppercase font-semibold">
                Forever Starts Today
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="letter-view"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-full max-w-2xl bg-[#fdfdfc] rounded-[2.5rem] p-8 sm:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.06)] border-2 border-rose-100/70 relative overflow-hidden"
          >
            {/* Lined paper lines aesthetic */}
            <div className="absolute inset-y-0 left-12 w-[1px] bg-red-200/30" />
            <div className="absolute top-0 right-8 text-rose-100 text-7xl font-serif opacity-30 select-none">
              ♥
            </div>

            <div className="relative z-10 pl-8 font-serif leading-relaxed text-rose-950 text-lg sm:text-xl space-y-6">
              <p className="font-bold text-rose-900 text-2xl mb-8 font-serif italic">
                Dearest {config.partnerName},
              </p>
              
              <p className="font-serif italic text-rose-900">
                I made this digital space just for us, to capture some of our most beautiful moments.
                Every single day I spend with you feels like a gift. As we look back on our journey together, I want you to remember how incredibly much you mean to me.
              </p>

              <p className="font-serif italic text-rose-900">
                Please turn these pages with me. Let's revisit our cozy memories, laugh at our silly milestones, and look forward to the future.
              </p>

              <p className="pt-6 font-bold text-rose-800 text-right">
                With all my heart,
              </p>
              <p className="font-bold text-rose-700 text-2xl text-right italic font-serif">
                {config.senderName}
              </p>

              <div className="pt-10 flex justify-center font-sans">
                <button
                  onClick={onComplete}
                  className="px-12 py-4 bg-rose-500 text-white rounded-full font-serif text-lg shadow-lg hover:bg-rose-600 transition-colors border-2 border-rose-400 flex items-center gap-3 font-semibold cursor-pointer"
                >
                  Start Our Scrapbook
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
