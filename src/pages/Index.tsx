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
import SetupSteps from "@/components/SetupSteps";
import FeatureSelector from "@/components/FeatureSelector";
import EnhancedLoadingScreen from "@/components/EnhancedLoadingScreen";

import { 
  Sparkles, 
  Timer, 
  Award, 
  Star, 
  Play, 
  Gavel, 
  Edit, 
  Settings, 
  Zap, 
  ArrowRight, 
  RefreshCw, 
  Brain, 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown,
  Trophy,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react';
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

const transitionVariants = [
  { // اتجاه لأعلى
    initial: { y: 300, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -300, opacity: 0, transition: { duration: 0.2 } }
  },
  { // اتجاه لأسفل
    initial: { y: -300, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 300, opacity: 0, transition: { duration: 0.2 } }
  },
  { // اتجاه لليمين
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0, transition: { duration: 0.2 } }
  },
  { // اتجاه لليسار
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0, transition: { duration: 0.2 } }
  },
  { // ظهور وتلاشي مع تكبير وتصغير
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.1, opacity: 0, transition: { duration: 0.2 } }
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
  
  const [setupStep, setSetupStep] = useState<'settings' | 'features' | 'loading'>('settings');
  
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

  useEffect(() => {
    if (gameStarted && questions.length > 0) {
      setShowQuestion(true);
    }
  }, [gameStarted, questions]);

  const handleAdvanceSetup = () => {
    if (setupStep === 'settings') {
      setSetupStep('features');
    } else if (setupStep === 'features') {
      setSetupStep('loading');
      setTimeout(() => {
        handleStartGame();
      }, 500);
    }
  };

  const handleStartGame = async () => {
    setIsLoading(true);
    
    try {
      resetUsedQuestions();
      
      const generatedQuestions = await generateQuestions(
        selectedCategory, 
        gameSetup.questionCount,
        gameSetup.difficulty
      );
      
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
        setTimeout(() => {
          toast.success("تم توليد الأسئلة بنجاح!");
        }, 500);
      } else {
        setSetupStep('settings');
        setTimeout(() => {
          toast.error("حدث خطأ في توليد الأسئلة");
        }, 500);
      }
    } catch (error) {
      setSetupStep('settings');
      setTimeout(() => {
        toast.error("فشل في توليد الأسئلة، يرجى المحاولة مرة أخرى");
      }, 500);
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        if (questions.length > 0) {
          setSetupStep('settings');
        }
      }, 2000);
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
      if (wasAnsweredCorrectly) {
        setTeams(prev => {
          const newTeams = [...prev] as [Team, Team];
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
    
    changeTransitionType();
    
    setShowQuestion(false);
    setTimeout(() => {
      setTimer(gameSetup.timePerQuestion);
      setTimerActive(false);
      setCurrentQuestionIndex(prev => prev + 1);
      setExcludedOptions([]);
      setShowAnswer(false);
      setGameView('teams');
      setShowQuestion(true);
    }, 300);
  };

  const refreshCurrentQuestion = async () => {
    if (!gameStarted || showAnswer || isRefreshingQuestion) return;
    
    setIsRefreshingQuestion(true);
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const newQuestion = await swapQuestion(selectedCategory, currentQuestion, gameSetup.difficulty);
      
      if (newQuestion) {
        changeTransitionType();
        
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
        }, 300);
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
    setSetupStep('settings');
  };
  
  const endGame = () => {
    if (!gameStarted) return;
    
    if (window.confirm("هل أنت متأكد من إنهاء اللعبة؟ سيتم العودة إلى شاشة النتائج.")) {
      setGameStarted(false);
      setCurrentTab("results");
      
      if (teams[0].score !== teams[1].score) {
        const losingIndex = teams[0].score < teams[1].score ? 0 : 1;
        setLosingTeamIndex(losingIndex);
      }
    }
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

  const TeamsView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-center">
        {teams.map((team, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card 
              className={`p-2.5 bg-gradient-to-b from-gray-800/90 to-gray-900/95 border border-gray-700/50 shadow-lg 
                ${currentTeam === index ? 'ring-1 ring-inset ring-offset-1 ring-blue-400' : ''}`}
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
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button 
            onClick={() => {
              changeTransitionType();
              setGameView('question');
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-900/20"
          >
            <Brain className="w-4 h-4 ml-2" /> عرض السؤال
          </Button>
        </motion.div>
        
        {showAnswer && gameFeatures.judgeFunctionality && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button 
              onClick={() => {
                changeTransitionType();
                setGameView('judge');
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-900/20"
            >
              <Gavel className="w-4 h-4 ml-2" /> تدخل الحكم
            </Button>
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Button 
            onClick={endGame}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-md shadow-red-900/20"
          >
            <X className="w-4 h-4 ml-2" /> إنهاء اللعبة
          </Button>
        </motion.div>
      </div>
    </div>
  );

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
        
        <div className="relative">
          <div className={`absolute top-0 right-0 w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden`}>
            <motion.div 
              className={`h-full bg-gradient-to-r from-green-500 to-blue-500`}
              animate={{ width: `${timerActive ? 0 : (timer / gameSetup.timePerQuestion) * 100}%` }}
              initial={{ width: `${(timer / gameSetup.timePerQuestion) * 100}%` }}
              transition={{ 
                duration: timerActive ? gameSetup.timePerQuestion : 0, 
                ease: "linear" 
              }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2.5">
            <button 
              onClick={refreshCurrentQuestion} 
              disabled={isRefreshingQuestion || showAnswer}
              className="text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-600 flex items-center transition-colors"
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
                  className="py-0 h-6 text-xs border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
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
        
        {gameFeatures.powerUps && (
          <div className="grid grid-cols-4 gap-1 mb-3">
            <Button
              variant={powerUpsAvailable.extraTime[currentTeam] > 0 ? "outline" : "ghost"}
              disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
              onClick={() => usePowerUp('extraTime')}
              className="flex flex-col items-center py-1 h-auto border-gray-700/60 text-xs bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80"
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
              className="flex flex-col items-center py-1 h-auto border-gray-700/60 text-xs bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80"
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
              className="flex flex-col items-center py-1 h-auto border-gray-700/60 text-xs bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80"
              size="sm"
            >
              <Award className="h-3 w-3 mb-0.5" />
              <span>تخطي السؤال</span>
              <span className="text-[10px] mt-0.5">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
            </Button>
            
            <Button 
              onClick={useJoker} 
              disabled={teams[currentTeam].jokers <= 0 || excludedOptions.length > 0 || showAnswer || !gameFeatures.powerUps}
              className="flex flex-col items-center py-1 h-auto text-xs border-gray-700/60 bg-gradient-to-r from-blue-900/90 to-blue-800/90 hover:from-blue-800/90 hover:to-blue-700/90 text-blue-200"
              size="sm"
            >
              <Zap className="h-3 w-3 mb-0.5" />
              <span>جوكر</span>
              <span className="text-[10px] mt-0.5">({teams[currentTeam].jokers})</span>
            </Button>
          </div>
        )}
        
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

  const JudgeView = () => (
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

  const ResultsView = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 p-4"
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-3">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">نتائج المسابقة</h2>
          <p className="text-gray-400">انتهت المباراة! إليكم النتائج النهائية</p>
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
              <Card className={`p-4 transition-all duration-300 ${
                teams[0].score !== teams[1].score 
                ? (teams[0].score > teams[1].score ? index === 0 : index === 1) 
                  ? 'bg-gradient-to-b from-amber-900/30 to-amber-800/30 border-amber-700/50 shadow-lg shadow-amber-900/20' 
                  : 'bg-gradient-to-b from-gray-800/90 to-gray-900/95 border-gray-700/50'
                : 'bg-gradient-to-b from-blue-900/30 to-blue-800/30 border-blue-700/50 shadow-lg shadow-blue-900/20'
              }`}>
                <h3 className="font-bold text-base mb-2">{team.name}</h3>
                <div className="text-3xl font-bold mb-2">{team.score}</div>
                {teams[0].score !== teams[1].score && (
                  (teams[0].score > teams[1].score ? index === 0 : index === 1) ? (
                    <div className="text-amber-500 text-sm flex items-center justify-center">
                      <Trophy className="w-4 h-4 mr-1" /> الفائز
                    </div>
                  ) : (
                    <div className="text-red-500 text-sm">الخاسر</div>
                  )
                )}
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col gap-3">
          {losingTeamIndex !== null && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button 
                onClick={showPunishment}
                className="w-full py-3 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-900/30"
              >
                <Award className="w-4 h-4 ml-2" />
                عرض عقاب الفريق الخاسر
              </Button>
            </motion.div>
          )}
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button 
              onClick={resetGame}
              className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-900/30"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              بدء لعبة جديدة
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  if (showIntro) {
    return <Intro onIntroComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-200 pb-6">
      <header className="py-4 px-4 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg shadow-black/40">
        <div className="max-w-screen-sm mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center flex-1"
          >
            مسابقة تحدي المعرفة
          </motion.h1>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-screen-sm mx-auto w-full">
        <Tabs value={currentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 shadow-xl">
            <TabsTrigger value="setup" disabled={gameStarted}>الإعدادات</TabsTrigger>
            <TabsTrigger value="game" disabled={!gameStarted}>اللعبة</TabsTrigger>
            <TabsTrigger value="results" disabled={gameStarted && currentQuestionIndex < questions.length - 1}>النتائج</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-2">
            <AnimatePresence mode="wait">
              {setupStep === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SetupSteps 
                    gameSetup={gameSetup}
                    setGameSetup={setGameSetup}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onComplete={() => setSetupStep('features')}
                  />
                </motion.div>
              )}
              
              {setupStep === 'features' && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FeatureSelector 
                    gameFeatures={gameFeatures}
                    toggleFeature={toggleFeature}
                    onComplete={() => setSetupStep('loading')}
                  />
                </motion.div>
              )}
              
              {setupStep === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EnhancedLoadingScreen 
                    onComplete={() => setSetupStep('settings')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="game" className="space-y-4 mt-2">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingQuestions />
                </motion.div>
              )}
              
              {!isLoading && gameStarted && (
                <motion.div 
                  key={`${gameView}-${currentQuestionIndex}-${transitionType}`}
                  initial={transitionVariants[transitionType].initial}
                  animate={transitionVariants[transitionType].animate}
                  exit={transitionVariants[transitionType].exit}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  {gameView === 'teams' && <TeamsView />}
                  {gameView === 'question' && showQuestion && <QuestionView />}
                  {gameView === 'judge' && <JudgeView />}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="results" className="mt-2">
            <ResultsView />
          </TabsContent>
        </Tabs>
      </main>

      <AnimatePresence>
        {showManualQuestionForm && (
          <ManualQuestionForm 
            onClose={() => setShowManualQuestionForm(false)}
            onQuestionsGenerated={handleManualQuestionsGenerated}
          />
        )}
        
        {showPunishmentBox && (
          <PunishmentBox 
            teamName={teams[losingTeamIndex!].name} 
            onClose={() => setShowPunishmentBox(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
