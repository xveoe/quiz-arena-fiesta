
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LuxuryLoadingCircleProps {
  onComplete?: () => void;
  duration?: number;
}

/**
 * دائرة تحميل أنيقة: بدون حدود خلفية أو أيقونات أو بار أو نص، فقط حلقة تدور. مخصصة للموبايل.
 */
const LuxuryLoadingCircle: React.FC<LuxuryLoadingCircleProps> = ({
  onComplete,
  duration = 4000,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        if (onComplete) setTimeout(onComplete, 350);
      }
    }, interval);
    return () => clearInterval(progressInterval);
  }, [onComplete, duration]);

  return (
    <div className="luxury-loading-minimal-container" style={{
      background: 'none',
      boxShadow: 'none',
      border: 'none',
      outline: 'none',
      width: "100vw",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <motion.div
        className="luxury-outer-ring-minimal"
        animate={{
          rotate: 360,
        }}
        transition={{
          rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
        }}
        style={{
          background: "none",
          border: "none",
          boxShadow: "none",
          outline: "none",
        }}
      >
        <svg className="luxury-progress-ring-minimal" viewBox="0 0 64 64" style={{
          display: 'block',
          height: "100%",
          width: "100%",
          background: 'none'
        }}>
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="url(#loaderGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={176}
            strokeDashoffset={176 - (176 * progress) / 100}
            initial={{ strokeDashoffset: 176 }}
            animate={{
              strokeDashoffset: 176 - (176 * progress) / 100,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3A29FF" />
              <stop offset="50%" stopColor="#FF94B4" />
              <stop offset="100%" stopColor="#FF3232" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
export default LuxuryLoadingCircle;
