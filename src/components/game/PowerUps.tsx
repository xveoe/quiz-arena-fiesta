
import React from 'react';
import { Button } from "@/components/ui/button";
import { Timer, Star, Award, Zap } from 'lucide-react';

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
    <div className="grid grid-cols-4 gap-1 mb-3">
      <Button
        variant={powerUpsAvailable.extraTime[currentTeam] > 0 ? "outline" : "ghost"}
        disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
        onClick={() => usePowerUp('extraTime')}
        className="flex flex-col items-center py-1 h-auto border-gray-700/60 text-xs bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80"
        size="sm"
      >
        <Timer className="h-3 w-3 mb-0.5" />
        <span>وقت إضافي</span>
        <span className="text-[10px] mt-0.5">({powerUpsAvailable.extraTime[currentTeam]})</span>
      </Button>
      
      <Button
        variant={powerUpsAvailable.doublePoints[currentTeam] > 0 ? "outline" : "ghost"}
        disabled={powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer}
        onClick={() => usePowerUp('doublePoints')}
        className="flex flex-col items-center py-1 h-auto border-gray-700/60 text-xs bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80"
        size="sm"
      >
        <Star className="h-3 w-3 mb-0.5" />
        <span>نقاط مضاعفة</span>
        <span className="text-[10px] mt-0.5">({powerUpsAvailable.doublePoints[currentTeam]})</span>
      </Button>
      
      <Button
        variant={powerUpsAvailable.skipQuestion[currentTeam] > 0 ? "outline" : "ghost"}
        disabled={powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer}
        onClick={() => usePowerUp('skipQuestion')}
        className="flex flex-col items-center py-1 h-auto border-gray-700/60 text-xs bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80"
        size="sm"
      >
        <Award className="h-3 w-3 mb-0.5" />
        <span>تخطي السؤال</span>
        <span className="text-[10px] mt-0.5">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
      </Button>
      
      <Button 
        onClick={useJoker} 
        disabled={teamJokers <= 0 || excludedOptions.length > 0 || showAnswer || !gameFeatures.powerUps}
        className="flex flex-col items-center py-1 h-auto text-xs border-gray-700/60 bg-gradient-to-r from-blue-900/90 to-blue-800/90 hover:from-blue-800/90 hover:to-blue-700/90 text-blue-200"
        size="sm"
      >
        <Zap className="h-3 w-3 mb-0.5" />
        <span>جوكر</span>
        <span className="text-[10px] mt-0.5">({teamJokers})</span>
      </Button>
    </div>
  );
};

export default PowerUps;
