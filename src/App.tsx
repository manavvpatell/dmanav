import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Image, MessageCircle } from 'lucide-react';
import { AppConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import FloatingHearts from './components/FloatingHearts';
import IntroScreen from './components/IntroScreen';
import MemoryLane from './components/MemoryLane';
import LoveGames from './components/LoveGames';
import ProposalScreen from './components/ProposalScreen';

type Step = 'intro' | 'memories' | 'games' | 'proposal';

export default function App() {
  const [config] = useState<AppConfig>(DEFAULT_CONFIG);
  const [currentStep, setCurrentStep] = useState<Step>('intro');

  // Ensure any cached configuration is removed to enforce default names permanently
  useEffect(() => {
    localStorage.removeItem('our_proposal_config');
  }, []);

  // Progress steps details
  const stepsList: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'intro', label: 'Love Letter', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'memories', label: 'Scrapbook', icon: <Image className="w-4 h-4" /> },
    { id: 'games', label: 'Playground', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'proposal', label: 'Forever', icon: <Heart className="w-4 h-4" /> },
  ];

  const getStepIndex = (step: Step) => {
    return stepsList.findIndex((s) => s.id === step);
  };

  return (
    <div 
      className="min-h-screen bg-[#fdf2f8] text-rose-950 relative overflow-x-hidden font-sans pb-16 transition-all duration-1000"
      style={{ background: 'radial-gradient(circle at center, #fff1f2 0%, #fce7f3 100%)' }}
    >
      {/* Immersive UI Decorative Floating Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-pink-200 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-rose-200 blur-[80px] opacity-50 pointer-events-none" />
      
      {/* Background Floating Hearts */}
      <FloatingHearts />

      {/* Love Progress Meter */}
      <div className="fixed top-6 inset-x-0 mx-auto w-full max-w-lg px-4 z-40">
        <div className="bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-[0_15px_35px_rgba(244,63,94,0.08)] border border-rose-100 flex items-center justify-between">
          {stepsList.map((step, idx) => {
            const isCompleted = getStepIndex(currentStep) >= idx;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center gap-1.5 relative">
                {/* Horizontal progress lines */}
                {idx > 0 && (
                  <div className="absolute right-[110%] top-1/2 -translate-y-1/2 w-8 h-[2px] bg-rose-100">
                    <div
                      className="h-full bg-rose-400 transition-all duration-500"
                      style={{ width: getStepIndex(currentStep) >= idx ? '100%' : '0%' }}
                    />
                  </div>
                )}

                <button
                  disabled={!isCompleted}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 relative ${
                    isActive
                      ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-200 border-2 border-rose-400'
                      : isCompleted
                      ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                      : 'bg-rose-50/50 text-rose-300'
                  }`}
                >
                  {step.icon}
                </button>
                <span
                  className={`hidden sm:inline text-xs font-bold transition-all duration-300 ${
                    isActive ? 'text-rose-900' : 'text-rose-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Orchestrator Screen Container */}
      <div className="relative z-10 pt-20 sm:pt-24">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.div
              key="intro-screen"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <IntroScreen config={config} onComplete={() => setCurrentStep('memories')} />
            </motion.div>
          )}

          {currentStep === 'memories' && (
            <motion.div
              key="memories-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <MemoryLane config={config} onNext={() => setCurrentStep('games')} />
            </motion.div>
          )}

          {currentStep === 'games' && (
            <motion.div
              key="games-screen"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <LoveGames config={config} onComplete={() => setCurrentStep('proposal')} />
            </motion.div>
          )}

          {currentStep === 'proposal' && (
            <motion.div
              key="proposal-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProposalScreen config={config} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
