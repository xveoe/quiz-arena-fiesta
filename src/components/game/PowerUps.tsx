
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
      className="grid grid-cols-4 gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant={powerUpsAvailable.extraTime[currentTeam] > 0 ? "outline" : "ghost"}
          disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
          onClick={() => usePowerUp('extraTime')}
          className="flex flex-col items-center py-2 h-auto w-full border border-blue-200 text-xs rounded-xl bg-blue-500 text-white hover:bg-blue-600"
          size="sm"
        >
          <Timer className="h-3.5 w-3.5 mb-1" />
          <span>وقت إضافي</span>
          <span className="text-[10px] mt-0.5 text-blue-100">({powerUpsAvailable.extraTime[currentTeam]})</span>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant={powerUpsAvailable.doublePoints[currentTeam] > 0 ? "outline" : "ghost"}
          disabled={powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer}
          onClick={() => usePowerUp('doublePoints')}
          className="flex flex-col items-center py-2 h-auto w-full border border-blue-200 text-xs rounded-xl bg-blue-500 text-white hover:bg-blue-600"
          size="sm"
        >
          <Star className="h-3.5 w-3.5 mb-1" />
          <span>نقاط مضاعفة</span>
          <span className="text-[10px] mt-0.5 text-blue-100">({powerUpsAvailable.doublePoints[currentTeam]})</span>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant={powerUpsAvailable.skipQuestion[currentTeam] > 0 ? "outline" : "ghost"}
          disabled={powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer}
          onClick={() => usePowerUp('skipQuestion')}
          className="flex flex-col items-center py-2 h-auto w-full border border-blue-200 text-xs rounded-xl bg-blue-500 text-white hover:bg-blue-600"
          size="sm"
        >
          <Award className="h-3.5 w-3.5 mb-1" />
          <span>تخطي السؤال</span>
          <span className="text-[10px] mt-0.5 text-blue-100">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button 
          onClick={useJoker} 
          disabled={teamJokers <= 0 || excludedOptions.length > 0 || showAnswer}
          className="flex flex-col items-center py-2 h-auto w-full text-xs border border-blue-200 bg-blue-500 text-white hover:bg-blue-600 rounded-xl"
          size="sm"
        >
          <Zap className="h-3.5 w-3.5 mb-1" />
          <span>جوكر</span>
          <span className="text-[10px] mt-0.5 text-blue-100">({teamJokers})</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PowerUps;
