
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ThumbsUp, ThumbsDown } from 'lucide-react';

interface JudgeViewProps {
  gameSetup: {
    judgeName: string;
  };
  handleJudgeDecision: (isCorrect: boolean) => void;
  nextQuestion: () => void;
  currentQuestionIndex: number;
  questions: any[];
  changeTransitionType: () => void;
  setGameView: (view: 'teams' | 'question' | 'judge') => void;
}

const JudgeView: React.FC<JudgeViewProps> = ({
  gameSetup,
  handleJudgeDecision,
  nextQuestion,
  currentQuestionIndex,
  questions,
  changeTransitionType,
  setGameView
}) => {
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
        
        <h3 className="text-center text-sm font-bold text-amber-400">تدخل الحكم</h3>
        
        <div className="w-8"></div>
      </div>
      
      <Card className="p-4 bg-gradient-to-b from-gray-800/90 to-gray-900/95 border border-gray-700/50 shadow-lg">
        <div className="text-center mb-4">
          <div className="mb-2">
            <span className="text-sm text-gray-400">يمكن للحكم</span>
            <h3 className="text-lg font-bold text-amber-300">{gameSetup.judgeName}</h3>
            <span className="text-sm text-gray-400">التدخل وتغيير نتيجة الإجابة:</span>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button 
              onClick={() => handleJudgeDecision(true)}
              className="flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600 text-green-100 shadow-md shadow-green-900/30"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>تصحيح الإجابة</span>
            </Button>
            
            <Button 
              onClick={() => handleJudgeDecision(false)}
              className="flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-red-100 shadow-md shadow-red-900/30"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>رفض الإجابة</span>
            </Button>
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={nextQuestion}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600 shadow-md shadow-indigo-900/30"
            >
              {currentQuestionIndex >= questions.length - 1 ? (
                <>انتهت الأسئلة - عرض النتائج</>
              ) : (
                <>تخطي قرار الحكم والانتقال للسؤال التالي <ChevronLeft className="mr-1 w-4 h-4" /></>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JudgeView;
