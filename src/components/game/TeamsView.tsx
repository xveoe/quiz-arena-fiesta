
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
        <Card className="modern-card overflow-hidden p-4">
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
              onClick={handleShowQuestion}
              className="w-full py-3 modern-button hover-scale rounded-xl"
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
                onClick={handleShowJudge}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 rounded-xl transition-all duration-300"
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
        className="w-full mt-auto pt-4"
      >
        <Button 
          onClick={handleEndGame}
          variant="outline"
          className="w-full py-2 modern-button-outline hover-scale rounded-xl"
        >
          <X className="w-4 h-4 ml-2" /> إنهاء اللعبة
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default TeamsView;
