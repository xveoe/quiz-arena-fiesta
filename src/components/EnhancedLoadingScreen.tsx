
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

const aiMessages = [
  "جاري تحليل الموضوع...",
  "يتم استخراج المعلومات ذات الصلة...",
  "جاري إنشاء أسئلة تحدي...",
  "التحقق من دقة المعلومات...",
  "تنظيم الأسئلة حسب مستوى الصعوبة..."
];

interface EnhancedLoadingScreenProps {
  onComplete?: () => void;
  simulateLoading?: boolean;
  duration?: number;
}

const EnhancedLoadingScreen: React.FC<EnhancedLoadingScreenProps> = ({ 
  onComplete,
  simulateLoading = true,
  duration = 15000 // Default 15 seconds, can be adjusted
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % aiMessages.length);
    }, 2500);
    
    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    if (!simulateLoading) return;
    
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    
    const progressInterval = setInterval(() => {
      currentProgress += increment;
      
      // Add some randomness to the progress
      const randomFactor = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
      const newProgress = Math.min(currentProgress + randomFactor, 100);
      
      setProgress(newProgress);
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setLoadingComplete(true);
        
        // Only call onComplete if it's provided
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      }
    }, interval);
    
    return () => clearInterval(progressInterval);
  }, [onComplete, simulateLoading, duration]);

  // Enhanced visual effects for the brain icon
  const brainEffects = {
    glow: {
      animate: { 
        boxShadow: [
          "0 0 15px rgba(59, 130, 246, 0.3)",
          "0 0 30px rgba(59, 130, 246, 0.5)",
          "0 0 15px rgba(59, 130, 246, 0.3)"
        ],
        scale: [1, 1.05, 1]
      },
      transition: { 
        duration: 2, 
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    pulse: {
      animate: { opacity: [0.7, 1, 0.7] },
      transition: { duration: 1.5, repeat: Infinity }
    },
    orbit: {
      fast: {
        animate: { rotate: 360 },
        transition: { duration: 15, repeat: Infinity, ease: "linear" }
      },
      slow: {
        animate: { rotate: -360 },
        transition: { duration: 20, repeat: Infinity, ease: "linear" }
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-40 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: Math.random() * 30 + 5,
              height: Math.random() * 30 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1.2, 1],
              opacity: [0, 0.5, 0.3, 0]
            }}
            transition={{ 
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      <div className="w-full max-w-xs px-6 text-center">
        {/* Brain Logo Animation - Enhanced */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Glowing background */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.9, 0.7] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse" as const
              }}
            />
            
            {/* Multiple rotating orbits for enhanced brain effect */}
            <motion.div
              className="absolute inset-0"
              {...brainEffects.orbit.fast}
            >
              <div className="w-full h-full rounded-full border border-dashed border-blue-400/50" />
            </motion.div>
            
            <motion.div
              className="absolute inset-0"
              {...brainEffects.orbit.slow}
            >
              <div className="w-full h-full rounded-full border-2 border-dotted border-indigo-400/30" />
            </motion.div>
            
            {/* Main brain icon */}
            <motion.div
              className="relative z-10 w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-700 shadow-2xl"
              {...brainEffects.glow}
            >
              <Brain className="w-14 h-14 text-blue-400/90 z-20" />
              
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                {...brainEffects.pulse}
              >
                <Sparkles className="w-8 h-8 text-indigo-300/70" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">جارٍ توليد الأسئلة...</h2>
          
          <motion.div 
            className="h-12 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.p 
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center text-base text-gray-300 opacity-80"
              >
                {aiMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          
          <div className="w-full mt-8 relative">
            {/* Base progress bar */}
            <div className="h-2 w-full rounded-full bg-gray-700/40"></div>
            
            {/* Animated progress */}
            <motion.div 
              style={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
            >
              <motion.div 
                className="absolute inset-0 rounded-full opacity-70 bg-blue-400 blur-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
          
          <div className="mt-4 text-xs text-gray-400 opacity-60">
            أسئلة فريدة بلغة عربية فصحى بفضل الذكاء الاصطناعي
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoadingScreen;
