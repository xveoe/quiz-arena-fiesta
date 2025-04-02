
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, BrainCircuit, Sparkles, Lightbulb } from 'lucide-react';

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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/90 to-indigo-900/90 dark:from-blue-900/95 dark:to-indigo-950/95 z-40 backdrop-blur-md">
      {/* AI Brain Animation */}
      <motion.div
        className="mb-8 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { repeat: Infinity, duration: 10, ease: "linear" },
            scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }}
          className="relative"
        >
          <BrainCircuit className="w-20 h-20 text-blue-400 dark:text-blue-300" />
          
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-12 h-12 text-purple-500 dark:text-purple-300" />
          </motion.div>
        </motion.div>
        
        {/* Particle effects */}
        <motion.div 
          className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
        >
          <Lightbulb className="w-6 h-6 text-amber-400" />
        </motion.div>
        
        <motion.div 
          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
        >
          <Sparkles className="w-5 h-5 text-green-400" />
        </motion.div>
      </motion.div>
      
      <h2 className="text-2xl font-bold mb-3 text-white">الذكاء الاصطناعي يعمل</h2>
      
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
          className="text-center text-lg text-blue-100 dark:text-blue-200"
        >
          {aiMessages[messageIndex]}
        </motion.p>
      </motion.div>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        className="h-1.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full mt-8 relative overflow-hidden"
      >
        <motion.div 
          className="absolute top-0 left-0 right-0 bottom-0 bg-white/30"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      
      <div className="mt-6 text-sm text-blue-200 dark:text-blue-100">
        أسئلة فريدة بفضل الذكاء الاصطناعي
      </div>
    </div>
  );
};

export default LoadingQuestions;
