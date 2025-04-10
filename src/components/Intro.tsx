
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, Brain } from 'lucide-react';

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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black z-50">
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
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
      
      {/* Glowing lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0"
            style={{
              width: '100%',
              top: `${Math.random() * 100}%`,
              left: 0,
            }}
            initial={{ 
              scaleX: 0, 
              opacity: 0,
              translateX: "-50%" 
            }}
            animate={{ 
              scaleX: 1, 
              opacity: [0, 0.5, 0],
              translateX: "50%"
            }}
            transition={{ 
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        className="relative z-10 mb-8"
      >
        <div className="relative">
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center shadow-2xl"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Brain className="w-16 h-16 text-blue-400" />
            
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-indigo-300/70" />
            </motion.div>
            
            {/* Orbiting stars */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Award className="w-6 h-6 text-blue-300" />
              </div>
            </motion.div>
            
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-4 text-center relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        مسابقات المعرفة
      </motion.h1>
      
      <motion.p 
        className="text-xl text-gray-300 mb-8 relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        تنافس، تعلم، استمتع
      </motion.p>
      
      <motion.div 
        className="w-64 h-3 bg-gray-800/80 rounded-full overflow-hidden relative z-10"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "16rem", opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          style={{ width: `${progress}%` }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{
              background: [
                "linear-gradient(90deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)",
                "linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%)",
                "linear-gradient(90deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-4 text-gray-400 text-sm relative z-10"
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
