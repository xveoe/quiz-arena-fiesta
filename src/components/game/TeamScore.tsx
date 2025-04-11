
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";

interface Team {
  name: string;
  players: string[];
  score: number;
  jokers: number;
  streak: number;
  bonusPoints: number;
}

interface TeamScoreProps {
  teams: [Team, Team];
  currentTeam: number;
  gameFeatures: {
    streakBonus: boolean;
    timeBonus: boolean;
    confettiEffects: boolean;
    judgeFunctionality: boolean;
    powerUps: boolean;
  };
}

const TeamScore: React.FC<TeamScoreProps> = ({ teams, currentTeam, gameFeatures }) => {
  const getStreakMultiplier = (teamIndex: number) => {
    return (gameFeatures.streakBonus && teams[teamIndex].streak >= 3) ? 1.5 : 1;
  };

  return (
    <div className="grid grid-cols-2 gap-3 text-center">
      {teams.map((team, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card 
            className={`p-2.5 bg-gradient-to-b from-gray-800/90 to-gray-900/95 border border-gray-700/50 shadow-lg 
              ${currentTeam === index ? 'ring-1 ring-inset ring-offset-1 ring-blue-400' : ''}`}
          >
            <h3 className="text-sm font-bold mb-0.5 text-gray-200">{team.name}</h3>
            <div className="text-2xl font-bold text-gray-100">
              {team.score}
              {team.bonusPoints > 0 && gameFeatures.timeBonus && (
                <span className="text-xs text-gray-300 opacity-70 ml-1">
                  (+{team.bonusPoints})
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-1 text-xs mt-0.5 text-gray-400">
              <span>سلسلة: {team.streak} {gameFeatures.streakBonus && team.streak >= 3 && '🔥'}</span>
              {gameFeatures.streakBonus && team.streak >= 3 && (
                <span className="text-yellow-400">× {getStreakMultiplier(index)}</span>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamScore;
