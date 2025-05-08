
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, RefreshCw, Users, Sparkles } from 'lucide-react';

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
  const [showPunishmentOptions, setShowPunishmentOptions] = useState(false);

  const handleShowPunishment = () => {
    setShowPunishmentOptions(true);
  };

  const handleChoosePunishment = () => {
    setShowPunishmentOptions(false);
    showPunishment();
  };

  const handleAllowWinnerChoose = () => {
    setShowPunishmentOptions(false);
  };
  
  const handleResetGame = () => {
    resetGame();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8 p-4"
    >
      <div className="flex flex-col items-center justify-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-200/50 mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">نتائج المسابقة</h2>
          <p className="text-gray-500">انتهت المباراة! إليكم النتائج النهائية</p>
        </motion.div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
            >
              <Card className={`p-6 transition-all duration-300 hover-scale ${
                teams[0].score !== teams[1].score 
                ? (teams[0].score > teams[1].score ? index === 0 : index === 1) 
                  ? 'bg-gradient-to-b from-amber-50 to-amber-100/50 border-amber-200 shadow-lg' 
                  : 'bg-white border-gray-100'
                : 'bg-gradient-to-b from-blue-50 to-blue-100/50 border-blue-200'
              }`}>
                <h3 className="font-bold text-lg mb-2">{team.name}</h3>
                <div className="text-4xl font-bold mb-3 text-blue-600">{team.score}</div>
                {teams[0].score !== teams[1].score && (
                  (teams[0].score > teams[1].score ? index === 0 : index === 1) ? (
                    <div className="text-amber-500 text-sm flex items-center justify-center font-medium">
                      <Trophy className="w-4 h-4 mr-1" /> الفائز
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">الخاسر</div>
                  )
                )}
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col gap-4">
          {losingTeamIndex !== null && !showPunishmentOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button 
                onClick={handleShowPunishment}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 rounded-xl"
              >
                <Award className="w-4 h-4 ml-2" />
                عرض خيارات العقاب للفريق الخاسر
              </Button>
            </motion.div>
          )}
          
          {showPunishmentOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white p-6 rounded-2xl border border-blue-100 mb-4 shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">اختر طريقة تحديد العقاب:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={handleChoosePunishment}
                  className="py-3 bg-purple-500 hover:bg-purple-600 text-white shadow-md rounded-xl"
                >
                  <Users className="w-4 h-4 ml-2" />
                  عقاب من قائمة العقوبات
                </Button>
                <Button 
                  onClick={handleAllowWinnerChoose}
                  className="py-3 bg-amber-500 hover:bg-amber-600 text-white shadow-md rounded-xl"
                >
                  <Sparkles className="w-4 h-4 ml-2" />
                  الفريق الفائز يختار العقاب
                </Button>
              </div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button 
              onClick={handleResetGame}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-xl"
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
