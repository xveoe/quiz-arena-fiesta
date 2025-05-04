
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
          className="flex items-center text-xs text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4 ml-1" /> العودة
        </button>
        
        <h3 className="text-center text-sm font-bold text-amber-600">تدخل الحكم</h3>
        
        <div className="w-8"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
          <div className="text-center mb-4">
            <div className="mb-3">
              <span className="text-sm text-gray-500">يمكن للحكم</span>
              <h3 className="text-lg font-bold text-amber-600 my-1">{gameSetup.judgeName}</h3>
              <span className="text-sm text-gray-500">التدخل وتغيير نتيجة الإجابة أو خصم نقاط:</span>
            </div>
            
            <div className="mt-5 grid grid-cols-2 gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => handleJudgeDecision(true)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm w-full font-medium"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>تصحيح الإجابة</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => handleJudgeDecision(false)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm w-full font-medium"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>رفض الإجابة</span>
                </Button>
              </motion.div>
            </div>
            
            <div className="mt-4">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} className="w-full">
                    <Button 
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm font-medium"
                    >
                      <MinusCircle className="w-4 h-4" />
                      <span>خصم نقاط لسوء السلوك</span>
                    </Button>
                  </motion.div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div 
                    className="grid grid-cols-3 gap-2 mt-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => handleJudgeDeductPoints(0.5)}
                        className="py-2 bg-white text-gray-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 rounded-xl w-full"
                      >
                        -0.5 نقطة
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => handleJudgeDeductPoints(1)}
                        className="py-2 bg-white text-gray-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 rounded-xl w-full"
                      >
                        -1 نقطة
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => handleJudgeDeductPoints(2)}
                        className="py-2 bg-white text-gray-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 rounded-xl w-full"
                      >
                        -2 نقطة
                      </Button>
                    </motion.div>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <div className="mt-5">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={nextQuestion}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm font-medium"
                >
                  {currentQuestionIndex >= questions.length - 1 ? (
                    <>انتهت الأسئلة - عرض النتائج</>
                  ) : (
                    <>تخطي قرار الحكم والانتقال للسؤال التالي <ChevronLeft className="mr-1 w-4 h-4" /></>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default JudgeView;
