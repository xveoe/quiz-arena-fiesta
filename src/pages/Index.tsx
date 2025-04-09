
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Intro from "@/components/Intro";
import LoadingQuestions from "@/components/LoadingQuestions";
import { generateQuestions, categories, preGenerateQuestions, resetUsedQuestions, swapQuestion } from "@/services/questionService";
import Judge from "@/components/Judge";
import ManualQuestionForm from "@/components/ManualQuestionForm";
import PunishmentBox from "@/components/PunishmentBox";
import ThemeSelector, { ThemeType } from "@/components/ThemeSelector";
import { Sparkles, ThumbsUp, ThumbsDown, Timer, Trophy, Gift, Medal, Award, Star, Play, Gavel, Plus, Edit, Settings, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from "canvas-confetti";

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

const Index = () => {
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
  
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('gold');
  const [isRefreshingQuestion, setIsRefreshingQuestion] = useState(false);
  
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
  
  const handleThemeChange = (theme: ThemeType) => {
    setCurrentTheme(theme);
    // يمكن إضافة أي منطق إضافي عند تغيير الثيم هنا
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

  const handleStartGame = async () => {
    setIsLoading(true);
    
    try {
      // مسح قائمة الأسئلة المستخدمة سابقاً عند بدء لعبة جديدة
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

    if (isCorrect) {
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        
        const pointsToAdd = 1;
        
        newTeams[currentTeam].score = Math.round((newTeams[currentTeam].score + pointsToAdd) * 10) / 10;
        
        return newTeams;
      });
      
      toast.success("الحكم صحح الإجابة! 🎉");
      triggerConfetti();
    } else {
      // عند رفض الإجابة، قم بإرجاع النقطة المحتسبة
      const lastAnsweredCorrectly = questions[currentQuestionIndex].correctAnswer === questions[currentQuestionIndex].options.find(
        (_, i) => !excludedOptions.includes(i)
      );
      
      if (lastAnsweredCorrectly) {
        setTeams(prev => {
          const newTeams = [...prev] as [Team, Team];
          
          const pointsToRemove = 1;
          
          newTeams[currentTeam].score = Math.max(0, Math.round((newTeams[currentTeam].score - pointsToRemove) * 10) / 10);
          
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
    
    setTimer(gameSetup.timePerQuestion);
    setTimerActive(false);
    setCurrentQuestionIndex(prev => prev + 1);
    setExcludedOptions([]);
    setShowAnswer(false);
  };

  const refreshCurrentQuestion = async () => {
    if (!gameStarted || showAnswer || isRefreshingQuestion) return;
    
    setIsRefreshingQuestion(true);
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const newQuestion = await swapQuestion(selectedCategory, currentQuestion, gameSetup.difficulty);
      
      if (newQuestion) {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex] = newQuestion;
        
        setQuestions(newQuestions);
        setTimer(gameSetup.timePerQuestion);
        setTimerActive(false);
        setExcludedOptions([]);
        
        toast.success("تم استبدال السؤال الحالي بنجاح");
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

  // تعريف القدرات الخاصة
  const powerUpsDescription = {
    extraTime: "إضافة وقت: تضيف 15 ثانية إضافية إلى العد التنازلي.",
    doublePoints: "نقاط مضاعفة: تضاعف النقاط التي ستحصل عليها إذا أجبت بشكل صحيح.",
    skipQuestion: "تخطي السؤال: تتيح لك تخطي السؤال الحالي والانتقال للسؤال التالي.",
    joker: "الجوكر: يحذف خيارين خاطئين من الاختيارات المتاحة."
  };

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

      <div className={`min-h-screen p-4 font-cairo theme-bg transition-colors duration-300`}>
        <div className="container mx-auto max-w-4xl">
          <motion.header 
            className="text-center my-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-4">
              <ThemeSelector onThemeChange={handleThemeChange} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold theme-text flex items-center justify-center gap-2 animate-silver-shine">
              <Sparkles className="w-8 h-8 theme-accent" />
              مسابقات المعرفة
              <Sparkles className="w-8 h-8 theme-accent" />
            </h1>
            <p className="text-lg theme-text opacity-70 mt-2">تنافس، تعلم، استمتع</p>
          </motion.header>

          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6 theme-card border theme-border">
              <TabsTrigger value="setup" disabled={gameStarted} className="theme-text data-[state=active]:bg-opacity-20">الإعداد</TabsTrigger>
              <TabsTrigger value="game" disabled={!gameStarted} className="theme-text data-[state=active]:bg-opacity-20">اللعبة</TabsTrigger>
              <TabsTrigger value="results" disabled={currentTab !== "results"} className="theme-text data-[state=active]:bg-opacity-20">النتائج</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-6">
              <Card className="p-6 theme-card border theme-border">
                <h2 className="text-2xl font-bold text-center mb-4 theme-text">إعداد المسابقة</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 theme-text opacity-70">عدد اللاعبين في كل فريق</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={gameSetup.playerCount}
                      onChange={(e) => setGameSetup({...gameSetup, playerCount: parseInt(e.target.value) || 1})}
                      className="text-center theme-border theme-text"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 theme-text opacity-70">اسم الفريق الأول</label>
                      <Input
                        value={gameSetup.team1Name}
                        onChange={(e) => setGameSetup({...gameSetup, team1Name: e.target.value})}
                        className="text-center theme-border theme-text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 theme-text opacity-70">اسم الفريق الثاني</label>
                      <Input
                        value={gameSetup.team2Name}
                        onChange={(e) => setGameSetup({...gameSetup, team2Name: e.target.value})}
                        className="text-center theme-border theme-text"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 theme-text opacity-70">اسم الحكم</label>
                    <Input
                      value={gameSetup.judgeName}
                      onChange={(e) => setGameSetup({...gameSetup, judgeName: e.target.value})}
                      className="text-center theme-border theme-text"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 theme-text opacity-70">عدد الأسئلة</label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min="5"
                        max="30"
                        value={gameSetup.questionCount}
                        onChange={(e) => setGameSetup({...gameSetup, questionCount: parseInt(e.target.value) || 10})}
                        className="text-center theme-border theme-text"
                      />
                      <span className="mr-2 theme-text">سؤال</span>
                    </div>
                    <p className="text-xs theme-text opacity-50 mt-1">يمكنك اختيار من 5 إلى 30 سؤال</p>
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-sm font-medium mb-1 theme-text opacity-70">
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
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs theme-text opacity-50">
                      <span>سهل</span>
                      <span>متوسط</span>
                      <span>صعب</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-sm font-medium mb-1 theme-text opacity-70">
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
                      className="py-4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text opacity-70">اختر فئة الأسئلة</label>
                    <select 
                      className="w-full p-2 border rounded-md text-center theme-border theme-card theme-text"
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

                  <Card className="p-4 theme-card border theme-border rounded-lg">
                    <h3 className="text-lg font-bold text-center mb-3 theme-text flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" />
                      مميزات اللعبة
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-2 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 theme-icon" />
                          <span className="theme-text">مكافأة السلسلة</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.streakBonus} 
                          onCheckedChange={() => toggleFeature('streakBonus')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Timer className="w-4 h-4 mr-2 theme-icon" />
                          <span className="theme-text">مكافأة الوقت</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.timeBonus} 
                          onCheckedChange={() => toggleFeature('timeBonus')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 mr-2 theme-icon" />
                          <span className="theme-text">تأثيرات الاحتفال</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.confettiEffects} 
                          onCheckedChange={() => toggleFeature('confettiEffects')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Gavel className="w-4 h-4 mr-2 theme-icon" />
                          <span className="theme-text">وظيفة الحكم</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.judgeFunctionality} 
                          onCheckedChange={() => toggleFeature('judgeFunctionality')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 theme-icon" />
                          <span className="theme-text">القدرات الخاصة</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.powerUps} 
                          onCheckedChange={() => toggleFeature('powerUps')}
                        />
                      </div>
                    </div>
                    
                    {gameFeatures.powerUps && (
                      <div className="mt-4 p-3 border theme-border rounded-lg theme-bg bg-opacity-50">
                        <h4 className="text-sm font-bold mb-2 theme-text">القدرات الخاصة المتاحة:</h4>
                        <ul className="text-xs space-y-1 theme-text opacity-80">
                          <li>• {powerUpsDescription.extraTime}</li>
                          <li>• {powerUpsDescription.doublePoints}</li>
                          <li>• {powerUpsDescription.skipQuestion}</li>
                          <li>• {powerUpsDescription.joker}</li>
                        </ul>
                      </div>
                    )}
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Button 
                      onClick={handleStartGame} 
                      className="text-xl py-6 theme-button theme-text"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      توليد الأسئلة تلقائياً
                    </Button>
                    
                    <Button 
                      onClick={() => setShowManualQuestionForm(true)}
                      className="text-xl py-6 theme-button theme-text"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      إضافة أسئلة يدوياً
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="game">
              {gameStarted && questions.length > 0 && (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {teams.map((team, index) => (
                      <Card 
                        key={index} 
                        className={`p-4 theme-card border theme-border ${currentTeam === index ? 'ring-2 ring-inset ring-offset-2 theme-border' : ''}`}
                      >
                        <h3 className="text-lg font-bold mb-1 theme-text">{team.name}</h3>
                        <div className="text-3xl font-bold theme-text">
                          {team.score}
                          {team.bonusPoints > 0 && gameFeatures.timeBonus && (
                            <span className="text-sm theme-text opacity-70 ml-1">
                              (+{team.bonusPoints})
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center gap-1 text-sm mt-1 theme-text opacity-70">
                          <span>سلسلة: {team.streak} {gameFeatures.streakBonus && team.streak >= 3 && '🔥'}</span>
                          {gameFeatures.streakBonus && team.streak >= 3 && (
                            <span className="theme-text">× {getStreakMultiplier(index)}</span>
                          )}
                        </div>
                        
                        <div className="text-sm mt-1 flex items-center justify-center gap-2 theme-text opacity-70">
                          <span>
                            الجوكر: {team.jokers} {team.jokers > 0 && currentTeam === index && !showAnswer && gameFeatures.powerUps && (
                              <button 
                                onClick={useJoker} 
                                disabled={team.jokers <= 0 || excludedOptions.length > 0}
                                className="underline theme-text"
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
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={powerUpsAvailable.extraTime[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('extraTime')}
                        className="flex flex-col items-center py-2 h-auto theme-border"
                      >
                        <Timer className="h-5 w-5 mb-1" />
                        <span>وقت إضافي</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.extraTime[currentTeam]})</span>
                      </Button>
                      
                      <Button
                        variant={powerUpsAvailable.doublePoints[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('doublePoints')}
                        className="flex flex-col items-center py-2 h-auto theme-border"
                      >
                        <Star className="h-5 w-5 mb-1" />
                        <span>نقاط مضاعفة</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.doublePoints[currentTeam]})</span>
                      </Button>
                      
                      <Button
                        variant={powerUpsAvailable.skipQuestion[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('skipQuestion')}
                        className="flex flex-col items-center py-2 h-auto theme-border"
                      >
                        <Award className="h-5 w-5 mb-1" />
                        <span>تخطي السؤال</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
                      </Button>
                    </div>
                  )}

                  <Card className="p-6 theme-card border theme-border">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm theme-text opacity-70">
                        سؤال {currentQuestionIndex + 1} من {questions.length}
                      </div>
                      <div className="text-xl font-bold theme-text">
                        دور: {teams[currentTeam].name}
                      </div>
                      <div className={`
                        text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center
                        ${!timerActive ? 'bg-opacity-30 theme-border theme-text' : 
                           timer <= 10 ? 'bg-red-900/30 text-red-300 animate-pulse' : 
                           'bg-opacity-30 theme-border theme-text'}
                      `}>
                        {timer}
                      </div>
                    </div>

                    <div className="flex justify-center items-center">
                      <h3 className="text-2xl font-bold text-center my-6 leading-relaxed theme-text">
                        {questions[currentQuestionIndex].question}
                      </h3>
                      
                      {!showAnswer && !timerActive && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={refreshCurrentQuestion}
                          disabled={isRefreshingQuestion}
                          className="ml-2 theme-border"
                          title="استبدل هذا السؤال"
                        >
                          <RefreshCw className={`h-4 w-4 theme-icon ${isRefreshingQuestion ? 'animate-spin' : ''}`} />
                        </Button>
                      )}
                    </div>
                    
                    {!timerActive && !showAnswer && (
                      <div className="mb-6">
                        <Button 
                          onClick={handleStartTimer}
                          className="w-full py-4 flex items-center justify-center gap-2 theme-button theme-text"
                        >
                          <Play className="w-5 h-5" />
                          <span className="text-lg">بدء الوقت</span>
                        </Button>
                      </div>
                    )}
                    
                    {!showAnswer ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          {questions[currentQuestionIndex].options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswerSelect(option)}
                              disabled={excludedOptions.includes(index) || timer === 0 || !timerActive}
                              className={`
                                p-4 rounded-lg text-center text-lg transition-all relative overflow-hidden
                                ${!timerActive ? 'bg-opacity-30 theme-card theme-text opacity-60' : excludedOptions.includes(index) 
                                  ? 'bg-opacity-30 theme-card theme-text opacity-60 line-through' 
                                  : 'theme-card hover:bg-opacity-50 theme-text'
                                }
                              `}
                              whileHover={{ scale: (!timerActive || excludedOptions.includes(index)) ? 1 : 1.02 }}
                            >
                              {!excludedOptions.includes(index) && timerActive && (
                                <motion.div 
                                  className="absolute bottom-0 left-0 right-0 h-1 theme-progress"
                                  initial={{ scaleX: 1 }}
                                  animate={{ scaleX: timer / gameSetup.timePerQuestion }}
                                  transition={{ duration: 0.5 }}
                                  style={{ transformOrigin: "left" }}
                                />
                              )}
                              {option}
                            </motion.button>
                          ))}
                        </div>
                        
                        {timerActive && gameFeatures.timeBonus && (
                          <div className="mt-4 text-center text-sm theme-text opacity-70">
                            نقاط الوقت: <span className="theme-text">+{calculateTimeBonus()}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mt-6 space-y-6">
                        <div className="text-center text-xl mb-4 theme-text">الإجابة الصحيحة:</div>
                        <div className="theme-card p-4 rounded-lg text-center text-xl font-bold theme-text border theme-border ring-2 ring-offset-2 ring-offset-transparent theme-border">
                          {questions[currentQuestionIndex].correctAnswer}
                        </div>
                      </div>
                    )}
                  </Card>
                  
                  {gameFeatures.judgeFunctionality && (
                    <Judge 
                      name={gameSetup.judgeName}
                      onApproveAnswer={() => handleJudgeDecision(true)}
                      onRejectAnswer={() => handleJudgeDecision(false)}
                      onNextQuestion={nextQuestion}
                      isDisabled={!showAnswer}
                      showAnswer={showAnswer}
                    />
                  )}
                  
                  {!gameFeatures.judgeFunctionality && showAnswer && (
                    <motion.button
                      onClick={nextQuestion}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-full py-3 px-4 rounded-lg text-center theme-button theme-text relative overflow-hidden"
                    >
                      <motion.div 
                        className="absolute inset-0 bg-white/5"
                        animate={{ 
                          x: ["100%", "-100%"],
                        }}
                        transition={{ 
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 1.5,
                          ease: "linear"
                        }}
                      />
                      <span className="flex items-center justify-center gap-2">
                        <ArrowRight className="w-5 h-5" />
                        السؤال التالي
                      </span>
                    </motion.button>
                  )}

                  <Button 
                    onClick={resetGame} 
                    variant="outline" 
                    className="w-full theme-border theme-text"
                  >
                    إنهاء اللعبة
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="results">
              <Card className="p-6 theme-card border theme-border">
                <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 theme-text">
                  <Trophy className="w-6 h-6 theme-icon" />
                  نتائج المسابقة
                  <Trophy className="w-6 h-6 theme-icon" />
                </h2>
                
                <div className="grid grid-cols-2 gap-8 text-center mb-8">
                  {teams.map((team, index) => {
                    const isWinner = teams[0].score === teams[1].score 
                      ? false 
                      : team.score === Math.max(teams[0].score, teams[1].score);
                    const isTie = teams[0].score === teams[1].score;
                    
                    return (
                      <motion.div 
                        key={index} 
                        className={`
                          p-6 rounded-lg relative overflow-hidden theme-card
                          ${isTie 
                            ? 'border theme-border' 
                            : isWinner
                              ? 'border-2 theme-border' 
                              : 'border theme-border opacity-80'
                          }
                        `}
                        animate={isWinner ? {
                          boxShadow: ["0px 0px 0px rgba(234, 179, 8, 0)", "0px 0px 15px rgba(234, 179, 8, 0.5)", "0px 0px 0px rgba(234, 179, 8, 0)"]
                        } : {}}
                        transition={{ duration: 2, repeat: isWinner ? Infinity : 0 }}
                      >
                        {isWinner && (
                          <motion.div 
                            className="absolute -top-2 -left-2"
                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Medal className="w-10 h-10 theme-icon" />
                          </motion.div>
                        )}
                        
                        <h3 className="text-xl font-bold mb-3 theme-text">{team.name}</h3>
                        <div className="text-5xl font-bold mb-3 theme-text">
                          {team.score}
                        </div>
                        
                        {team.bonusPoints > 0 && gameFeatures.timeBonus && (
                          <div className="text-sm theme-text opacity-70 mb-2">
                            نقاط إضافية: +{team.bonusPoints}
                          </div>
                        )}
                        
                        <div className="text-lg theme-text">
                          {isTie 
                            ? 'تعادل 🤝' 
                            : isWinner 
                              ? (
                                <div className="flex items-center justify-center gap-1">
                                  <span>فائز!</span>
                                  <Sparkles className="w-5 h-5 theme-icon" />
                                </div>
                              )
                              : 'خاسر'
                          }
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="mt-8 space-y-4">
                  {gameFeatures.judgeFunctionality && (
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 theme-text text-lg">
                        <Gavel className="w-5 h-5 theme-icon" />
                        <span>الحكم: {gameSetup.judgeName}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Button 
                      onClick={showPunishment}
                      className="py-6 theme-button theme-text"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      <span>عرض العقاب</span>
                    </Button>
                    
                    <Button 
                      onClick={resetGame} 
                      className="py-6 theme-button theme-text"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      <span>لعبة جديدة</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Index;
