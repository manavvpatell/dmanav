import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw, Star, Gift, ArrowRight } from 'lucide-react';
import { AppConfig } from '../types';

interface LoveGamesProps {
  config: AppConfig;
  onComplete: () => void;
}

interface MatchCard {
  id: number;
  emoji: string;
  label: string;
  msg: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MATCH_ITEMS = [
  { emoji: '💖', label: 'True Love', msg: 'Our hearts beat as one!' },
  { emoji: '💍', label: 'Forever', msg: 'A promise for all eternity!' },
  { emoji: '☕', label: 'Cozy Dates', msg: 'Warm mornings and endless smiles!' },
  { emoji: '🌟', label: 'Written Stars', msg: 'Our love is written in the cosmos!' },
];

export default function LoveGames({ config, onComplete }: LoveGamesProps) {
  const [activeTab, setActiveTab] = useState<'match' | 'jar'>('match');
  
  // Memory Match state
  const [cards, setCards] = useState<MatchCard[]>(() => {
    const doubled = [...MATCH_ITEMS, ...MATCH_ITEMS].map((item, index) => ({
      ...item,
      id: index,
      isFlipped: false,
      isMatched: false,
    }));
    return doubled.sort(() => Math.random() - 0.5);
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matchFeedback, setMatchFeedback] = useState<string>("Match pairs of romantic symbols to reveal secret messages of our bond...");

  // Jar state
  const [jarNotes, setJarNotes] = useState<string[]>([]);
  const [isOpeningJar, setIsOpeningJar] = useState(false);
  const [currentJarNote, setCurrentJarNote] = useState<string | null>(null);

  const reasons = config.reasons;

  const handleCardClick = (id: number) => {
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched || selectedIds.length >= 2) return;

    // Flip the clicked card
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      const firstCard = cards.find(c => c.id === newSelected[0])!;
      const secondCard = clickedCard;

      if (firstCard.emoji === secondCard.emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstCard.id || c.id === secondCard.id ? { ...c, isMatched: true } : c));
          setMatchFeedback(firstCard.msg);
          setSelectedIds([]);
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstCard.id || c.id === secondCard.id ? { ...c, isFlipped: false } : c));
          setSelectedIds([]);
        }, 1000);
      }
    }
  };

  const handleResetMatch = () => {
    const doubled = [...MATCH_ITEMS, ...MATCH_ITEMS].map((item, index) => ({
      ...item,
      id: index,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(doubled.sort(() => Math.random() - 0.5));
    setSelectedIds([]);
    setMatchFeedback("Match pairs of romantic symbols to reveal secret messages of our bond...");
  };

  const handleDrawNote = () => {
    if (isOpeningJar) return;
    setIsOpeningJar(true);
    setCurrentJarNote(null);

    // Cute extraction animation
    setTimeout(() => {
      const unusedNotes = reasons.filter(r => !jarNotes.includes(r));
      const source = unusedNotes.length > 0 ? unusedNotes : reasons;
      const randomNote = source[Math.floor(Math.random() * source.length)];
      
      setJarNotes(prev => [...prev, randomNote]);
      setCurrentJarNote(randomNote);
      setIsOpeningJar(false);
    }, 1000);
  };

  const isMatchCompleted = cards.every(c => c.isMatched);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 sm:p-6 z-10 font-sans">
      
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full text-center mb-8">
          <span className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold tracking-[0.25em] uppercase inline-flex items-center gap-1.5 border border-rose-100/50">
            <Gift className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Love Playground
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-rose-900 font-bold italic tracking-tight mt-3">
            Playful Love Games
          </h2>
          <p className="text-rose-700/80 text-sm mt-2 max-w-lg mx-auto font-serif italic">
            Before we reach our final destination, here are some cute interactions. Select a game below to play!
          </p>
        </div>

        {/* Tab Selection */}
        <div className="bg-rose-100/40 backdrop-blur-sm p-1.5 rounded-full flex gap-2 mb-8 border border-rose-200/50">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 font-serif cursor-pointer ${
              activeTab === 'match'
                ? 'bg-rose-500 text-white shadow-md border-2 border-rose-400'
                : 'text-rose-700 hover:text-rose-900'
            }`}
          >
            🧩 Cupid's Match
          </button>
          <button
            onClick={() => setActiveTab('jar')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 font-serif cursor-pointer ${
              activeTab === 'jar'
                ? 'bg-rose-500 text-white shadow-md border-2 border-rose-400'
                : 'text-rose-700 hover:text-rose-900'
            }`}
          >
            🏺 Magic Memory Jar
          </button>
        </div>

        {/* Game Area Card */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 shadow-[0_30px_70px_rgba(244,63,94,0.08)] border-2 border-rose-100/80 flex flex-col items-center min-h-[460px] justify-between relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {activeTab === 'match' ? (
              <motion.div
                key="match-game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center"
              >
                {/* 2x4 Grid for memory match */}
                <div className="grid grid-cols-4 gap-4 mb-8 w-full max-w-md">
                  {cards.map((card) => {
                    const isOpen = card.isFlipped || card.isMatched;
                    return (
                      <motion.div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        whileHover={{ scale: isOpen ? 1 : 1.05 }}
                        whileTap={{ scale: isOpen ? 1 : 0.95 }}
                        className="aspect-square relative cursor-pointer [perspective:1000px]"
                      >
                        <motion.div
                          animate={{ rotateY: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full [transform-style:preserve-3d] relative rounded-2xl shadow-sm border border-rose-100"
                        >
                          {/* Front Side (Face down, showing heart pattern) */}
                          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl flex items-center justify-center text-rose-300">
                            <Heart className="w-8 h-8 fill-rose-200/50 text-rose-300" />
                          </div>

                          {/* Back Side (Face up, showing Emoji) */}
                          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-rose-50 rounded-2xl flex flex-col items-center justify-center border-2 border-rose-400">
                            <span className="text-3xl select-none">{card.emoji}</span>
                            <span className="text-[10px] text-rose-600 font-bold mt-1 font-sans select-none">{card.label}</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Feedback text */}
                <div className="w-full max-w-lg bg-rose-50/40 rounded-2xl p-5 border border-rose-100/50 text-center font-serif text-rose-950 italic text-base min-h-[80px] flex items-center justify-center shadow-inner relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold tracking-widest uppercase font-serif">
                    Cupid's Voice
                  </span>
                  <p className="leading-relaxed">
                    {matchFeedback}
                  </p>
                </div>

                {/* Reset button */}
                <div className="w-full flex items-center justify-end mt-6 text-sm">
                  <button
                    onClick={handleResetMatch}
                    className="text-rose-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer font-serif"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Cards
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="jar-game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center"
              >
                {/* Magical Jar graphics */}
                <div className="relative w-56 h-64 flex items-center justify-center mb-6">
                  {/* Glowing background */}
                  <div className="absolute inset-x-8 inset-y-12 bg-rose-200/30 rounded-3xl filter blur-2xl animate-pulse" />
                  
                  <motion.div
                    onClick={handleDrawNote}
                    whileHover={{ scale: 1.05 }}
                    animate={isOpeningJar ? { rotate: [0, -3, 3, -3, 3, 0] } : {}}
                    className="w-40 h-56 bg-white/40 border-4 border-rose-200 rounded-t-[3rem] rounded-b-[2rem] shadow-lg relative flex flex-col items-center justify-between p-4 cursor-pointer backdrop-blur-xs overflow-hidden"
                  >
                    {/* Jar Lid */}
                    <div className="absolute top-0 inset-x-8 h-4 bg-rose-300 rounded-full shadow-md border-b border-rose-400" />
                    
                    {/* Jar Contents (Floating notes/stars) */}
                    <div className="flex-1 w-full relative mt-6 flex flex-wrap gap-2 items-center justify-center">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, Math.random() * -15 - 5, 0],
                            rotate: [0, Math.random() * 20 - 10, 0]
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-6 h-6 bg-rose-50 border border-rose-200 rounded-xs flex items-center justify-center shadow-xs text-[10px] text-rose-500 font-bold"
                        >
                          ♥
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest text-center mt-2 z-10 select-none">
                      Tap Jar to Open
                    </p>
                  </motion.div>
                </div>

                {/* Extracted Note Display */}
                <AnimatePresence mode="wait">
                  {currentJarNote ? (
                    <motion.div
                      key="active-jar-note"
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="w-full max-w-lg bg-[#fffdfa] rounded-2xl p-6 border-2 border-rose-100 shadow-md text-center font-serif text-rose-900 text-lg leading-relaxed italic relative"
                    >
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold tracking-widest uppercase font-serif">
                        Love Note Drawn
                      </span>
                      <p>
                        "{currentJarNote}"
                      </p>
                    </motion.div>
                  ) : (
                    <div className="h-24 flex items-center justify-center text-rose-400 font-serif italic text-sm">
                      {isOpeningJar ? "Reaching in for a sweet memory note... ✨" : "Click the jar to pick a custom note..."}
                    </div>
                  )}
                </AnimatePresence>
                
                {/* Note statistics */}
                <p className="text-rose-600 font-serif font-bold text-sm mt-6">
                  Notes opened: <span className="text-rose-800 text-base">{jarNotes.length}</span> / {reasons.length}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Magical Next Button unlocked upon completing the memory match game */}
          <div className="w-full mt-8 flex flex-col items-center">
            {isMatchCompleted ? (
              <motion.button
                onClick={onComplete}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="px-12 py-4 bg-rose-500 text-white rounded-full font-serif text-lg shadow-lg hover:bg-rose-600 transition-colors border-2 border-rose-400 flex items-center gap-3 font-semibold cursor-pointer animate-bounce"
              >
                Open the Secret Garden
                <ArrowRight className="w-6 h-6 animate-pulse text-white" />
              </motion.button>
            ) : (
              <p className="text-rose-400/80 text-xs font-semibold text-center leading-relaxed font-serif italic animate-pulse">
                🧩 Match all romantic symbol pairs in Cupid's Match to unlock the path forward...
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
