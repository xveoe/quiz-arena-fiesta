
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Brain, Gavel, X } from 'lucide-react';
import TeamScore from './TeamScore';

interface Team {
  name: string;
  players: string[];
  score: number;
  jokers: number;
  streak: number;
  bonusPoints: number;
}

interface TeamsViewProps {
  teams: [Team, Team];
  currentTeam: number;
  gameFeatures: {
    streakBonus: boolean;
    timeBonus: boolean;
    confettiEffects: boolean;
    judgeFunctionality: boolean;
    powerUps: boolean;
  };
  showAnswer: boolean;
  changeTransitionType: () => void;
  setGameView: (view: 'teams' | 'question' | 'judge') => void;
  endGame: () => void;
}

const TeamsView: React.FC<TeamsViewProps> = ({ 
  teams, 
  currentTeam, 
  gameFeatures, 
  showAnswer, 
  changeTransitionType, 
  setGameView, 
  endGame 
}) => {
  return (
    <div className="space-y-4">
      <TeamScore teams={teams} currentTeam={currentTeam} gameFeatures={gameFeatures} />

      <div className="flex flex-col space-y-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button 
            onClick={() => {
              changeTransitionType();
              setGameView('question');
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-900/20"
          >
            <Brain className="w-4 h-4 ml-2" /> عرض السؤال
          </Button>
        </motion.div>
        
        {showAnswer && gameFeatures.judgeFunctionality && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button 
              onClick={() => {
                changeTransitionType();
                setGameView('judge');
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-900/20"
            >
              <Gavel className="w-4 h-4 ml-2" /> تدخل الحكم
            </Button>
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Button 
            onClick={endGame}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-md shadow-red-900/20"
          >
            <X className="w-4 h-4 ml-2" /> إنهاء اللعبة
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamsView;
