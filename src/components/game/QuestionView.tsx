
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, RefreshCw, TimerReset, ShieldAlert } from 'lucide-react';
import PowerUps from './PowerUps';
import QuestionTimer from './Timer';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Team {
  name: string;
  players: string[];
  score: number;
  jokers: number;
  streak: number;
  bonusPoints: number;
}

interface QuestionViewProps {
  questions: Question[];
  currentQuestionIndex: number;
  teams: [Team, Team];
  currentTeam: number;
  timer: number;
  timerActive: boolean;
  showAnswer: boolean;
  excludedOptions: number[];
  isRefreshingQuestion: boolean;
  gameSetup: {
    timePerQuestion: number;
  };
  gameFeatures: {
    timeBonus: boolean;
    powerUps: boolean;
  };
  powerUpsAvailable: {
    extraTime: [number, number];
    doublePoints: [number, number];
    skipQuestion: [number, number];
  };
  handleAnswerSelect: (option: string) => void;
  handleStartTimer: () => void;
  refreshCurrentQuestion: () => void;
  nextQuestion: () => void;
  usePowerUp: (powerUp: 'extraTime' | 'doublePoints' | 'skipQuestion') => void;
  useJoker: () => void;
  calculateTimeBonus: () => number;
  changeTransitionType: () => void;
  setGameView: (view: 'teams' | 'question' | 'judge') => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  questions,
  currentQuestionIndex,
  teams,
  currentTeam,
  timer,
  timerActive,
  showAnswer,
  excludedOptions,
  isRefreshingQuestion,
  gameSetup,
  gameFeatures,
  powerUpsAvailable,
  handleAnswerSelect,
  handleStartTimer,
  refreshCurrentQuestion,
  nextQuestion,
  usePowerUp,
  useJoker,
  calculateTimeBonus,
  changeTransitionType,
  setGameView
}) => {
  if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
    return <div className="text-center text-red-400">لم يتم العثور على أسئلة</div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => {
            changeTransitionType();
            setGameView('teams');
          }} 
          className="flex items-center text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4 ml-1" /> العودة
        </button>
        
        <div className="text-center px-4 py-1.5 bg-indigo-900/50 rounded-full border border-indigo-700/30">
          <span className="text-xs text-indigo-300 ml-1">دور</span>
          <span className="text-sm font-bold text-indigo-200">{teams[currentTeam].name}</span>
        </div>
        
        <div className="flex items-center gap-1 px-3 py-1 bg-gray-800/50 rounded-full">
          <span className="text-xs text-gray-300">سؤال</span>
          <span className="text-sm font-bold text-gray-200">{currentQuestionIndex + 1}/{questions.length}</span>
        </div>
      </div>
      
      <QuestionTimer 
        timer={timer}
        timerActive={timerActive}
        showAnswer={showAnswer}
        timePerQuestion={gameSetup.timePerQuestion}
        calculateTimeBonus={calculateTimeBonus}
        handleStartTimer={handleStartTimer}
        gameFeatures={gameFeatures}
      />
      
      <div className="flex justify-between items-center">
        <motion.button 
          onClick={refreshCurrentQuestion} 
          disabled={isRefreshingQuestion || showAnswer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            px-3 py-1.5 rounded-lg flex items-center gap-1.5 
            ${isRefreshingQuestion || showAnswer 
              ? 'bg-gray-700/40 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white hover:from-purple-500/80 hover:to-indigo-500/80 shadow-md'}
            transition-all duration-200
          `}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingQuestion ? 'animate-spin' : ''}`} />
          <span className="text-xs font-medium">تبديل السؤال</span>
        </motion.button>
      </div>
      
      <PowerUps 
        powerUpsAvailable={powerUpsAvailable}
        currentTeam={currentTeam}
        showAnswer={showAnswer}
        teamJokers={teams[currentTeam].jokers}
        excludedOptions={excludedOptions}
        usePowerUp={usePowerUp}
        useJoker={useJoker}
        gameFeatures={gameFeatures}
      />
      
      <Card className="p-4 bg-gradient-to-b from-gray-800/90 to-gray-900/95 border border-indigo-700/30 shadow-xl shadow-indigo-900/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-purple-600/5 z-0 pointer-events-none"></div>
        
        <motion.h4 
          className="text-base font-bold mb-4 text-center text-gray-100 relative z-10"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion.question}
        </motion.h4>
        
        <div className="grid grid-cols-1 gap-2 relative z-10">
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswer || excludedOptions.includes(index)}
                className={`
                  w-full justify-start text-right py-3 transition-all
                  ${excludedOptions.includes(index) ? 'opacity-30 bg-gray-900' : ''}
                  ${showAnswer && option === currentQuestion.correctAnswer 
                    ? 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white border-green-600 shadow-lg shadow-green-900/30' 
                    : showAnswer && !excludedOptions.includes(index)
                    ? 'bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white border-red-700 shadow-lg shadow-red-900/30'
                    : 'bg-gradient-to-r from-gray-700/90 to-gray-800/90 border-indigo-500/20 hover:from-indigo-700/40 hover:to-indigo-800/40 text-gray-200'}
                `}
              >
                <span className="flex-1">{option}</span>
                {showAnswer && option === currentQuestion.correctAnswer && (
                  <span className="text-green-300">✓</span>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
      
      {showAnswer && (
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button 
            onClick={nextQuestion}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-900/30"
          >
            {currentQuestionIndex >= questions.length - 1 ? (
              <>انتهت الأسئلة - عرض النتائج</>
            ) : (
              <>السؤال التالي <ChevronLeft className="mr-1 w-4 h-4" /></>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default QuestionView;
