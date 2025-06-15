
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
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-200/50 mb-6 border-4 border-white/50 backdrop-blur-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gradient mb-3">نتائج المسابقة</h2>
          <p className="text-gray-600 text-lg">انتهت المباراة! إليكم النتائج النهائية</p>
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
              <Card className={`p-6 transition-all duration-300 hover-scale luxury-card ${
                teams[0].score !== teams[1].score 
                ? (teams[0].score > teams[1].score ? index === 0 : index === 1) 
                  ? 'bg-gradient-to-b from-amber-50/80 to-amber-100/60 border-amber-300/50 shadow-2xl' 
                  : 'bg-white/50 border-gray-200/50'
                : 'bg-gradient-to-b from-blue-50/80 to-blue-100/60 border-blue-300/50'
              }`}>
                <h3 className="font-bold text-lg mb-3 text-gray-800">{team.name}</h3>
                <div className="text-4xl font-bold mb-3 text-gradient">{team.score}</div>
                {teams[0].score !== teams[1].score && (
                  (teams[0].score > teams[1].score ? index === 0 : index === 1) ? (
                    <div className="text-amber-600 text-sm flex items-center justify-center font-semibold">
                      <Trophy className="w-4 h-4 mr-1" /> الفائز
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm font-medium">الخاسر</div>
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
              <button 
                onClick={handleShowPunishment}
                className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 hover:from-purple-600 hover:via-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border border-white/20 flex items-center justify-center gap-3 text-lg"
              >
                <Award className="w-5 h-5" />
                عرض خيارات العقاب للفريق الخاسر
              </button>
            </motion.div>
          )}
          
          {showPunishmentOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="luxury-card p-6 mb-4 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">اختر طريقة تحديد العقاب:</h3>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={handleChoosePunishment}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Users className="w-4 h-4" />
                  عقاب من قائمة العقوبات
                </button>
                <button 
                  onClick={handleAllowWinnerChoose}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-4 h-4" />
                  الفريق الفائز يختار العقاب
                </button>
              </div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <button 
              onClick={handleResetGame}
              className="w-full luxury-button flex items-center justify-center gap-3 py-4 text-lg font-semibold"
            >
              <RefreshCw className="w-5 h-5" />
              بدء لعبة جديدة
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsView;
