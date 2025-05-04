
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
    <div className="relative mb-6">
      <div className={`absolute top-0 right-0 w-full h-2 bg-gray-100 rounded-full overflow-hidden`}>
        <motion.div 
          className={`h-full ${timer <= 10 ? 'bg-red-500' : timer <= 20 ? 'bg-amber-500' : 'bg-green-500'}`}
          animate={{ width: `${timerActive ? 0 : (timer / timePerQuestion) * 100}%` }}
          initial={{ width: `${(timer / timePerQuestion) * 100}%` }}
          transition={{ 
            duration: timerActive ? timer : 0, 
            ease: "linear" 
          }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs invisible">Placeholder</div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className={`text-lg font-bold ${timer <= 10 ? 'text-red-500' : timer <= 20 ? 'text-amber-500' : 'text-green-500'}`}>
              {timer}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleStartTimer}
              disabled={timerActive || showAnswer}
              className="py-0 h-6 text-xs border-gray-200 bg-white hover:bg-gray-50 transition-colors rounded-lg"
            >
              <TimerIcon className="w-3 h-3 ml-1" />
              ابدأ
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {!timerActive && !showAnswer ? 'اضغط على ابدأ للعد التنازلي' : ''}
          </div>
        </div>
        
        <div className="text-xs text-blue-500 font-medium">
          {!showAnswer && gameFeatures.timeBonus && (
            <span>+{calculateTimeBonus()} نقطة إضافية</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
