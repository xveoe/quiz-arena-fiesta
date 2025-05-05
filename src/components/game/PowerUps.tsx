
import React from 'react';
import { Button } from "@/components/ui/button";
import { Timer, Star, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PowerUpsProps {
  powerUpsAvailable: {
    extraTime: [number, number];
    doublePoints: [number, number];
    skipQuestion: [number, number];
  };
  currentTeam: number;
  showAnswer: boolean;
  teamJokers: number;
  excludedOptions: number[];
  usePowerUp: (powerUp: 'extraTime' | 'doublePoints' | 'skipQuestion') => void;
  useJoker: () => void;
  gameFeatures: {
    powerUps: boolean;
  };
}

const PowerUps: React.FC<PowerUpsProps> = ({
  powerUpsAvailable,
  currentTeam,
  showAnswer,
  teamJokers,
  excludedOptions,
  usePowerUp,
  useJoker,
  gameFeatures
}) => {
  if (!gameFeatures.powerUps) {
    return null;
  }

  return (
    <motion.div 
      className="grid grid-cols-4 gap-2 mb-4 max-w-md mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant={powerUpsAvailable.extraTime[currentTeam] > 0 ? "outline" : "ghost"}
          disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
          onClick={() => usePowerUp('extraTime')}
          className="flex flex-col items-center py-1 h-auto w-full text-[10px] rounded-xl bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
          size="sm"
        >
          <Timer className="h-3 w-3 mb-0.5" />
          <span>وقت إضافي</span>
          <span className="text-[8px] mt-0.5 text-blue-100">({powerUpsAvailable.extraTime[currentTeam]})</span>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant={powerUpsAvailable.doublePoints[currentTeam] > 0 ? "outline" : "ghost"}
          disabled={powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer}
          onClick={() => usePowerUp('doublePoints')}
          className="flex flex-col items-center py-1 h-auto w-full text-[10px] rounded-xl bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
          size="sm"
        >
          <Star className="h-3 w-3 mb-0.5" />
          <span>نقاط مضاعفة</span>
          <span className="text-[8px] mt-0.5 text-blue-100">({powerUpsAvailable.doublePoints[currentTeam]})</span>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant={powerUpsAvailable.skipQuestion[currentTeam] > 0 ? "outline" : "ghost"}
          disabled={powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer}
          onClick={() => usePowerUp('skipQuestion')}
          className="flex flex-col items-center py-1 h-auto w-full text-[10px] rounded-xl bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
          size="sm"
        >
          <Award className="h-3 w-3 mb-0.5" />
          <span>تخطي السؤال</span>
          <span className="text-[8px] mt-0.5 text-blue-100">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          onClick={useJoker} 
          disabled={teamJokers <= 0 || excludedOptions.length > 0 || showAnswer}
          className="flex flex-col items-center py-1 h-auto w-full text-[10px] bg-blue-500 text-white hover:bg-blue-600 rounded-xl shadow-sm"
          size="sm"
        >
          <Zap className="h-3 w-3 mb-0.5" />
          <span>جوكر</span>
          <span className="text-[8px] mt-0.5 text-blue-100">({teamJokers})</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PowerUps;
