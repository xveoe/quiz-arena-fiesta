
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timer: number;
  timerActive: boolean;
  showAnswer: boolean;
  timePerQuestion: number;
  calculateTimeBonus: () => number;
  handleStartTimer: () => void;
  gameFeatures: {
    timeBonus: boolean;
  };
}

const Timer: React.FC<TimerProps> = ({
  timer,
  timerActive,
  showAnswer,
  timePerQuestion,
  calculateTimeBonus,
  handleStartTimer,
  gameFeatures
}) => {
  return (
    <div className="relative">
      <div className={`absolute top-0 right-0 w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden`}>
        <motion.div 
          className={`h-full bg-gradient-to-r from-green-500 to-blue-500`}
          animate={{ width: `${timerActive ? 0 : (timer / timePerQuestion) * 100}%` }}
          initial={{ width: `${(timer / timePerQuestion) * 100}%` }}
          transition={{ 
            duration: timerActive ? timePerQuestion : 0, 
            ease: "linear" 
          }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2.5">
        <div className="text-xs invisible">Placeholder</div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className={`text-lg font-bold ${timer <= 10 ? 'text-red-500' : timer <= 20 ? 'text-yellow-500' : 'text-green-500'}`}>
              {timer}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleStartTimer}
              disabled={timerActive || showAnswer}
              className="py-0 h-6 text-xs border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
            >
              <TimerIcon className="w-3 h-3 ml-1" />
              ابدأ
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {!timerActive && !showAnswer ? 'اضغط على ابدأ للعد التنازلي' : ''}
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          {!showAnswer && gameFeatures.timeBonus && (
            <span>+{calculateTimeBonus()} نقطة إضافية</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
