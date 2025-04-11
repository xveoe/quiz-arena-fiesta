
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
    }, 5000); // 5 seconds intro (shortened from 8)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // 100% / 5 seconds = 20% per second, so 2% per 100ms
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onIntroComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 z-50">
      <motion.h1 
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        تحدي المعرفة
      </motion.h1>
      
      <motion.p 
        className="text-xl text-gray-300 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        تنافس، تعلم، استمتع
      </motion.p>
      
      <motion.div 
        className="w-64 h-3 bg-gray-800 rounded-full overflow-hidden"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "16rem", opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </motion.div>

      <motion.div 
        className="mt-4 text-gray-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        جاري التحميل...
      </motion.div>
    </div>
  );
};

export default Intro;
