
import React, { useState } from 'react';
import { Gavel, ThumbsUp, ThumbsDown, MinusCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface JudgeProps {
  name: string;
  onApproveAnswer: () => void;
  onRejectAnswer: () => void;
  onDeductPoints: (points: number, teamIndex?: number) => void;
  onNextQuestion: () => void;
  isDisabled: boolean;
  showAnswer: boolean;
}

const Judge: React.FC<JudgeProps> = ({ 
  name, 
  onApproveAnswer, 
  onRejectAnswer, 
  onDeductPoints,
  onNextQuestion, 
  isDisabled, 
  showAnswer 
}) => {
  const [showDeductOptions, setShowDeductOptions] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | undefined>(undefined);
  
  const handleApprove = () => {
    onApproveAnswer();
  };

  const handleReject = () => {
    onRejectAnswer();
  };
  
  const handleDeduct = (points: number) => {
    onDeductPoints(points, selectedTeam);
    setShowDeductOptions(false);
    setSelectedTeam(undefined);
  };

  return (
    <motion.div 
      className="modern-card p-4 bg-white border border-blue-100 rounded-xl shadow-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Gavel className="w-4 h-4 text-amber-500" />
        <h3 className="text-lg font-bold text-gray-800">الحكم: {name}</h3>
        <Gavel className="w-4 h-4 text-amber-500" />
      </div>
      
      <div className="text-xs text-gray-500 mb-4 text-center">
        يحكم على إجابات اللاعبين ويمكنه منح النقاط أو رفضها أو خصم نقاط للسلوك السيئ
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={handleApprove}
          disabled={isDisabled}
          className={`
            flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-center
            ${isDisabled ? 'bg-gray-100 text-gray-400' : 'bg-green-500 text-white hover:bg-green-600'}
            transition-all duration-200 relative overflow-hidden font-medium
          `}
        >
          <ThumbsUp className="w-4 h-4" />
          تصحيح
        </button>
        
        <button
          onClick={handleReject}
          disabled={isDisabled}
          className={`
            flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-center
            ${isDisabled ? 'bg-gray-100 text-gray-400' : 'bg-red-500 text-white hover:bg-red-600'}
            transition-all duration-200 relative overflow-hidden font-medium
          `}
        >
          <ThumbsDown className="w-4 h-4" />
          خطأ
        </button>
      </div>
      
      <button
        onClick={() => setShowDeductOptions(!showDeductOptions)}
        disabled={isDisabled}
        className={`
          w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-center mb-3
          ${isDisabled ? 'bg-gray-100 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'}
          transition-all duration-200 relative overflow-hidden font-medium
        `}
      >
        <MinusCircle className="w-4 h-4" />
        خصم نقاط لسوء السلوك
      </button>
      
      {showDeductOptions && (
        <>
          <motion.div 
            className="grid grid-cols-2 gap-2 mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              onClick={() => setSelectedTeam(0)} 
              className={`bg-blue-50 border ${selectedTeam === 0 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} text-gray-700 hover:bg-blue-100 py-2 px-3 rounded-lg text-sm font-medium`}
            >
              الفريق الأول
            </button>
            <button 
              onClick={() => setSelectedTeam(1)} 
              className={`bg-blue-50 border ${selectedTeam === 1 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} text-gray-700 hover:bg-blue-100 py-2 px-3 rounded-lg text-sm font-medium`}
            >
              الفريق الثاني
            </button>
          </motion.div>
          
          {selectedTeam !== undefined && (
            <motion.div 
              className="grid grid-cols-3 gap-2 mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={() => handleDeduct(0.5)} 
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-lg text-sm font-medium"
              >
                -0.5
              </button>
              <button 
                onClick={() => handleDeduct(1)} 
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-lg text-sm font-medium"
              >
                -1
              </button>
              <button 
                onClick={() => handleDeduct(2)} 
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-lg text-sm font-medium"
              >
                -2
              </button>
            </motion.div>
          )}
        </>
      )}

      {showAnswer && (
        <motion.button
          onClick={onNextQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-center bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 font-medium"
        >
          السؤال التالي
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default Judge;
