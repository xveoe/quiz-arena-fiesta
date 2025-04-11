
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
    return <div className="text-center text-red-500">لم يتم العثور على أسئلة</div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => {
            changeTransitionType();
            setGameView('teams');
          }} 
          className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4 ml-1" /> العودة
        </button>
        
        <div className="text-center">
          <span className="text-xs text-gray-400">دور</span>
          <h3 className="text-sm font-bold text-blue-400">{teams[currentTeam].name}</h3>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">سؤال</span>
          <span className="text-sm font-bold">{currentQuestionIndex + 1}/{questions.length}</span>
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
        <button 
          onClick={refreshCurrentQuestion} 
          disabled={isRefreshingQuestion || showAnswer}
          className="text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-600 flex items-center transition-colors"
        >
          <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshingQuestion ? 'animate-spin' : ''}`} />
          تبديل
        </button>
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
      
      <Card className="p-3 bg-gradient-to-b from-gray-800/90 to-gray-900/95 border border-gray-700/50 shadow-lg">
        <h4 className="text-base font-bold mb-3 text-center text-gray-100">
          {currentQuestion.question}
        </h4>
        
        <div className="grid grid-cols-1 gap-2">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showAnswer || excludedOptions.includes(index)}
              className={`
                justify-start text-right py-3 transition-all
                ${excludedOptions.includes(index) ? 'opacity-30 bg-gray-900' : ''}
                ${showAnswer && option === currentQuestion.correctAnswer 
                  ? 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white border-green-600 shadow-md shadow-green-900/30' 
                  : showAnswer && !excludedOptions.includes(index)
                  ? 'bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white border-red-700 shadow-md shadow-red-900/30'
                  : 'bg-gradient-to-r from-gray-700/90 to-gray-800/90 border-gray-600/60 hover:from-gray-600/90 hover:to-gray-700/90'}
              `}
            >
              <span className="flex-1">{option}</span>
              {showAnswer && option === currentQuestion.correctAnswer && (
                <span className="text-green-300">✓</span>
              )}
            </Button>
          ))}
        </div>
      </Card>
      
      {showAnswer && (
        <div className="flex justify-center">
          <Button 
            onClick={nextQuestion}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600 shadow-md shadow-indigo-900/30"
          >
            {currentQuestionIndex >= questions.length - 1 ? (
              <>انتهت الأسئلة - عرض النتائج</>
            ) : (
              <>السؤال التالي <ChevronLeft className="mr-1 w-4 h-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionView;
