
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ManualQuestionFormProps {
  onQuestionsGenerated: (questions: Question[]) => void;
  onClose: () => void;
}

const ManualQuestionForm: React.FC<ManualQuestionFormProps> = ({ onQuestionsGenerated, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([{
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  }]);
  
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }]);
    setActiveQuestion(questions.length);
    setCorrectOptionIndex(null);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.error("يجب إضافة سؤال واحد على الأقل");
      return;
    }
    
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    
    if (activeQuestion >= index) {
      setActiveQuestion(Math.max(0, activeQuestion - 1));
    }
  };

  const handleQuestionChange = (value: string) => {
    const newQuestions = [...questions];
    newQuestions[activeQuestion].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (value: string, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[activeQuestion].options[optionIndex] = value;
    
    // Update correct answer if this option is selected as correct
    if (correctOptionIndex === optionIndex) {
      newQuestions[activeQuestion].correctAnswer = value;
    }
    
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerSelect = (optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[activeQuestion].correctAnswer = questions[activeQuestion].options[optionIndex];
    setQuestions(newQuestions);
    setCorrectOptionIndex(optionIndex);
  };

  const handleSubmit = () => {
    // Validate questions
    const isValid = questions.every(q => 
      q.question.trim() !== '' && 
      q.options.every(o => o.trim() !== '') &&
      q.correctAnswer.trim() !== ''
    );

    if (!isValid) {
      toast.error("يرجى ملء جميع الحقول وتحديد الإجابة الصحيحة لكل سؤال");
      return;
    }

    onQuestionsGenerated(questions);
    toast.success(`تم إنشاء ${questions.length} سؤال بنجاح!`);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Card className="p-6 luxury-card relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-center mb-6 text-silver">إضافة أسئلة يدوياً</h2>
          
          <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-none">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveQuestion(index);
                  setCorrectOptionIndex(questions[index].correctAnswer ? 
                    questions[index].options.indexOf(questions[index].correctAnswer) : null);
                }}
                className={`
                  px-4 py-2 rounded-md flex-shrink-0 transition-all
                  ${activeQuestion === index 
                    ? 'bg-zinc-700 text-silver' 
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}
                `}
              >
                سؤال {index + 1}
              </button>
            ))}
            
            <button
              onClick={addQuestion}
              className="px-4 py-2 rounded-md flex-shrink-0 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>سؤال جديد</span>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-zinc-400">نص السؤال</label>
                <button
                  onClick={() => removeQuestion(activeQuestion)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  حذف
                </button>
              </div>
              <Input
                value={questions[activeQuestion].question}
                onChange={(e) => handleQuestionChange(e.target.value)}
                className="text-right luxury-input"
                placeholder="اكتب السؤال هنا..."
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400">الخيارات (اختر الإجابة الصحيحة)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[activeQuestion].options.map((option, optionIndex) => (
                  <div key={optionIndex} className="relative">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(e.target.value, optionIndex)}
                      className={`
                        text-right pr-10 luxury-input
                        ${correctOptionIndex === optionIndex ? 'border-green-500 bg-green-950/30' : ''}
                      `}
                      placeholder={`الخيار ${optionIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleCorrectAnswerSelect(optionIndex)}
                      className={`
                        absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center
                        ${correctOptionIndex === optionIndex 
                          ? 'bg-green-600 text-white' 
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}
                      `}
                    >
                      {correctOptionIndex === optionIndex ? <Check className="w-4 h-4" /> : ''}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-zinc-800">
              <Button
                onClick={handleSubmit}
                className="w-full text-lg py-6 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100"
              >
                <Save className="w-5 h-5" />
                <span>حفظ {questions.length} سؤال وبدء اللعب</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ManualQuestionForm;
