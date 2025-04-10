
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Intro from "@/components/Intro";
import LoadingQuestions from "@/components/LoadingQuestions";
import { generateQuestions, categories, resetUsedQuestions, swapQuestion } from "@/services/questionService";
import Judge from "@/components/Judge";
import ManualQuestionForm from "@/components/ManualQuestionForm";
import PunishmentBox from "@/components/PunishmentBox";
import { ThemeType } from "@/components/ThemeSelector";
import { Sparkles, Timer, Award, Star, Play, Gavel, Edit, Settings, Zap, ArrowRight, RefreshCw, Brain, ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react';
import confetti from "canvas-confetti";
import { useIsMobile } from "@/hooks/use-mobile";

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

// تعريف أنواع الانتقالات المختلفة
const transitionVariants = [
  { // اتجاه لأعلى
    initial: { y: 500, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -500, opacity: 0 }
  },
  { // اتجاه لأسفل
    initial: { y: -500, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 500, opacity: 0 }
  },
  { // اتجاه لليمين
    initial: { x: -500, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 500, opacity: 0 }
  },
  { // اتجاه لليسار
    initial: { x: 500, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -500, opacity: 0 }
  },
  { // ظهور وتلاشي مع تكبير وتصغير
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 }
  }
];

const Index = () => {
  const isMobile = useIsMobile();
  const [showIntro, setShowIntro] = useState(true);
  const [gameSetup, setGameSetup] = useState({
    playerCount: 10,
    team1Name: "الفريق الأول",
    team2Name: "الفريق الثاني",
    questionCount: 10,
    difficulty: 50,
    timePerQuestion: 45,
    judgeName: "الحكم",
  });
  
  const [currentTab, setCurrentTab] = useState("setup");
  const [teams, setTeams] = useState<[Team, Team]>([
    { name: "الفريق الأول", players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 },
    { name: "الفريق الثاني", players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 },
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(45);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [excludedOptions, setExcludedOptions] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [powerUpsAvailable, setPowerUpsAvailable] = useState({
    extraTime: [2, 2],
    doublePoints: [1, 1],
    skipQuestion: [1, 1]
  });
  
  const [showManualQuestionForm, setShowManualQuestionForm] = useState(false);
  const [showPunishmentBox, setShowPunishmentBox] = useState(false);
  const [losingTeamIndex, setLosingTeamIndex] = useState<number | null>(null);
  
  const [gameFeatures, setGameFeatures] = useState({
    streakBonus: true,
    timeBonus: true,
    confettiEffects: true,
    judgeFunctionality: true,
    powerUps: true
  });
  
  const [currentTheme] = useState<ThemeType>('silver');
  const [isRefreshingQuestion, setIsRefreshingQuestion] = useState(false);
  const [transitionType, setTransitionType] = useState(0); // نوع الانتقال الحالي
  const [showQuestion, setShowQuestion] = useState(false); // للتحكم في ظهور السؤال
  const [gameView, setGameView] = useState<'teams' | 'question' | 'judge'>('teams');
  
  // تغيير نوع الانتقال بشكل عشوائي
  const changeTransitionType = () => {
    const newType = Math.floor(Math.random() * transitionVariants.length);
    setTransitionType(newType);
  };
  
  const triggerConfetti = () => {
    if (gameFeatures.confettiEffects) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };
  
  useEffect(() => {
    setTeams(prev => [
      { ...prev[0], name: gameSetup.team1Name },
      { ...prev[1], name: gameSetup.team2Name }
    ]);
  }, [gameSetup.team1Name, gameSetup.team2Name]);

  useEffect(() => {
    if (!gameStarted || !timerActive || timer <= 0 || showAnswer) return;

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          toast.error("انتهى الوقت!");
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, gameStarted, showAnswer, timerActive]);

  // تأكد من أن السؤال يظهر عند بدء اللعبة
  useEffect(() => {
    if (gameStarted && questions.length > 0) {
      setShowQuestion(true);
    }
  }, [gameStarted, questions]);

  const handleStartGame = async () => {
    setIsLoading(true);
    
    try {
      // مسح قائمة الأسئلة المستخدمة عند بدء لعبة جديدة
      resetUsedQuestions();
      
      const generatedQuestions = await generateQuestions(
        selectedCategory, 
        gameSetup.questionCount,
        gameSetup.difficulty
      );
      
      console.log("Generated questions:", generatedQuestions);
      
      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setGameStarted(true);
        setCurrentTab("game");
        setCurrentQuestionIndex(0);
        setTimer(gameSetup.timePerQuestion);
        setTimerActive(false);
        setCurrentTeam(0);
        setExcludedOptions([]);
        setShowAnswer(false);
        setGameView('teams');
        toast.success("تم توليد الأسئلة بنجاح!");
      } else {
        toast.error("حدث خطأ في توليد الأسئلة");
      }
    } catch (error) {
      toast.error("فشل في توليد الأسئلة، يرجى المحاولة مرة أخرى");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualQuestionsGenerated = (manualQuestions: Question[]) => {
    setQuestions(manualQuestions);
    setGameStarted(true);
    setCurrentTab("game");
    setCurrentQuestionIndex(0);
    setTimer(gameSetup.timePerQuestion);
    setTimerActive(false);
    setCurrentTeam(0);
    setExcludedOptions([]);
    setShowAnswer(false);
    setShowManualQuestionForm(false);
    setGameView('teams');
    toast.success("تم إعداد الأسئلة بنجاح!");
  };

  const handleStartTimer = () => {
    setTimerActive(true);
    toast.info("بدأ العد التنازلي!");
  };

  const handleAnswerSelect = (option: string) => {
    if (!gameStarted || timer === 0 || showAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    setShowAnswer(true);
    setTimerActive(false);
    
    if (option === currentQuestion.correctAnswer) {
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        
        let pointsToAdd = 1;
        
        let timeBonus = 0;
        if (gameFeatures.timeBonus) {
          timeBonus = Math.round((timer / gameSetup.timePerQuestion) * 0.5 * 10) / 10;
        }
        
        newTeams[currentTeam].streak += 1;
        const streakMultiplier = (gameFeatures.streakBonus && newTeams[currentTeam].streak >= 3) ? 1.5 : 1;
        
        const doublePointsActive = gameFeatures.powerUps && powerUpsAvailable.doublePoints[currentTeam] < 1;
        const doubleMultiplier = doublePointsActive ? 2 : 1;
        
        pointsToAdd = (pointsToAdd + timeBonus) * streakMultiplier * doubleMultiplier;
        
        newTeams[currentTeam].score = Math.round((newTeams[currentTeam].score + pointsToAdd) * 10) / 10;
        newTeams[currentTeam].bonusPoints = Math.round((newTeams[currentTeam].bonusPoints + timeBonus) * 10) / 10;
        
        return newTeams;
      });
      
      toast.success("إجابة صحيحة! 🎉");
      triggerConfetti();
    } else {
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        newTeams[currentTeam].streak = 0;
        return newTeams;
      });
      
      toast.error("إجابة خاطئة! ❌");
    }
  };

  const handleJudgeDecision = (isCorrect: boolean) => {
    if (!showAnswer || !gameFeatures.judgeFunctionality) return;

    const currentQuestion = questions[currentQuestionIndex];
    const wasAnsweredCorrectly = currentQuestion.correctAnswer === currentQuestion.options.find(
      (_, i) => !excludedOptions.includes(i)
    );

    if (isCorrect) {
      // إذا كان الحكم يقرر أن الإجابة صحيحة
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        const pointsToAdd = 1;
        newTeams[currentTeam].score = Math.round((newTeams[currentTeam].score + pointsToAdd) * 10) / 10;
        return newTeams;
      });
      
      toast.success("الحكم صحح الإجابة! 🎉");
      if (gameFeatures.confettiEffects) {
        triggerConfetti();
      }
    } else {
      // إذا كان الحكم يقرر أن الإجابة خاطئة
      if (wasAnsweredCorrectly) {
        // إذا كانت الإجابة المختارة هي الصحيحة فعلاً، لكن الحكم رفضها
        setTeams(prev => {
          const newTeams = [...prev] as [Team, Team];
          // نقوم بسحب النقطة المحتسبة والمكافأة أيضًا
          const timeBonus = gameFeatures.timeBonus ? 
            Math.round((timer / gameSetup.timePerQuestion) * 0.5 * 10) / 10 : 0;
          const totalDeduction = 1 + timeBonus;
          
          newTeams[currentTeam].score = Math.max(0, Math.round((newTeams[currentTeam].score - totalDeduction) * 10) / 10);
          newTeams[currentTeam].bonusPoints = Math.max(0, Math.round((newTeams[currentTeam].bonusPoints - timeBonus) * 10) / 10);
          
          return newTeams;
        });
      }
      
      toast.error("الحكم رفض الإجابة! ❌");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setGameStarted(false);
      setCurrentTab("results");
      
      if (teams[0].score !== teams[1].score) {
        const losingIndex = teams[0].score < teams[1].score ? 0 : 1;
        setLosingTeamIndex(losingIndex);
      }
      return;
    }

    setCurrentTeam(prev => (prev === 0 ? 1 : 0));
    
    // تغيير نوع الانتقال بشكل عشوائي للسؤال التالي
    changeTransitionType();
    
    // إخفاء السؤال أولاً ثم إظهار السؤال الجديد
    setShowQuestion(false);
    setTimeout(() => {
      setTimer(gameSetup.timePerQuestion);
      setTimerActive(false);
      setCurrentQuestionIndex(prev => prev + 1);
      setExcludedOptions([]);
      setShowAnswer(false);
      setGameView('teams'); // العودة إلى شاشة الفرق أولاً
      setShowQuestion(true);
    }, 500); // انتظر 500 مللي ثانية للانتقال
  };

  const refreshCurrentQuestion = async () => {
    if (!gameStarted || showAnswer || isRefreshingQuestion) return;
    
    setIsRefreshingQuestion(true);
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const newQuestion = await swapQuestion(selectedCategory, currentQuestion, gameSetup.difficulty);
      
      if (newQuestion) {
        // تغيير نوع الانتقال بشكل عشوائي
        changeTransitionType();
        
        // إخفاء السؤال ثم تحديثه
        setShowQuestion(false);
        setTimeout(() => {
          const newQuestions = [...questions];
          newQuestions[currentQuestionIndex] = newQuestion;
          
          setQuestions(newQuestions);
          setTimer(gameSetup.timePerQuestion);
          setTimerActive(false);
          setExcludedOptions([]);
          setShowQuestion(true);
          
          toast.success("تم استبدال السؤال الحالي بنجاح");
        }, 500);
      } else {
        toast.error("لم يتم العثور على سؤال بديل مناسب");
      }
    } catch (error) {
      console.error("خطأ أثناء تبديل السؤال:", error);
      toast.error("حدث خطأ أثناء تبديل السؤال");
    } finally {
      setIsRefreshingQuestion(false);
    }
  };

  const useJoker = () => {
    if (excludedOptions.length > 0 || !gameStarted || showAnswer || !gameFeatures.powerUps) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
    
    const wrongOptions: number[] = [];
    for (let i = 0; i < currentQuestion.options.length; i++) {
      if (i !== correctAnswerIndex && wrongOptions.length < 2) {
        wrongOptions.push(i);
      }
    }
    
    if (wrongOptions.length === 2) {
      setExcludedOptions(wrongOptions);
      
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        if (newTeams[currentTeam].jokers > 0) {
          newTeams[currentTeam].jokers -= 1;
          toast.info("تم استخدام الجوكر لحذف إجابتين خاطئتين");
        }
        return newTeams;
      });
    }
  };
  
  const usePowerUp = (powerUp: 'extraTime' | 'doublePoints' | 'skipQuestion') => {
    if (!gameStarted || showAnswer || !gameFeatures.powerUps) return;
    
    if (powerUp === 'extraTime' && powerUpsAvailable.extraTime[currentTeam] > 0) {
      setTimer(prev => prev + 15);
      setPowerUpsAvailable(prev => {
        const newPowerUps = {...prev};
        newPowerUps.extraTime[currentTeam] -= 1;
        return newPowerUps;
      });
      toast.success("تم إضافة 15 ثانية إضافية! ⏱️");
    } 
    else if (powerUp === 'doublePoints' && powerUpsAvailable.doublePoints[currentTeam] > 0) {
      setPowerUpsAvailable(prev => {
        const newPowerUps = {...prev};
        newPowerUps.doublePoints[currentTeam] -= 1;
        return newPowerUps;
      });
      toast.success("النقاط المضاعفة مفعلة للإجابة التالية! 🔥");
    }
    else if (powerUp === 'skipQuestion' && powerUpsAvailable.skipQuestion[currentTeam] > 0) {
      setPowerUpsAvailable(prev => {
        const newPowerUps = {...prev};
        newPowerUps.skipQuestion[currentTeam] -= 1;
        return newPowerUps;
      });
      toast.info("تم تخطي السؤال! ⏭️");
      nextQuestion();
    }
  };

  const resetGame = () => {
    resetUsedQuestions();
    setGameStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimer(gameSetup.timePerQuestion);
    setTimerActive(false);
    setShowAnswer(false);
    setPowerUpsAvailable({
      extraTime: [2, 2],
      doublePoints: [1, 1],
      skipQuestion: [1, 1]
    });
    setTeams([
      { name: gameSetup.team1Name, players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 },
      { name: gameSetup.team2Name, players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 }
    ]);
    setCurrentTab("setup");
    setLosingTeamIndex(null);
    setGameView('teams');
  };
  
  const calculateTimeBonus = () => {
    return gameFeatures.timeBonus ? Math.round((timer / gameSetup.timePerQuestion) * 0.5 * 10) / 10 : 0;
  };

  const getStreakMultiplier = (teamIndex: number) => {
    return (gameFeatures.streakBonus && teams[teamIndex].streak >= 3) ? 1.5 : 1;
  };

  const showPunishment = () => {
    if (losingTeamIndex !== null) {
      setShowPunishmentBox(true);
    } else {
      toast.info("تعادل الفريقان، لا يوجد عقاب!");
    }
  };

  const toggleFeature = (feature: keyof typeof gameFeatures) => {
    setGameFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    
    toast.info(`تم ${gameFeatures[feature] ? 'تعطيل' : 'تفعيل'} ${getFeatureName(feature)}`);
  };
  
  const getFeatureName = (feature: keyof typeof gameFeatures): string => {
    const featureNames: Record<keyof typeof gameFeatures, string> = {
      streakBonus: "مكافأة السلسلة",
      timeBonus: "مكافأة الوقت",
      confettiEffects: "تأثيرات الاحتفال",
      judgeFunctionality: "وظيفة الحكم",
      powerUps: "القدرات الخاصة"
    };
    
    return featureNames[feature];
  };

  const powerUpsDescription = {
    extraTime: "إضافة وقت: تضيف 15 ثانية إضافية إلى العد التنازلي.",
    doublePoints: "نقاط مضاعفة: تضاعف النقاط التي ستحصل عليها إذا أجبت بشكل صحيح.",
    skipQuestion: "تخطي السؤال: تتيح لك تخطي السؤال الحالي والانتقال للسؤال التالي.",
    joker: "الجوكر: يحذف خيارين خاطئين من الاختيارات المتاحة."
  };

  // هذا مكون فرعي لعرض الفرق وحالة اللعبة
  const TeamsView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-center">
        {teams.map((team, index) => (
          <Card 
            key={index} 
            className={`p-2.5 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 ${currentTeam === index ? 'ring-1 ring-inset ring-offset-1 ring-blue-400' : ''}`}
          >
            <h3 className="text-sm font-bold mb-0.5 text-gray-200">{team.name}</h3>
            <div className="text-2xl font-bold text-gray-100">
              {team.score}
              {team.bonusPoints > 0 && gameFeatures.timeBonus && (
                <span className="text-xs text-gray-300 opacity-70 ml-1">
                  (+{team.bonusPoints})
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-1 text-xs mt-0.5 text-gray-400">
              <span>سلسلة: {team.streak} {gameFeatures.streakBonus && team.streak >= 3 && '🔥'}</span>
              {gameFeatures.streakBonus && team.streak >= 3 && (
                <span className="text-yellow-400">× {getStreakMultiplier(index)}</span>
              )}
            </div>
            
            <div className="text-xs mt-0.5 flex items-center justify-center gap-1 text-gray-400">
              <span>
                الجوكر: {team.jokers} {team.jokers > 0 && currentTeam === index && !showAnswer && gameFeatures.powerUps && (
                  <button 
                    onClick={useJoker} 
                    disabled={team.jokers <= 0 || excludedOptions.length > 0}
                    className="underline text-blue-400"
                  >
                    استخدم
                  </button>
                )}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {gameFeatures.powerUps && (
        <div className="grid grid-cols-3 gap-1">
          <Button
            variant={powerUpsAvailable.extraTime[currentTeam] > 0 ? "outline" : "ghost"}
            disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
            onClick={() => usePowerUp('extraTime')}
            className="flex flex-col items-center py-1 h-auto border-gray-700 text-xs bg-gradient-to-r from-gray-800 to-gray-900"
            size="sm"
          >
            <Timer className="h-3 w-3 mb-0.5" />
            <span>وقت إضافي</span>
            <span className="text-[10px] mt-0.5">({powerUpsAvailable.extraTime[currentTeam]})</span>
          </Button>
          
          <Button
            variant={powerUpsAvailable.doublePoints[currentTeam] > 0 ? "outline" : "ghost"}
            disabled={powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer}
            onClick={() => usePowerUp('doublePoints')}
            className="flex flex-col items-center py-1 h-auto border-gray-700 text-xs bg-gradient-to-r from-gray-800 to-gray-900"
            size="sm"
          >
            <Star className="h-3 w-3 mb-0.5" />
            <span>نقاط مضاعفة</span>
            <span className="text-[10px] mt-0.5">({powerUpsAvailable.doublePoints[currentTeam]})</span>
          </Button>
          
          <Button
            variant={powerUpsAvailable.skipQuestion[currentTeam] > 0 ? "outline" : "ghost"}
            disabled={powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer}
            onClick={() => usePowerUp('skipQuestion')}
            className="flex flex-col items-center py-1 h-auto border-gray-700 text-xs bg-gradient-to-r from-gray-800 to-gray-900"
            size="sm"
          >
            <Award className="h-3 w-3 mb-0.5" />
            <span>تخطي السؤال</span>
            <span className="text-[10px] mt-0.5">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
          </Button>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <Button 
          onClick={() => {
            changeTransitionType();
            setGameView('question');
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
        >
          <Brain className="w-4 h-4 ml-2" /> عرض السؤال
        </Button>
        
        {showAnswer && gameFeatures.judgeFunctionality && (
          <Button 
            onClick={() => {
              changeTransitionType();
              setGameView('judge');
            }}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600"
          >
            <Gavel className="w-4 h-4 ml-2" /> تدخل الحكم
          </Button>
        )}
      </div>
    </div>
  );

  // هذا مكون فرعي لعرض السؤال الحالي
  const QuestionView = () => {
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
            className="flex items-center text-xs text-gray-400 hover:text-white"
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
        
        <div className="relative">
          <div className={`absolute top-0 right-0 w-full h-1 bg-gray-700 rounded-full overflow-hidden`}>
            <div 
              className={`h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-1000 ease-linear`}
              style={{ 
                width: `${(timer / gameSetup.timePerQuestion) * 100}%`, 
                transition: timerActive ? 'width 1s linear' : 'none' 
              }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <button 
              onClick={refreshCurrentQuestion} 
              disabled={isRefreshingQuestion || showAnswer}
              className="text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-600 flex items-center"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshingQuestion ? 'animate-spin' : ''}`} />
              تبديل
            </button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <div className={`text-lg font-bold ${timer <= 10 ? 'text-red-500' : timer <= 20 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {timer}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartTimer}
                  disabled={timerActive || showAnswer}
                  className="py-0 h-6 text-xs border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900"
                >
                  <Timer className="w-3 h-3 ml-1" />
                  ابدأ
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {!timerActive && !showAnswer ? 'اضغط على ابدأ للعد التنازلي' : ''}
              </div>
            </div>
            
            <div className="text-xs text-gray-400">
              {!showAnswer && gameFeatures.timeBonus && (
                <span>+{calculateTimeBonus()} نقطة إضافية</span>
              )}
            </div>
          </div>
        </div>
        
        <Card className="p-3 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700">
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
                    ? 'bg-green-700 hover:bg-green-600 text-white border-green-600' 
                    : showAnswer && !excludedOptions.includes(index)
                    ? 'bg-red-800 hover:bg-red-700 text-white border-red-700'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600 hover:from-gray-600 hover:to-gray-700'}
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
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600"
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

  // مكون فرعي لعرض قسم الحكم
  const JudgeView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => {
            changeTransitionType();
            setGameView('teams');
          }} 
          className="flex items-center text-xs text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-4 h-4 ml-1" /> العودة
        </button>
        
        <h3 className="text-center text-sm font-bold text-amber-400">تدخل الحكم</h3>
        
        <div className="w-8"></div>
      </div>
      
      <Card className="p-4 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700">
        <div className="text-center mb-4">
          <div className="mb-2">
            <span className="text-sm text-gray-400">الحكم:</span>
            <h4 className="text-lg font-bold text-amber-300">{gameSetup.judgeName}</h4>
          </div>
          
          <p className="text-sm text-gray-300">
            هل يتم احتساب الإجابة السابقة لفريق {teams[currentTeam].name} صحيحة؟
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => {
              handleJudgeDecision(true);
              changeTransitionType();
              setGameView('teams');
            }}
            className="bg-gradient-to-r from-green-700 to-green-800 text-white hover:from-green-600 hover:to-green-700 py-6"
          >
            <div className="flex flex-col items-center">
              <ThumbsUp className="w-8 h-8 mb-1" />
              <span>نعم، إجابة صحيحة</span>
            </div>
          </Button>
          
          <Button 
            onClick={() => {
              handleJudgeDecision(false);
              changeTransitionType();
              setGameView('teams');
            }}
            className="bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-600 hover:to-red-700 py-6"
          >
            <div className="flex flex-col items-center">
              <ThumbsDown className="w-8 h-8 mb-1" />
              <span>لا، إجابة خاطئة</span>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );

  // مكون النتائج
  const ResultsView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-100">نتائج المسابقة</h2>
        <p className="text-sm text-gray-400">انتهت المسابقة! إليك النتائج النهائية</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* الفائز */}
        <Card className="p-4 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-yellow-900/50">
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-yellow-500 mb-1">الفريق الفائز</h3>
            <div className="flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-xl font-bold text-yellow-400">
                {teams[0].score === teams[1].score 
                  ? "تعادل" 
                  : teams[0].score > teams[1].score ? teams[0].name : teams[1].name}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`text-center p-3 rounded-lg ${teams[0].score >= teams[1].score ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-gray-800/50'}`}>
              <h4 className="font-bold mb-1 text-gray-300">{teams[0].name}</h4>
              <div className="text-2xl font-bold text-blue-400">{teams[0].score}</div>
              {teams[0].bonusPoints > 0 && (
                <div className="text-xs text-gray-400">+{teams[0].bonusPoints} نقاط إضافية</div>
              )}
            </div>
            
            <div className={`text-center p-3 rounded-lg ${teams[1].score >= teams[0].score ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-gray-800/50'}`}>
              <h4 className="font-bold mb-1 text-gray-300">{teams[1].name}</h4>
              <div className="text-2xl font-bold text-blue-400">{teams[1].score}</div>
              {teams[1].bonusPoints > 0 && (
                <div className="text-xs text-gray-400">+{teams[1].bonusPoints} نقاط إضافية</div>
              )}
            </div>
          </div>
          
          {teams[0].score !== teams[1].score && (
            <div className="text-center">
              <Button 
                onClick={showPunishment}
                variant="outline"
                className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-orange-900/50 text-orange-400 hover:text-orange-300"
              >
                <Gavel className="w-4 h-4 ml-2" />
                عرض العقوبة للفريق الخاسر
              </Button>
            </div>
          )}
        </Card>
        
        <div className="flex justify-center">
          <Button 
            onClick={resetGame}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-500 hover:to-indigo-600 w-full"
          >
            <Play className="w-4 h-4 ml-2" /> بدء مسابقة جديدة
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showIntro && <Intro onIntroComplete={handleIntroComplete} />}
      
      {isLoading && <LoadingQuestions />}
      
      {showManualQuestionForm && (
        <ManualQuestionForm 
          onQuestionsGenerated={handleManualQuestionsGenerated}
          onClose={() => setShowManualQuestionForm(false)}
        />
      )}
      
      {showPunishmentBox && losingTeamIndex !== null && (
        <PunishmentBox 
          teamName={teams[losingTeamIndex].name}
          onClose={() => setShowPunishmentBox(false)}
        />
      )}

      <div className="min-h-screen py-2 px-3 font-cairo bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto max-w-sm">
          <motion.header 
            className="text-center my-4 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-100 flex items-center justify-center gap-1">
              <Sparkles className="w-6 h-6 text-blue-400" />
              مسابقات المعرفة
              <Sparkles className="w-6 h-6 text-blue-400" />
            </h1>
            <p className="text-sm text-gray-400 mt-1">تنافس، تعلم، استمتع</p>
          </motion.header>

          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="setup" disabled={gameStarted} className="text-gray-300 data-[state=active]:bg-blue-900/20 text-sm py-1.5">الإعداد</TabsTrigger>
              <TabsTrigger value="game" disabled={!gameStarted} className="text-gray-300 data-[state=active]:bg-blue-900/20 text-sm py-1.5">اللعبة</TabsTrigger>
              <TabsTrigger value="results" disabled={currentTab !== "results"} className="text-gray-300 data-[state=active]:bg-blue-900/20 text-sm py-1.5">النتائج</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <Card className="p-4 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700">
                <h2 className="text-xl font-bold text-center mb-3 text-gray-100">إعداد المسابقة</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">عدد اللاعبين في كل فريق</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={gameSetup.playerCount}
                      onChange={(e) => setGameSetup({...gameSetup, playerCount: parseInt(e.target.value) || 1})}
                      className="text-center border-gray-700 text-gray-300 h-8 text-sm bg-gray-800/50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">اسم الفريق الأول</label>
                      <Input
                        value={gameSetup.team1Name}
                        onChange={(e) => setGameSetup({...gameSetup, team1Name: e.target.value})}
                        className="text-center border-gray-700 text-gray-300 h-8 text-sm bg-gray-800/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">اسم الفريق الثاني</label>
                      <Input
                        value={gameSetup.team2Name}
                        onChange={(e) => setGameSetup({...gameSetup, team2Name: e.target.value})}
                        className="text-center border-gray-700 text-gray-300 h-8 text-sm bg-gray-800/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">اسم الحكم</label>
                    <Input
                      value={gameSetup.judgeName}
                      onChange={(e) => setGameSetup({...gameSetup, judgeName: e.target.value})}
                      className="text-center border-gray-700 text-gray-300 h-8 text-sm bg-gray-800/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">عدد الأسئلة</label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min="5"
                        max="30"
                        value={gameSetup.questionCount}
                        onChange={(e) => setGameSetup({...gameSetup, questionCount: parseInt(e.target.value) || 10})}
                        className="text-center border-gray-700 text-gray-300 h-8 text-sm bg-gray-800/50"
                      />
                      <span className="mr-2 text-gray-300 text-sm">سؤال</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">يمكنك اختيار من 5 إلى 30 سؤال</p>
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-xs font-medium mb-1 text-gray-400">
                      <span>مستوى صعوبة الأسئلة</span>
                      <span>
                        {gameSetup.difficulty < 30 ? "سهل" : 
                         gameSetup.difficulty > 70 ? "صعب" : "متوسط"}
                      </span>
                    </label>
                    <Slider
                      defaultValue={[50]}
                      min={1}
                      max={100}
                      step={1}
                      value={[gameSetup.difficulty]}
                      onValueChange={(value) => setGameSetup({...gameSetup, difficulty: value[0]})}
                      className="py-3"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>سهل</span>
                      <span>متوسط</span>
                      <span>صعب</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-xs font-medium mb-1 text-gray-400">
                      <span>الوقت المخصص لكل سؤال</span>
                      <span>{gameSetup.timePerQuestion} ثانية</span>
                    </label>
                    <Slider
                      defaultValue={[45]}
                      min={15}
                      max={90}
                      step={5}
                      value={[gameSetup.timePerQuestion]}
                      onValueChange={(value) => setGameSetup({...gameSetup, timePerQuestion: value[0]})}
                      className="py-3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">اختر فئة الأسئلة</label>
                    <select 
                      className="w-full p-1.5 border rounded-md text-center border-gray-700 bg-gray-800/50 text-gray-300 text-sm"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Card className="p-2.5 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <h3 className="text-sm font-bold text-center mb-2 text-gray-300 flex items-center justify-center gap-1">
                      <Settings className="w-3 h-3" />
                      مميزات اللعبة
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center justify-between p-1.5 border border-gray-700 rounded-lg bg-gray-800/70">
                        <div className="flex items-center">
                          <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                          <span className="text-gray-300 text-xs">مكافأة السلسلة</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.streakBonus} 
                          onCheckedChange={() => toggleFeature('streakBonus')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-1.5 border border-gray-700 rounded-lg bg-gray-800/70">
                        <div className="flex items-center">
                          <Timer className="w-3 h-3 mr-1 text-blue-500" />
                          <span className="text-gray-300 text-xs">مكافأة الوقت</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.timeBonus} 
                          onCheckedChange={() => toggleFeature('timeBonus')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-1.5 border border-gray-700 rounded-lg bg-gray-800/70">
                        <div className="flex items-center">
                          <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
                          <span className="text-gray-300 text-xs">تأثيرات الاحتفال</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.confettiEffects} 
                          onCheckedChange={() => toggleFeature('confettiEffects')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-1.5 border border-gray-700 rounded-lg bg-gray-800/70">
                        <div className="flex items-center">
                          <Gavel className="w-3 h-3 mr-1 text-amber-500" />
                          <span className="text-gray-300 text-xs">وظيفة الحكم</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.judgeFunctionality} 
                          onCheckedChange={() => toggleFeature('judgeFunctionality')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-1.5 border border-gray-700 rounded-lg bg-gray-800/70">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-green-500" />
                          <span className="text-gray-300 text-xs">القدرات الخاصة</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.powerUps} 
                          onCheckedChange={() => toggleFeature('powerUps')}
                        />
                      </div>
                    </div>
                    
                    {gameFeatures.powerUps && (
                      <div className="mt-3 p-2 border border-gray-700 rounded-lg bg-gray-900/50">
                        <h4 className="text-xs font-bold mb-1 text-gray-300">القدرات الخاصة المتاحة:</h4>
                        <ul className="text-[10px] space-y-0.5 text-gray-400">
                          <li>• وقت إضافي: تضيف 15 ثانية للعد التنازلي</li>
                          <li>• نقاط مضاعفة: تضاعف النقاط عند الإجابة الصحيحة</li>
                          <li>• تخطي السؤال: تتيح تخطي السؤال الحالي</li>
                          <li>• الجوكر: يحذف خيارين خاطئين</li>
                        </ul>
                      </div>
                    )}
                  </Card>
                  
                  <div className="grid grid-cols-1 gap-2 pt-3">
                    <Button 
                      onClick={handleStartGame} 
                      className="text-base py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                    >
                      <Brain className="w-5 h-5 ml-2" />
                      توليد الأسئلة بالذكاء الاصطناعي
                    </Button>
                    
                    <Button 
                      onClick={() => setShowManualQuestionForm(true)}
                      className="text-base py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      إضافة أسئلة يدوياً
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="game">
              {gameStarted && questions.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`${gameView}-${currentQuestionIndex}`}
                    className="space-y-4"
                    initial={transitionVariants[transitionType].initial}
                    animate={transitionVariants[transitionType].animate}
                    exit={transitionVariants[transitionType].exit}
                    transition={{ 
                      duration: 0.5, 
                      type: "spring", 
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    {gameView === 'teams' && <TeamsView />}
                    {gameView === 'question' && showQuestion && <QuestionView />}
                    {gameView === 'judge' && <JudgeView />}
                  </motion.div>
                </AnimatePresence>
              )}
            </TabsContent>

            <TabsContent value="results">
              <ResultsView />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Index;
