import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Heart, MessageCircleHeart, Sparkles, Smile, Star } from 'lucide-react';
import { AppConfig, Memory } from '../types';

interface MemoryLaneProps {
  config: AppConfig;
  onNext: () => void;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export default function MemoryLane({ config, onNext }: MemoryLaneProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipped, setIsFlipped] = useState<Record<string, boolean>>({});
  const [reactions, setReactions] = useState<FloatingEmoji[]>([]);
  const [emojiCount, setEmojiCount] = useState(0);

  const memories = config.memories;
  const currentMemory = memories[currentPage];

  const handleNextPage = () => {
    if (currentPage < memories.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleFlip = (id: string) => {
    setIsFlipped(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const triggerReaction = (emoji: string) => {
    const id = emojiCount;
    setEmojiCount(prev => prev + 1);
    
    const newReaction: FloatingEmoji = {
      id,
      emoji,
      x: 30 + Math.random() * 40, // percentage near middle
      y: 60 + Math.random() * 20,
    };

    setReactions(prev => [...prev, newReaction]);

    // Cleanup after animation completes
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 sm:p-6 z-10 font-sans">
      
      {/* Floating Reactions Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {reactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 0, scale: 0.5, y: reaction.y + "%", x: reaction.x + "%" }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.5, 1.2, 0.8],
                y: [reaction.y + "%", (reaction.y - 40) + "%"],
                x: [reaction.x + "%", (reaction.x + (Math.random() * 20 - 10)) + "%"],
                rotate: [0, Math.random() * 40 - 20]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute text-5xl"
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Memory Book Container */}
        <div className="w-full text-center mb-8">
          <span className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold tracking-[0.25em] uppercase inline-flex items-center gap-1.5 border border-rose-100/50">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            Our Memory Album
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-rose-900 font-bold italic tracking-tight mt-3">
            The Pages of Us
          </h2>
          <p className="text-rose-700/80 text-sm mt-2 font-serif italic">
            Page {currentPage + 1} of {memories.length} • Click on the photo to read a secret handwritten note
          </p>
        </div>

        {/* The Double-Page Album Layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#fdfdfc] rounded-[2.5rem] border-8 border-rose-100 shadow-[0_30px_70px_rgba(244,63,94,0.08)] min-h-[480px] overflow-hidden relative">
          
          {/* Subtle notebook binder rings in the center of double-pages on desktop */}
          <div className="hidden md:flex absolute inset-y-0 left-1/2 -ml-3 flex-col justify-around py-8 z-30 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-200 to-rose-100 border border-rose-300/30 shadow-inner flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-rose-400/40" />
              </div>
            ))}
          </div>

          {/* Left Page (The Photo View) */}
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center border-b border-rose-100 md:border-b-0 md:border-r border-dashed border-rose-200/50 relative bg-[#fcfbfa]">
            {/* Polaroid Photo Frame */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`photo-container-${currentPage}`}
                initial={{ opacity: 0, rotate: currentPage % 2 === 0 ? -3 : 3, scale: 0.92 }}
                animate={{ opacity: 1, rotate: currentPage % 2 === 0 ? -1.5 : 1.5, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4 }}
                onClick={() => toggleFlip(currentMemory.id)}
                className="cursor-pointer relative z-10"
              >
                {/* Washi tape decor */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-8 bg-rose-50/80 border border-rose-100/30 backdrop-blur-[2px] shadow-sm transform -rotate-2 z-20 flex items-center justify-center">
                  <div className="w-full h-full border-x-2 border-dashed border-rose-200/40" />
                </div>

                {/* Perspective container for 3D card flip */}
                <div className="w-72 sm:w-80 bg-white p-4 pb-8 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-rose-100/50 rounded-sm transform transition-all duration-300 hover:shadow-[0_20px_45px_rgba(244,63,94,0.1)] hover:-translate-y-1">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-rose-50/50 rounded-xs">
                    
                    {/* Flipping wrapper */}
                    <div className="w-full h-full [perspective:1000px]">
                      <motion.div
                        className="w-full h-full relative [transform-style:preserve-3d] transition-all duration-700"
                        animate={{ rotateY: isFlipped[currentMemory.id] ? 180 : 0 }}
                      >
                        {/* Front Side: Image */}
                        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                          <img
                            src={currentMemory.imageUrl}
                            alt={currentMemory.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Back Side: Private handwritten note */}
                        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-rose-50/90 p-6 flex flex-col justify-center items-center text-center text-rose-950 border border-rose-100 rounded-xs font-serif overflow-y-auto">
                          <MessageCircleHeart className="w-8 h-8 text-rose-400 mb-2 fill-rose-100 stroke-1.5 animate-bounce" />
                          <h4 className="font-bold text-lg text-rose-900 mb-2 font-serif italic">Secret Love Note</h4>
                          <p className="text-sm italic leading-relaxed text-rose-800">
                            "{config.partnerName}, looking back at this memory makes me smile so bright. I love how happy we were, and I can't wait to make ten thousand more memories just like this one."
                          </p>
                          <span className="text-xs font-bold text-rose-400 mt-4 block">♥ Tap to flip back</span>
                        </div>
                      </motion.div>
                    </div>

                  </div>

                  {/* Polaroid caption with handwritten style */}
                  <div className="mt-4 text-center font-serif">
                    <h3 className="text-rose-900 font-serif font-bold text-lg italic mt-1 leading-tight">
                      {currentMemory.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Page (The Notebook Text & Reactions) */}
          <div className="p-8 sm:p-10 flex flex-col justify-between relative bg-rose-50/5 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-container-${currentPage}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 flex-1 flex flex-col justify-center"
              >
                <div className="inline-flex text-rose-400">
                  <Sparkles className="w-5 h-5 animate-spin text-rose-400" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950 italic leading-tight">
                  {currentMemory.title}
                </h3>
                
                <p className="font-serif italic text-rose-900/90 text-base sm:text-lg leading-relaxed pl-4 border-l-2 border-rose-200">
                  {currentMemory.description}
                </p>

                {/* Reactive Emojis board */}
                <div className="pt-4">
                  <p className="text-rose-600 font-serif font-semibold text-xs uppercase tracking-widest mb-3">
                    Send a reaction to this memory:
                  </p>
                  <div className="flex gap-3">
                    {['❤️', '✨', '🥺', '🥰', '😭'].map((emo) => (
                      <motion.button
                        key={emo}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => triggerReaction(emo)}
                        className="w-12 h-12 rounded-full bg-white shadow-sm border border-rose-100/50 flex items-center justify-center text-2xl hover:bg-rose-50/50 transition-colors cursor-pointer"
                      >
                        {emo}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="pt-8 border-t border-rose-100 flex items-center justify-between mt-auto">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`p-3.5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === 0
                    ? 'text-gray-300 border-gray-100 cursor-not-allowed bg-gray-50'
                    : 'text-rose-500 border-rose-100 hover:bg-rose-50/50 active:scale-95 bg-white shadow-sm'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {currentPage === memories.length - 1 ? (
                <button
                  onClick={onNext}
                  className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-serif text-lg rounded-full border-2 border-rose-400 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-bold cursor-pointer"
                >
                  Unlock Our Love Games
                  <Sparkles className="w-4 h-4 fill-current animate-pulse text-white" />
                </button>
              ) : (
                <button
                  onClick={handleNextPage}
                  className="px-8 py-3.5 bg-white text-rose-500 border-2 border-rose-100 hover:bg-rose-50 font-serif text-lg rounded-full shadow-sm flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  Next Page
                  <ArrowRight className="w-5 h-5 text-rose-500" />
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
