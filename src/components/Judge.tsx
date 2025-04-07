
import React from 'react';
import { Gavel, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface JudgeProps {
  name: string;
  onApproveAnswer: () => void;
  onRejectAnswer: () => void;
  isDisabled: boolean;
}

const Judge: React.FC<JudgeProps> = ({ name, onApproveAnswer, onRejectAnswer, isDisabled }) => {
  return (
    <motion.div 
      className="luxury-card p-4 rounded-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Gavel className="w-5 h-5 text-zinc-400" />
        <h3 className="text-xl font-bold text-silver">الحكم: {name}</h3>
        <Gavel className="w-5 h-5 text-zinc-400" />
      </div>
      
      <div className="text-sm text-zinc-400 mb-3 text-center">
        يحكم على إجابات اللاعبين ويمكنه منح النقاط أو رفضها
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onApproveAnswer}
          disabled={isDisabled}
          className={`
            flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-center
            ${isDisabled ? 'bg-zinc-800 text-zinc-600' : 'bg-gradient-to-r from-green-900 to-green-800 text-green-300 hover:from-green-800 hover:to-green-700'}
            transition-all duration-200
          `}
        >
          <Star className="w-4 h-4" />
          تصحيح
        </button>
        
        <button
          onClick={onRejectAnswer}
          disabled={isDisabled}
          className={`
            flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-center
            ${isDisabled ? 'bg-zinc-800 text-zinc-600' : 'bg-gradient-to-r from-red-900 to-red-800 text-red-300 hover:from-red-800 hover:to-red-700'}
            transition-all duration-200
          `}
        >
          <Star className="w-4 h-4" />
          خطأ
        </button>
      </div>
    </motion.div>
  );
};

export default Judge;
