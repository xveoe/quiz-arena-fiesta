
import React from 'react';
import { motion } from 'framer-motion';
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
        <div className="mesomorphic-card">
          <TeamScore teams={teams} currentTeam={currentTeam} gameFeatures={gameFeatures} />
        </div>

        <div className="flex flex-col space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-full"
          >
            <button 
              onClick={handleShowQuestion}
              className="w-full luxury-btn-primary flex items-center justify-center gap-3 py-4 text-lg font-semibold"
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
                className="w-full liquid-btn flex items-center justify-center gap-3 py-4 text-lg font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #FF94B4 0%, #FF3232 100%)'
                }}
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
          className="w-full luxury-btn-secondary flex items-center justify-center gap-3 py-4 text-lg font-semibold"
        >
          <X className="w-5 h-5" /> إنهاء اللعبة
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TeamsView;
