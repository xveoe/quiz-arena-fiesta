
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  duration = 15000 // Default 15 seconds
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
      const randomFactor = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
      const newProgress = Math.min(currentProgress + randomFactor, 100);
      
      setProgress(newProgress);
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setLoadingComplete(true);
        
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      }
    }, interval);
    
    return () => clearInterval(progressInterval);
  }, [onComplete, simulateLoading, duration]);

  return (
    <AspectRatio ratio={16/9} className="w-full max-w-3xl mx-auto flex items-center justify-center">
      <div 
        className="relative w-full max-w-md px-6 py-10 text-center bg-transparent z-10"
        style={{ 
          position: 'absolute', 
          left: '50%', 
          top: '50%', 
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Ambient particles */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-50"
              style={{
                width: Math.random() * 20 + 5,
                height: Math.random() * 20 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(2px)'
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
        
        {/* Main animation */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Main animation circle */}
            <motion.div 
              className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{ filter: 'blur(0.5px)' }}
            >
              {/* Sparkles in the center */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear" 
                }}
                style={{ filter: 'blur(0.5px)' }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
            
            {/* Orbit rings */}
            <motion.div
              className="absolute inset-[-15px] rounded-full border border-blue-100"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ filter: 'blur(0.5px)' }}
            />
            
            <motion.div
              className="absolute inset-[-30px] rounded-full border border-blue-50"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ filter: 'blur(0.5px)' }}
            />
          </div>
        </motion.div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">توليد الأسئلة جارٍ...</h2>
          
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
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center text-base text-gray-600"
              >
                {aiMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          
          <div className="w-full mt-8 relative">
            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-gray-100"></div>
            
            <motion.div 
              style={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
            >
              <motion.div 
                className="absolute inset-0 rounded-full opacity-70 bg-blue-300"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ filter: 'blur(3px)' }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </AspectRatio>
  );
};

export default EnhancedLoadingScreen;
