
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
    <div className="grid grid-cols-2 gap-4 text-center">
      {teams.map((team, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card 
            className={`p-4 bg-white/80 border ${currentTeam === index ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-100'} rounded-xl shadow-sm transition-all duration-300`}
          >
            <h3 className="text-base font-bold mb-1 text-gray-800">{team.name}</h3>
            <div className="text-3xl font-bold text-blue-600">
              {team.score}
              {team.bonusPoints > 0 && gameFeatures.timeBonus && (
                <span className="text-xs text-gray-500 opacity-90 ml-1">
                  (+{team.bonusPoints})
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-1 text-xs mt-1 text-gray-500">
              <span>سلسلة: {team.streak} {gameFeatures.streakBonus && team.streak >= 3 && '🔥'}</span>
              {gameFeatures.streakBonus && team.streak >= 3 && (
                <span className="text-amber-500">× {getStreakMultiplier(index)}</span>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamScore;
