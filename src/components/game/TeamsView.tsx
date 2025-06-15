
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
  const handleShowQuestion = () => {
    changeTransitionType();
    setGameView('question');
  };
  
  const handleShowJudge = () => {
    changeTransitionType();
    setGameView('judge');
  };
  
  const handleEndGame = () => {
    endGame();
  };
  
  return (
    <motion.div 
      className="space-y-6 flex flex-col h-full justify-between w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-5">
        <Card className="luxury-card overflow-hidden p-6">
          <TeamScore teams={teams} currentTeam={currentTeam} gameFeatures={gameFeatures} />
        </Card>

        <div className="flex flex-col space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-full"
          >
            <button 
              onClick={handleShowQuestion}
              className="w-full luxury-button flex items-center justify-center gap-3 py-4 text-lg font-semibold"
            >
              <Brain className="w-5 h-5" /> عرض السؤال
            </button>
          </motion.div>
          
          {showAnswer && gameFeatures.judgeFunctionality && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-full"
            >
              <button 
                onClick={handleShowJudge}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:via-amber-700 hover:to-orange-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border border-white/20 flex items-center justify-center gap-3 text-lg"
              >
                <Gavel className="w-5 h-5" /> تدخل الحكم
              </button>
            </motion.div>
          )}
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="w-full mt-auto pt-4"
      >
        <button 
          onClick={handleEndGame}
          className="w-full bg-white/60 backdrop-blur-lg hover:bg-white/80 text-gray-700 border border-white/40 font-semibold px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
        >
          <X className="w-5 h-5" /> إنهاء اللعبة
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TeamsView;
