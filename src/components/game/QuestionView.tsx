
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
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
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-500 font-bold p-4 bg-white/80 rounded-xl shadow-sm">
          لم يتم العثور على أسئلة
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-1">
        <button 
          onClick={() => {
            changeTransitionType();
            setGameView('teams');
          }} 
          className="flex items-center text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4 ml-1" /> العودة
        </button>
        
        <div className="text-center px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
          <span className="text-xs text-blue-600 ml-1">دور</span>
          <span className="text-sm font-medium text-blue-700">{teams[currentTeam].name}</span>
        </div>
        
        <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
          <span className="text-xs text-blue-600">سؤال</span>
          <span className="text-sm font-medium text-blue-700">{currentQuestionIndex + 1}/{questions.length}</span>
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
      
      <div className="flex justify-between items-center mb-2">
        <motion.button 
          onClick={refreshCurrentQuestion} 
          disabled={isRefreshingQuestion || showAnswer}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`
            px-3 py-1.5 rounded-xl flex items-center gap-2 
            ${isRefreshingQuestion || showAnswer 
              ? 'bg-blue-200 text-blue-400 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'}
            transition-all duration-300
          `}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshingQuestion ? 'animate-spin' : ''}`} />
          <span className="font-medium">تبديل السؤال</span>
        </motion.button>
      </div>

      {/* Show PowerUps above the question card */}
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
      
      <Card className="modern-card p-5 border border-blue-100 shadow-sm rounded-2xl">
        <motion.h4 
          className="text-lg font-bold mb-6 text-center text-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {currentQuestion.question}
        </motion.h4>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Button
                onClick={() => handleAnswerSelect(option)}
                disabled={showAnswer || excludedOptions.includes(index)}
                className={`
                  w-full justify-start text-right py-3 px-4 transition-all rounded-xl
                  ${excludedOptions.includes(index) ? 'opacity-50 bg-gray-100 text-gray-400' : ''}
                  ${showAnswer && option === currentQuestion.correctAnswer 
                    ? 'bg-green-500 hover:bg-green-600 text-white font-medium' 
                    : showAnswer && !excludedOptions.includes(index)
                    ? 'bg-red-500 hover:bg-red-600 text-white font-medium'
                    : 'bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 hover:text-blue-700'}
                `}
              >
                <span className="flex-1 text-lg">{option}</span>
                {showAnswer && option === currentQuestion.correctAnswer && (
                  <span className="text-white text-xl">✓</span>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
      
      {showAnswer && (
        <motion.div 
          className="flex justify-center mt-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button 
            onClick={nextQuestion}
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white shadow-sm text-lg font-medium rounded-xl transition-all duration-300"
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
