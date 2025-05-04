
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Brain, Gavel, X } from 'lucide-react';
import TeamScore from './TeamScore';
import { Card } from "@/components/ui/card";

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
    <motion.div 
      className="space-y-6 flex flex-col min-h-[70vh] justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-5">
        <Card className="bg-white shadow-md border-gray-100 overflow-hidden">
          <TeamScore teams={teams} currentTeam={currentTeam} gameFeatures={gameFeatures} />
        </Card>

        <div className="flex flex-col space-y-3">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-full"
          >
            <Button 
              onClick={() => {
                changeTransitionType();
                setGameView('question');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl transition-all duration-300"
            >
              <Brain className="w-4 h-4 ml-2" /> عرض السؤال
            </Button>
          </motion.div>
          
          {showAnswer && gameFeatures.judgeFunctionality && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-full"
            >
              <Button 
                onClick={() => {
                  changeTransitionType();
                  setGameView('judge');
                }}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white shadow-sm rounded-xl transition-all duration-300"
              >
                <Gavel className="w-4 h-4 ml-2" /> تدخل الحكم
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mt-auto pt-8"
      >
        <Button 
          onClick={endGame}
          variant="outline"
          className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl transition-all duration-300"
        >
          <X className="w-4 h-4 ml-2" /> إنهاء اللعبة
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default TeamsView;
