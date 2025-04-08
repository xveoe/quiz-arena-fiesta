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
import { generateQuestions, categories, preGenerateQuestions } from "@/services/questionService";
import Judge from "@/components/Judge";
import ManualQuestionForm from "@/components/ManualQuestionForm";
import PunishmentBox from "@/components/PunishmentBox";
import { Sparkles, ThumbsUp, ThumbsDown, Timer, Trophy, Gift, Medal, Award, Star, Play, Gavel, Plus, Edit, Settings, Bell, Zap, ArrowRight } from "lucide-react";
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
    soundEffects: true,
    confettiEffects: true,
    judgeFunctionality: true,
    powerUps: true
  });
  
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

  const handleStartGame = async () => {
    setIsLoading(true);
    
    try {
      const generatedQuestions = await generateQuestions(selectedCategory, gameSetup.questionCount);
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
      soundEffects: "المؤثرات الصوتية",
      confettiEffects: "تأثيرات الاحتفال",
      judgeFunctionality: "وظيفة الحكم",
      powerUps: "القدرات الخاصة"
    };
    
    return featureNames[feature];
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

      <div className="min-h-screen p-4 font-cairo">
        <div className="container mx-auto max-w-4xl">
          <motion.header 
            className="text-center my-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-silver flex items-center justify-center gap-2 animate-silver-shine">
              <Sparkles className="w-8 h-8 text-zinc-400" />
              مسابقات المعرفة
              <Sparkles className="w-8 h-8 text-zinc-400" />
            </h1>
            <p className="text-lg text-zinc-400 mt-2">تنافس، تعلم، استمتع</p>
          </motion.header>

          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6 bg-zinc-900 border border-zinc-700">
              <TabsTrigger value="setup" disabled={gameStarted} className="data-[state=active]:bg-zinc-800">الإعداد</TabsTrigger>
              <TabsTrigger value="game" disabled={!gameStarted} className="data-[state=active]:bg-zinc-800">اللعبة</TabsTrigger>
              <TabsTrigger value="results" disabled={currentTab !== "results"} className="data-[state=active]:bg-zinc-800">النتائج</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-6">
              <Card className="p-6 luxury-card">
                <h2 className="text-2xl font-bold text-center mb-4 text-silver">إعداد المسابقة</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-400">عدد اللاعبين في كل فريق</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={gameSetup.playerCount}
                      onChange={(e) => setGameSetup({...gameSetup, playerCount: parseInt(e.target.value) || 1})}
                      className="text-center luxury-input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-400">اسم الفريق الأول</label>
                      <Input
                        value={gameSetup.team1Name}
                        onChange={(e) => setGameSetup({...gameSetup, team1Name: e.target.value})}
                        className="text-center luxury-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-400">اسم الفريق الثاني</label>
                      <Input
                        value={gameSetup.team2Name}
                        onChange={(e) => setGameSetup({...gameSetup, team2Name: e.target.value})}
                        className="text-center luxury-input"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-400">اسم الحكم</label>
                    <Input
                      value={gameSetup.judgeName}
                      onChange={(e) => setGameSetup({...gameSetup, judgeName: e.target.value})}
                      className="text-center luxury-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-400">عدد الأسئلة</label>
                    <Input
                      type="number"
                      min="5"
                      max="20"
                      value={gameSetup.questionCount}
                      onChange={(e) => setGameSetup({...gameSetup, questionCount: parseInt(e.target.value) || 10})}
                      className="text-center luxury-input"
                    />
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-sm font-medium mb-1 text-zinc-400">
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
                    <label className="block text-sm font-medium mb-2 text-zinc-400">اختر فئة الأسئلة</label>
                    <select 
                      className="w-full p-2 border rounded-md text-center luxury-input"
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

                  <Card className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <h3 className="text-lg font-bold text-center mb-3 text-silver flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" />
                      مميزات اللعبة
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-2 border border-zinc-800 rounded-lg bg-zinc-900/30">
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                          <span className="text-white">مكافأة السلسلة</span>
                          <p className="text-xs text-zinc-400 ml-2">تكافئ اللاعبين على الإجابات المتتالية الصحيحة</p>
                        </div>
                        <Switch 
                          checked={gameFeatures.streakBonus} 
                          onCheckedChange={() => toggleFeature('streakBonus')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border border-zinc-800 rounded-lg bg-zinc-900/30">
                        <div className="flex items-center">
                          <Timer className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-white">مكافأة الوقت</span>
                          <p className="text-xs text-zinc-400 ml-2">إجابات أسرع = نقاط أكثر</p>
                        </div>
                        <Switch 
                          checked={gameFeatures.timeBonus} 
                          onCheckedChange={() => toggleFeature('timeBonus')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border border-zinc-800 rounded-lg bg-zinc-900/30">
                        <div className="flex items-center">
                          <Bell className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="text-white">المؤثرات الصوتية</span>
                          <p className="text-xs text-zinc-400 ml-2">تفعيل أصوات اللعبة</p>
                        </div>
                        <Switch 
                          checked={gameFeatures.soundEffects} 
                          onCheckedChange={() => toggleFeature('soundEffects')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border border-zinc-800 rounded-lg bg-zinc-900/30">
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                          <span className="text-white">تأثيرات الاحتفال</span>
                          <p className="text-xs text-zinc-400 ml-2">إضافة تأثيرات بصرية للإجابات الصحيحة</p>
                        </div>
                        <Switch 
                          checked={gameFeatures.confettiEffects} 
                          onCheckedChange={() => toggleFeature('confettiEffects')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border border-zinc-800 rounded-lg bg-zinc-900/30">
                        <div className="flex items-center">
                          <Gavel className="w-4 h-4 mr-2 text-red-500" />
                          <span className="text-white">وظيفة الحكم</span>
                          <p className="text-xs text-zinc-400 ml-2">تمكين الحكم من منح النقاط</p>
                        </div>
                        <Switch 
                          checked={gameFeatures.judgeFunctionality} 
                          onCheckedChange={() => toggleFeature('judgeFunctionality')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border border-zinc-800 rounded-lg bg-zinc-900/30">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-white">القدرات الخاصة</span>
                          <p className="text-xs text-zinc-400 ml-2">استخدام وقت إضافي ونقاط مضاعفة</p>
                        </div>
                        <Switch 
                          checked={gameFeatures.powerUps} 
                          onCheckedChange={() => toggleFeature('powerUps')}
                        />
                      </div>
                    </div>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Button 
                      onClick={handleStartGame} 
                      className="text-xl py-6 glow-effect luxury-button"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      توليد الأسئلة تلقائياً
                    </Button>
                    
                    <Button 
                      onClick={() => setShowManualQuestionForm(true)}
                      className="text-xl py-6 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-100"
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
                        className={`p-4 luxury-card ${currentTeam === index ? 'glow-effect border-zinc-400' : ''}`}
                      >
                        <h3 className="text-lg font-bold mb-1 text-silver">{team.name}</h3>
                        <div className="text-3xl font-bold text-zinc-300">
                          {team.score}
                          {team.bonusPoints > 0 && gameFeatures.timeBonus && (
                            <span className="text-sm text-zinc-400 ml-1">
                              (+{team.bonusPoints})
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center gap-1 text-sm mt-1 text-zinc-400">
                          <span>سلسلة: {team.streak} {gameFeatures.streakBonus && team.streak >= 3 && '🔥'}</span>
                          {gameFeatures.streakBonus && team.streak >= 3 && (
                            <span className="text-zinc-300">(×{getStreakMultiplier(index)})</span>
                          )}
                        </div>
                        
                        <div className="text-sm mt-1 flex items-center justify-center gap-2 text-zinc-400">
                          <span>
                            الجوكر: {team.jokers} {team.jokers > 0 && currentTeam === index && !showAnswer && gameFeatures.powerUps && (
                              <button 
                                onClick={useJoker} 
                                disabled={team.jokers <= 0 || excludedOptions.length > 0}
                                className="underline text-zinc-300"
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
                        className="flex flex-col items-center py-2 h-auto luxury-button"
                      >
                        <Timer className="h-5 w-5 mb-1" />
                        <span>وقت إضافي</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.extraTime[currentTeam]})</span>
                      </Button>
                      
                      <Button
                        variant={powerUpsAvailable.doublePoints[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('doublePoints')}
                        className="flex flex-col items-center py-2 h-auto luxury-button"
                      >
                        <Star className="h-5 w-5 mb-1" />
                        <span>نقاط مضاعفة</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.doublePoints[currentTeam]})</span>
                      </Button>
                      
                      <Button
                        variant={powerUpsAvailable.skipQuestion[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('skipQuestion')}
                        className="flex flex-col items-center py-2 h-auto luxury-button"
                      >
                        <Award className="h-5 w-5 mb-1" />
                        <span>تخطي السؤال</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
                      </Button>
                    </div>
                  )}

                  <Card className="p-6 luxury-card">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-zinc-400">
                        سؤال {currentQuestionIndex + 1} من {questions.length}
                      </div>
                      <div className="text-xl font-bold text-silver">
                        دور: {teams[currentTeam].name}
                      </div>
                      <div className={`
                        text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center
                        ${!timerActive ? 'bg-zinc-800 text-silver' : 
                           timer <= 10 ? 'bg-red-900/30 text-red-300 animate-pulse' : 
                           'bg-zinc-800 text-silver'}
                      `}>
                        {timer}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-center my-6 leading-relaxed text-silver">
                      {questions[currentQuestionIndex].question}
                    </h3>
                    
                    {!timerActive && !showAnswer && (
                      <div className="mb-6">
                        <Button 
                          onClick={handleStartTimer}
                          className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-green-100"
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
                                ${!timerActive ? 'bg-zinc-900 text-zinc-600' : excludedOptions.includes(index) 
                                  ? 'bg-zinc-900 text-zinc-600 line-through' 
                                  : 'bg-zinc-800 hover:bg-zinc-700 text-silver'
                                }
                              `}
                              whileHover={{ scale: (!timerActive || excludedOptions.includes(index)) ? 1 : 1.02 }}
                            >
                              {!excludedOptions.includes(index) && timerActive && (
                                <motion.div 
                                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-500 to-zinc-300"
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
                          <div className="mt-4 text-center text-sm text-zinc-400">
                            نقاط الوقت: <span className="text-zinc-300">+{calculateTimeBonus()}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mt-6 space-y-6">
                        <div className="text-center text-xl mb-4 text-silver">الإجابة الصحيحة:</div>
                        <div className="bg-zinc-800 p-4 rounded-lg text-center text-xl font-bold text-green-300 border border-zinc-600 glow-effect">
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
                      className="w-full py-3 px-4 rounded-lg text-center bg-gradient-to-r from-blue-900 to-blue-800 text-blue-300 hover:from-blue-800 hover:to-blue-700 transition-all duration-200 relative overflow-hidden"
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
                    className="w-full luxury-button"
                  >
                    إنهاء اللعبة
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="results">
              <Card className="p-6 luxury-card">
                <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-silver">
                  <Trophy className="w-6 h-6 text-zinc-400" />
                  نتائج المسابقة
                  <Trophy className="w-6 h-6 text-zinc-400" />
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
                          p-6 rounded-lg relative overflow-hidden
                          ${isTie 
                            ? 'bg-blue-950/30 border border-blue-800/50' 
                            : isWinner
                              ? 'bg-gradient-to-br from-amber-950/30 to-yellow-900/30 border-2 border-yellow-700/50' 
                              : 'bg-gray-900/30 border border-gray-800/50'
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
                            <Medal className="w-10 h-10 text-yellow-500" />
                          </motion.div>
                        )}
                        
                        <h3 className="text-xl font-bold mb-3 text-silver">{team.name}</h3>
                        <div className="text-5xl font-bold mb-3 text-silver">
                          {team.score}
                        </div>
                        
                        {team.bonusPoints > 0 && gameFeatures.timeBonus && (
                          <div className="text-sm text-green-400 mb-2">
                            نقاط إضافية: +{team.bonusPoints}
                          </div>
                        )}
                        
                        <div className="text-lg text-silver">
                          {isTie 
                            ? 'تعادل 🤝' 
                            : isWinner 
                              ? (
                                <div className="flex items-center justify-center gap-1">
                                  <span>فائز!</span>
                                  <Sparkles className="w-5 h-5 text-yellow-500" />
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
                      <div className="flex items-center gap-2 text-silver text-lg">
                        <Gavel className="w-5 h-5 text-zinc-400" />
                        <span>الحكم: {gameSetup.judgeName}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Button 
                      onClick={showPunishment}
                      className="py-6 bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 hover:to-purple-800 text-purple-100"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      <span>عرض العقاب</span>
                    </Button>
                    
                    <Button 
                      onClick={resetGame} 
                      className="py-6 luxury-button glow-effect"
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
