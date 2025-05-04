
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ThumbsUp, ThumbsDown, MinusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface JudgeViewProps {
  gameSetup: {
    judgeName: string;
  };
  handleJudgeDecision: (isCorrect: boolean) => void;
  handleJudgeDeductPoints: (points: number) => void;
  nextQuestion: () => void;
  currentQuestionIndex: number;
  questions: any[];
  changeTransitionType: () => void;
  setGameView: (view: 'teams' | 'question' | 'judge') => void;
}

const JudgeView: React.FC<JudgeViewProps> = ({
  gameSetup,
  handleJudgeDecision,
  handleJudgeDeductPoints,
  nextQuestion,
  currentQuestionIndex,
  questions,
  changeTransitionType,
  setGameView
}) => {
  const [showDeductOptions, setShowDeductOptions] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => {
            changeTransitionType();
            setGameView('teams');
          }} 
          className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4 ml-1" /> العودة
        </button>
        
        <h3 className="text-center text-sm font-bold text-amber-600">تدخل الحكم</h3>
        
        <div className="w-8"></div>
      </div>
      
      <Card className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="text-center mb-4">
          <div className="mb-3">
            <span className="text-sm text-gray-500">يمكن للحكم</span>
            <h3 className="text-lg font-bold text-amber-600 my-1">{gameSetup.judgeName}</h3>
            <span className="text-sm text-gray-500">التدخل وتغيير نتيجة الإجابة أو خصم نقاط:</span>
          </div>
          
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button 
              onClick={() => handleJudgeDecision(true)}
              className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>تصحيح الإجابة</span>
            </Button>
            
            <Button 
              onClick={() => handleJudgeDecision(false)}
              className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-sm"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>رفض الإجابة</span>
            </Button>
          </div>
          
          <div className="mt-4">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button 
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-sm"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>خصم نقاط لسوء السلوك</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <motion.div 
                  className="grid grid-cols-3 gap-2 mt-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    variant="outline"
                    onClick={() => handleJudgeDeductPoints(0.5)}
                    className="py-1.5 bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
                  >
                    -0.5 نقطة
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleJudgeDeductPoints(1)}
                    className="py-1.5 bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
                  >
                    -1 نقطة
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleJudgeDeductPoints(2)}
                    className="py-1.5 bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
                  >
                    -2 نقطة
                  </Button>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="mt-5">
            <Button 
              onClick={nextQuestion}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-sm"
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
