import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const initialHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 18 + 8, // 8px to 26px
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 10, // 10s to 22s
    }));
    setHearts(initialHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-[-50px] text-pink-300/40 fill-current"
          style={{
            left: `${heart.x}%`,
            width: heart.size,
            height: heart.size,
          }}
          initial={{ y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{
            y: -1000,
            opacity: [0, 0.5, 0.5, 0],
            scale: [0.5, 1, 1, 0.7],
            rotate: [0, 90, 180, 270],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full fill-pink-300/30 text-pink-300/30">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
