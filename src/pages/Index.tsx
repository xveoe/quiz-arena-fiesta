
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Intro from "@/components/Intro";
import LoadingQuestions from "@/components/LoadingQuestions";
import { generateQuestions, categories, resetUsedQuestions, swapQuestion } from "@/services/questionService";
import Judge from "@/components/Judge";
import ManualQuestionForm from "@/components/ManualQuestionForm";
import PunishmentBox from "@/components/PunishmentBox";
import { ThemeType } from "@/components/ThemeSelector";
import { Sparkles, Timer, Award, Star, Play, Gavel, Edit, Settings, Zap, ArrowRight } from 'lucide-react';
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
  
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('silver');
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
          // Deduct both the regular point and any time bonus points
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

      <div className={`min-h-screen py-2 px-3 font-cairo theme-bg transition-colors duration-300`}>
        <div className="container mx-auto max-w-md">
          <motion.header 
            className="text-center my-4 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold theme-text flex items-center justify-center gap-1 animate-silver-shine">
              <Sparkles className="w-6 h-6 theme-accent" />
              مسابقات المعرفة
              <Sparkles className="w-6 h-6 theme-accent" />
            </h1>
            <p className="text-sm theme-text opacity-70 mt-1">تنافس، تعلم، استمتع</p>
          </motion.header>

          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4 theme-card border theme-border">
              <TabsTrigger value="setup" disabled={gameStarted} className="theme-text data-[state=active]:bg-opacity-20 text-sm py-1.5">الإعداد</TabsTrigger>
              <TabsTrigger value="game" disabled={!gameStarted} className="theme-text data-[state=active]:bg-opacity-20 text-sm py-1.5">اللعبة</TabsTrigger>
              <TabsTrigger value="results" disabled={currentTab !== "results"} className="theme-text data-[state=active]:bg-opacity-20 text-sm py-1.5">النتائج</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <Card className="p-4 theme-card border theme-border">
                <h2 className="text-xl font-bold text-center mb-3 theme-text">إعداد المسابقة</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 theme-text opacity-70">عدد اللاعبين في كل فريق</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={gameSetup.playerCount}
                      onChange={(e) => setGameSetup({...gameSetup, playerCount: parseInt(e.target.value) || 1})}
                      className="text-center theme-border theme-text h-8 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 theme-text opacity-70">اسم الفريق الأول</label>
                      <Input
                        value={gameSetup.team1Name}
                        onChange={(e) => setGameSetup({...gameSetup, team1Name: e.target.value})}
                        className="text-center theme-border theme-text h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 theme-text opacity-70">اسم الفريق الثاني</label>
                      <Input
                        value={gameSetup.team2Name}
                        onChange={(e) => setGameSetup({...gameSetup, team2Name: e.target.value})}
                        className="text-center theme-border theme-text h-8 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 theme-text opacity-70">اسم الحكم</label>
                    <Input
                      value={gameSetup.judgeName}
                      onChange={(e) => setGameSetup({...gameSetup, judgeName: e.target.value})}
                      className="text-center theme-border theme-text h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 theme-text opacity-70">عدد الأسئلة</label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min="5"
                        max="30"
                        value={gameSetup.questionCount}
                        onChange={(e) => setGameSetup({...gameSetup, questionCount: parseInt(e.target.value) || 10})}
                        className="text-center theme-border theme-text h-8 text-sm"
                      />
                      <span className="mr-2 theme-text text-sm">سؤال</span>
                    </div>
                    <p className="text-xs theme-text opacity-50 mt-0.5">يمكنك اختيار من 5 إلى 30 سؤال</p>
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-xs font-medium mb-1 theme-text opacity-70">
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
                    <div className="flex justify-between text-xs theme-text opacity-50">
                      <span>سهل</span>
                      <span>متوسط</span>
                      <span>صعب</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-xs font-medium mb-1 theme-text opacity-70">
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
                    <label className="block text-xs font-medium mb-1 theme-text opacity-70">اختر فئة الأسئلة</label>
                    <select 
                      className="w-full p-1.5 border rounded-md text-center theme-border theme-card theme-text text-sm"
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

                  <Card className="p-2.5 theme-card border theme-border rounded-lg">
                    <h3 className="text-sm font-bold text-center mb-2 theme-text flex items-center justify-center gap-1">
                      <Settings className="w-3 h-3" />
                      مميزات اللعبة
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center justify-between p-1.5 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Zap className="w-3 h-3 mr-1 theme-icon" />
                          <span className="theme-text text-xs">مكافأة السلسلة</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.streakBonus} 
                          onCheckedChange={() => toggleFeature('streakBonus')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-1.5 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Timer className="w-3 h-3 mr-1 theme-icon" />
                          <span className="theme-text text-xs">مكافأة الوقت</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.timeBonus} 
                          onCheckedChange={() => toggleFeature('timeBonus')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-1.5 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Sparkles className="w-3 h-3 mr-1 theme-icon" />
                          <span className="theme-text text-xs">تأثيرات الاحتفال</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.confettiEffects} 
                          onCheckedChange={() => toggleFeature('confettiEffects')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-1.5 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Gavel className="w-3 h-3 mr-1 theme-icon" />
                          <span className="theme-text text-xs">وظيفة الحكم</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.judgeFunctionality} 
                          onCheckedChange={() => toggleFeature('judgeFunctionality')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-1.5 border theme-border rounded-lg theme-card bg-opacity-30">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1 theme-icon" />
                          <span className="theme-text text-xs">القدرات الخاصة</span>
                        </div>
                        <Switch 
                          checked={gameFeatures.powerUps} 
                          onCheckedChange={() => toggleFeature('powerUps')}
                        />
                      </div>
                    </div>
                    
                    {gameFeatures.powerUps && (
                      <div className="mt-3 p-2 border theme-border rounded-lg theme-bg bg-opacity-50">
                        <h4 className="text-xs font-bold mb-1 theme-text">القدرات الخاصة المتاحة:</h4>
                        <ul className="text-[10px] space-y-0.5 theme-text opacity-80">
                          <li>• وقت إضافي: تضيف 15 ثانية للعد التنازلي</li>
                          <li>• نقاط مضاعفة: تضاعف النقاط عند الإجابة الصحيحة</li>
                          <li>• تخطي السؤال: تتيح تخطي السؤال الحالي</li>
                          <li>• الجوكر: يحذف خيارين خاطئين</li>
                        </ul>
                      </div>
                    )}
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3">
                    <Button 
                      onClick={handleStartGame} 
                      className="text-base py-4 theme-button theme-text"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      توليد الأسئلة تلقائياً
                    </Button>
                    
                    <Button 
                      onClick={() => setShowManualQuestionForm(true)}
                      className="text-base py-4 theme-button theme-text"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      إضافة أسئلة يدوياً
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="game">
              {gameStarted && questions.length > 0 && (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-2 gap-3 text-center">
                    {teams.map((team, index) => (
                      <Card 
                        key={index} 
                        className={`p-2.5 theme-card border theme-border ${currentTeam === index ? 'ring-1 ring-inset ring-offset-1 theme-border' : ''}`}
                      >
                        <h3 className="text-sm font-bold mb-0.5 theme-text">{team.name}</h3>
                        <div className="text-2xl font-bold theme-text">
                          {team.score}
                          {team.bonusPoints > 0 && gameFeatures.timeBonus && (
                            <span className="text-xs theme-text opacity-70 ml-1">
                              (+{team.bonusPoints})
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center gap-1 text-xs mt-0.5 theme-text opacity-70">
                          <span>سلسلة: {team.streak} {gameFeatures.streakBonus && team.streak >= 3 && '🔥'}</span>
                          {gameFeatures.streakBonus && team.streak >= 3 && (
                            <span className="theme-text">× {getStreakMultiplier(index)}</span>
                          )}
                        </div>
                        
                        <div className="text-xs mt-0.5 flex items-center justify-center gap-1 theme-text opacity-70">
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
                    <div className="grid grid-cols-3 gap-1">
                      <Button
                        variant={powerUpsAvailable.extraTime[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('extraTime')}
                        className="flex flex-col items-center py-1 h-auto theme-border text-xs"
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
                        className="flex flex-col items-center py-1 h-auto theme-border text-xs"
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
                        className="flex flex-col items-center py-1 h-auto theme-border text-xs"
                        size="sm"
                      >
                        <Award className="h-3 w-3 mb-0.5" />
                        <span>تخطي السؤال</span>
                        <span className="text-[10px] mt-0.5">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="results">
              {/* Results content would go here */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Index;
