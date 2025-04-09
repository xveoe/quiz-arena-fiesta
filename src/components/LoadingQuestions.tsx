
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, BrainCircuit, Sparkles, Lightbulb, Zap, Star, Database } from 'lucide-react';

const aiMessages = [
  "جاري تحليل الموضوع...",
  "يتم استخراج المعلومات ذات الصلة...",
  "جاري إنشاء أسئلة تحدي...",
  "التحقق من دقة المعلومات...",
  "تنظيم الأسئلة حسب مستوى الصعوبة..."
];

const LoadingQuestions = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % aiMessages.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-40 backdrop-blur-md theme-bg">
      <div className="w-full max-w-md px-8">
        {/* AI Logo Animation */}
        <motion.div
          className="mb-12 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Circular animated background */}
            <motion.div 
              className="absolute inset-0 rounded-full theme-glow blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.9, 0.7] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            
            {/* Rotating orbits */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full rounded-full border-2 border-dashed theme-border opacity-50" />
            </motion.div>
            
            <motion.div
              className="absolute inset-0"
              initial={{ rotate: 45 }}
              animate={{ rotate: 405 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full rounded-full border border-dotted theme-border opacity-30" />
            </motion.div>
            
            {/* Main brain icon */}
            <motion.div
              className="relative z-10 w-32 h-32 flex items-center justify-center rounded-full theme-card shadow-2xl"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 15px rgba(255, 255, 255, 0.3)",
                  "0 0 30px rgba(255, 255, 255, 0.5)",
                  "0 0 15px rgba(255, 255, 255, 0.3)"
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <BrainCircuit className="w-16 h-16 theme-icon z-20" />
              
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-10 h-10 theme-text opacity-70" />
              </motion.div>
            </motion.div>
            
            {/* Floating particles */}
            <motion.div 
              className="absolute top-0 left-0 transform -translate-x-full"
              animate={{ 
                x: [-100, 0, -100], 
                y: [0, -50, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
            >
              <Star className="w-5 h-5 theme-accent" />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-0 right-0 transform translate-x-full"
              animate={{ 
                x: [100, 0, 100], 
                y: [0, 50, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5 }}
            >
              <Database className="w-6 h-6 theme-accent" />
            </motion.div>
            
            <motion.div 
              className="absolute top-0 right-0 transform translate-x-full"
              animate={{ 
                x: [100, 0, 100], 
                y: [0, -50, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Zap className="w-5 h-5 theme-accent" />
            </motion.div>
          </div>
        </motion.div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 theme-text">الذكاء الاصطناعي يُولّد الأسئلة</h2>
          
          <motion.div 
            className="h-16 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.p 
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center text-xl theme-text opacity-80"
            >
              {aiMessages[messageIndex]}
            </motion.p>
          </motion.div>
          
          <div className="w-full mt-10 relative">
            {/* Base progress bar */}
            <div className="h-2 w-full rounded-full theme-border opacity-40"></div>
            
            {/* Animated progress */}
            <motion.div 
              initial={{ width: "5%" }}
              animate={{ width: "95%" }}
              transition={{ duration: 15, ease: "linear" }}
              className="absolute top-0 left-0 h-2 rounded-full theme-progress"
            >
              <motion.div 
                className="absolute inset-0 rounded-full opacity-70 theme-glow blur-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
          
          <div className="mt-6 text-sm theme-text opacity-60">
            أسئلة فريدة بلغة عربية فصحى بفضل الذكاء الاصطناعي
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingQuestions;
