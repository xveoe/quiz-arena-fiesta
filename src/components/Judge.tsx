
import React from 'react';
import { Gavel, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface JudgeProps {
  name: string;
  onApproveAnswer: () => void;
  onRejectAnswer: () => void;
  onNextQuestion: () => void;
  isDisabled: boolean;
  showAnswer: boolean;
}

const Judge: React.FC<JudgeProps> = ({ 
  name, 
  onApproveAnswer, 
  onRejectAnswer, 
  onNextQuestion, 
  isDisabled, 
  showAnswer 
}) => {
  const handleApprove = () => {
    toast.success("تم تصحيح الإجابة! 🎉", {
      position: "top-center",
    });
    onApproveAnswer();
  };

  const handleReject = () => {
    toast.error("تم رفض الإجابة! ❌", {
      position: "top-center",
    });
    onRejectAnswer();
  };

  return (
    <motion.div 
      className="luxury-card p-3 rounded-lg border border-zinc-800 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Gavel className="w-4 h-4 text-zinc-400" />
        <h3 className="text-lg font-bold text-silver animate-silver-shine">الحكم: {name}</h3>
        <Gavel className="w-4 h-4 text-zinc-400" />
      </div>
      
      <div className="text-xs text-zinc-400 mb-2 text-center">
        يحكم على إجابات اللاعبين ويمكنه منح النقاط أو رفضها
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button
          onClick={handleApprove}
          disabled={isDisabled}
          className={`
            flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-center text-sm
            ${isDisabled ? 'bg-zinc-800 text-zinc-600' : 'bg-gradient-to-r from-green-900 to-green-800 text-green-300 hover:from-green-800 hover:to-green-700'}
            transition-all duration-200 relative overflow-hidden
          `}
        >
          {!isDisabled && (
            <motion.div 
              className="absolute inset-0 bg-white/5"
              animate={{ 
                x: ["100%", "-100%"],
              }}
              transition={{ 
                repeat: Infinity,
                repeatType: "loop",
                duration: 1,
                ease: "linear"
              }}
            />
          )}
          <ThumbsUp className="w-3 h-3" />
          تصحيح
        </button>
        
        <button
          onClick={handleReject}
          disabled={isDisabled}
          className={`
            flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-center text-sm
            ${isDisabled ? 'bg-zinc-800 text-zinc-600' : 'bg-gradient-to-r from-red-900 to-red-800 text-red-300 hover:from-red-800 hover:to-red-700'}
            transition-all duration-200 relative overflow-hidden
          `}
        >
          {!isDisabled && (
            <motion.div 
              className="absolute inset-0 bg-white/5"
              animate={{ 
                x: ["100%", "-100%"],
              }}
              transition={{ 
                repeat: Infinity,
                repeatType: "loop",
                duration: 1,
                ease: "linear"
              }}
            />
          )}
          <ThumbsDown className="w-3 h-3" />
          خطأ
        </button>
      </div>

      {showAnswer && (
        <motion.button
          onClick={onNextQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-center text-sm bg-gradient-to-r from-blue-900 to-blue-800 text-blue-300 hover:from-blue-800 hover:to-blue-700 transition-all duration-200 relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-white/5"
            animate={{ 
              x: ["100%", "-100%"],
            }}
            transition={{ 
              repeat: Infinity,
              repeatType: "loop",
              duration: 1.5,
              ease: "linear"
            }}
          />
          <ArrowRight className="w-3 h-3" />
          السؤال التالي
        </motion.button>
      )}
    </motion.div>
  );
};

export default Judge;
