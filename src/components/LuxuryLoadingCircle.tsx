
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Star } from 'lucide-react';

const aiMessages = [
  "جاري تحليل الموضوع بذكاء اصطناعي...",
  "استخراج المعلومات المتقدمة...",
  "إنشاء أسئلة تحدي مخصصة...",
  "التحقق من دقة المحتوى...",
  "تنظيم الأسئلة والصعوبة..."
];

interface LuxuryLoadingCircleProps {
  onComplete?: () => void;
  duration?: number;
}

const LuxuryLoadingCircle: React.FC<LuxuryLoadingCircleProps> = ({ 
  onComplete,
  duration = 4000
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % aiMessages.length);
    }, 800);
    
    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    
    const progressInterval = setInterval(() => {
      currentProgress += increment;
      const randomFactor = Math.random() * 2 - 1;
      const newProgress = Math.min(currentProgress + randomFactor, 100);
      
      setProgress(newProgress);
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      }
    }, interval);
    
    return () => clearInterval(progressInterval);
  }, [onComplete, duration]);

  return (
    <div className="luxury-loading-container">
      {/* Main loading circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          className="luxury-outer-ring"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="luxury-ring-gradient"></div>
        </motion.div>

        {/* Progress ring */}
        <svg className="luxury-progress-ring" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={283}
            strokeDashoffset={283 - (283 * progress) / 100}
            transform="rotate(-90 60 60)"
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3A29FF" />
              <stop offset="50%" stopColor="#FF94B4" />
              <stop offset="100%" stopColor="#FF3232" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center icon */}
        <motion.div
          className="luxury-center-icon"
          animate={{ 
            rotate: [0, 360],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="icon-container">
            <Sparkles className="luxury-icon primary" />
            <Zap className="luxury-icon secondary" />
            <Star className="luxury-icon tertiary" />
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="luxury-particle"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
            animate={{
              rotate: [0, 360],
              x: [0, Math.cos(i * 45 * Math.PI / 180) * 80],
              y: [0, Math.sin(i * 45 * Math.PI / 180) * 80],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Progress text */}
      <motion.div 
        className="luxury-progress-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="luxury-title">الذكاء الاصطناعي يعمل</h3>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={messageIndex}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="luxury-message"
          >
            {aiMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
        
        <div className="luxury-progress-bar">
          <motion.div 
            className="luxury-progress-fill"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <span className="luxury-percentage">{Math.round(progress)}%</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LuxuryLoadingCircle;
