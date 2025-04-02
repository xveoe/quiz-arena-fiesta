
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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 to-blue-600 z-50">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 50 + 10,
              height: Math.random() * 50 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1.2, 1],
              opacity: [0, 0.7, 0.5, 0]
            }}
            transition={{ 
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 mb-8"
      >
        <div className="relative">
          <svg className="w-32 h-32 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              initial={{ pathLength: 0, fill: "rgba(255,255,255,0)" }}
              animate={{ pathLength: 1, fill: "rgba(255,255,255,1)" }}
              transition={{ duration: 2, fill: { delay: 2, duration: 1 } }}
            />
          </svg>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <motion.div 
              className="w-6 h-6 rounded-full bg-blue-300"
              animate={{ 
                boxShadow: ["0 0 0px rgba(191, 219, 254, 0.8)", "0 0 20px rgba(191, 219, 254, 0.8)", "0 0 0px rgba(191, 219, 254, 0.8)"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-5xl font-extrabold text-white mb-4 text-center relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        مسابقات المعرفة
      </motion.h1>
      
      <motion.p 
        className="text-xl text-white/90 mb-8 relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        تنافس، تعلم، استمتع
      </motion.p>
      
      <motion.div 
        className="w-64 h-3 bg-white/20 rounded-full overflow-hidden relative z-10"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "16rem", opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </motion.div>

      <motion.div 
        className="mt-4 text-white/70 text-sm relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        جاري التحميل...
      </motion.div>
    </div>
  );
};

export default Intro;
