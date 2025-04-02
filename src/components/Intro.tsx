
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroProps {
  onIntroComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onIntroComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onIntroComplete();
    }, 8000); // 8 seconds intro

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.25; // 100% / 8 seconds ≈ 12.5% per second, so 1.25% per 100ms
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onIntroComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-blue-700 to-purple-800 z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 360 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <svg className="w-32 h-32 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      
      <motion.h1 
        className="text-5xl font-extrabold text-white mb-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        مسابقات المعرفة
      </motion.h1>
      
      <motion.p 
        className="text-xl text-white mb-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        تنافس، تعلم، استمتع
      </motion.p>
      
      <motion.div 
        className="w-64 h-2 bg-white/30 rounded-full overflow-hidden"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "16rem", opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div 
          className="h-full bg-white rounded-full"
          style={{ width: `${progress}%` }}
        />
      </motion.div>
    </div>
  );
};

export default Intro;
