
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, RefreshCw } from 'lucide-react';

interface Team {
  name: string;
  players: string[];
  score: number;
  jokers: number;
  streak: number;
  bonusPoints: number;
}

interface ResultsViewProps {
  teams: [Team, Team];
  losingTeamIndex: number | null;
  showPunishment: () => void;
  resetGame: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  teams,
  losingTeamIndex,
  showPunishment,
  resetGame
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 p-4"
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-3">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">نتائج المسابقة</h2>
          <p className="text-gray-400">انتهت المباراة! إليكم النتائج النهائية</p>
        </motion.div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {teams.map((team, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
            >
              <Card className={`p-4 transition-all duration-300 ${
                teams[0].score !== teams[1].score 
                ? (teams[0].score > teams[1].score ? index === 0 : index === 1) 
                  ? 'bg-gradient-to-b from-amber-900/30 to-amber-800/30 border-amber-700/50 shadow-lg shadow-amber-900/20' 
                  : 'bg-gradient-to-b from-gray-800/90 to-gray-900/95 border-gray-700/50'
                : 'bg-gradient-to-b from-blue-900/30 to-blue-800/30 border-blue-700/50 shadow-lg shadow-blue-900/20'
              }`}>
                <h3 className="font-bold text-base mb-2">{team.name}</h3>
                <div className="text-3xl font-bold mb-2">{team.score}</div>
                {teams[0].score !== teams[1].score && (
                  (teams[0].score > teams[1].score ? index === 0 : index === 1) ? (
                    <div className="text-amber-500 text-sm flex items-center justify-center">
                      <Trophy className="w-4 h-4 mr-1" /> الفائز
                    </div>
                  ) : (
                    <div className="text-red-500 text-sm">الخاسر</div>
                  )
                )}
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col gap-3">
          {losingTeamIndex !== null && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button 
                onClick={showPunishment}
                className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-900/30"
              >
                <Award className="w-4 h-4 ml-2" />
                عرض عقاب الفريق الخاسر
              </Button>
            </motion.div>
          )}
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button 
              onClick={resetGame}
              className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-900/30"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              بدء لعبة جديدة
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsView;
