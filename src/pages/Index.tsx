
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Intro from "@/components/Intro";
import LoadingQuestions from "@/components/LoadingQuestions";
import { generateQuestions, categories } from "@/services/questionService";
import { Sparkles, ThumbsUp, ThumbsDown, Timer, Trophy, Gift, Medal, Award, Star } from "lucide-react";
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
  const [powerUpsAvailable, setPowerUpsAvailable] = useState({
    extraTime: [2, 2],
    doublePoints: [1, 1],
    skipQuestion: [1, 1]
  });
  
  // Confetti effect function
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handle intro completion
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Update team names from setup
  useEffect(() => {
    setTeams(prev => [
      { ...prev[0], name: gameSetup.team1Name },
      { ...prev[1], name: gameSetup.team2Name }
    ]);
  }, [gameSetup.team1Name, gameSetup.team2Name]);

  // Timer countdown logic
  useEffect(() => {
    if (!gameStarted || timer <= 0 || showAnswer) return;

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          // Time's up handler
          toast.error("انتهى الوقت!");
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, gameStarted, showAnswer]);

  // Start game and generate questions
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

  // Handle answer selection
  const handleAnswerSelect = (option: string) => {
    if (!gameStarted || timer === 0 || showAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    setShowAnswer(true);
    
    if (option === currentQuestion.correctAnswer) {
      // Correct answer
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        
        // Calculate points based on time remaining and streak
        let pointsToAdd = 1;
        
        // Time bonus: up to 0.5 extra points for quick answers
        const timeBonus = Math.round((timer / gameSetup.timePerQuestion) * 0.5 * 10) / 10;
        
        // Streak bonus: consecutive correct answers
        newTeams[currentTeam].streak += 1;
        const streakMultiplier = newTeams[currentTeam].streak >= 3 ? 1.5 : 1;
        
        // Double points power-up
        const doublePointsActive = powerUpsAvailable.doublePoints[currentTeam] < 1;
        const doubleMultiplier = doublePointsActive ? 2 : 1;
        
        // Calculate final points
        pointsToAdd = (pointsToAdd + timeBonus) * streakMultiplier * doubleMultiplier;
        
        // Apply bonus and round to one decimal place
        newTeams[currentTeam].score += Math.round(pointsToAdd * 10) / 10;
        newTeams[currentTeam].bonusPoints += Math.round((pointsToAdd - 1) * 10) / 10;
        
        return newTeams;
      });
      
      toast.success("إجابة صحيحة! 🎉");
      triggerConfetti();
    } else {
      // Wrong answer
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        newTeams[currentTeam].streak = 0; // Reset streak on wrong answer
        return newTeams;
      });
      
      toast.error("إجابة خاطئة! ❌");
    }
    
    // Wait 2 seconds before moving to next question
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      // End of game
      setGameStarted(false);
      setCurrentTab("results");
      return;
    }

    // Switch to next team
    setCurrentTeam(prev => (prev === 0 ? 1 : 0));
    
    // Reset timer and move to next question
    setTimer(gameSetup.timePerQuestion);
    setCurrentQuestionIndex(prev => prev + 1);
    setExcludedOptions([]);
    setShowAnswer(false);
  };

  // Use joker to exclude two wrong options
  const useJoker = () => {
    if (excludedOptions.length > 0 || !gameStarted || showAnswer) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
    
    // Find two wrong options to exclude
    const wrongOptions: number[] = [];
    for (let i = 0; i < currentQuestion.options.length; i++) {
      if (i !== correctAnswerIndex && wrongOptions.length < 2) {
        wrongOptions.push(i);
      }
    }
    
    if (wrongOptions.length === 2) {
      setExcludedOptions(wrongOptions);
      
      // Reduce team's jokers
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
  
  // Use power up
  const usePowerUp = (powerUp: 'extraTime' | 'doublePoints' | 'skipQuestion') => {
    if (!gameStarted || showAnswer) return;
    
    if (powerUp === 'extraTime' && powerUpsAvailable.extraTime[currentTeam] > 0) {
      // Add 15 seconds
      setTimer(prev => prev + 15);
      setPowerUpsAvailable(prev => {
        const newPowerUps = {...prev};
        newPowerUps.extraTime[currentTeam] -= 1;
        return newPowerUps;
      });
      toast.success("تم إضافة 15 ثانية إضافية! ⏱️");
    } 
    else if (powerUp === 'doublePoints' && powerUpsAvailable.doublePoints[currentTeam] > 0) {
      // Next correct answer counts double
      setPowerUpsAvailable(prev => {
        const newPowerUps = {...prev};
        newPowerUps.doublePoints[currentTeam] -= 1;
        return newPowerUps;
      });
      toast.success("النقاط المضاعفة مفعلة للإجابة التالية! 🔥");
    }
    else if (powerUp === 'skipQuestion' && powerUpsAvailable.skipQuestion[currentTeam] > 0) {
      // Skip current question
      setPowerUpsAvailable(prev => {
        const newPowerUps = {...prev};
        newPowerUps.skipQuestion[currentTeam] -= 1;
        return newPowerUps;
      });
      toast.info("تم تخطي السؤال! ⏭️");
      nextQuestion();
    }
  };

  // Reset everything and go back to setup
  const resetGame = () => {
    setGameStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimer(gameSetup.timePerQuestion);
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
  };
  
  // Calculate time bonus display
  const calculateTimeBonus = () => {
    return Math.round((timer / gameSetup.timePerQuestion) * 0.5 * 10) / 10;
  };

  // Get streak multiplier display
  const getStreakMultiplier = (teamIndex: number) => {
    return teams[teamIndex].streak >= 3 ? 1.5 : 1;
  };

  return (
    <>
      {showIntro && <Intro onIntroComplete={handleIntroComplete} />}
      
      {isLoading && <LoadingQuestions />}

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-950 p-4 font-cairo">
        <div className="container mx-auto max-w-4xl">
          <motion.header 
            className="text-center my-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-blue-400 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              مسابقات المعرفة
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">تنافس، تعلم، استمتع</p>
          </motion.header>

          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="setup" disabled={gameStarted}>الإعداد</TabsTrigger>
              <TabsTrigger value="game" disabled={!gameStarted}>اللعبة</TabsTrigger>
              <TabsTrigger value="results" disabled={currentTab !== "results"}>النتائج</TabsTrigger>
            </TabsList>

            {/* Setup Tab */}
            <TabsContent value="setup" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-center mb-4">إعداد المسابقة</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">عدد اللاعبين في كل فريق</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={gameSetup.playerCount}
                      onChange={(e) => setGameSetup({...gameSetup, playerCount: parseInt(e.target.value) || 1})}
                      className="text-center"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">اسم الفريق الأول</label>
                      <Input
                        value={gameSetup.team1Name}
                        onChange={(e) => setGameSetup({...gameSetup, team1Name: e.target.value})}
                        className="text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">اسم الفريق الثاني</label>
                      <Input
                        value={gameSetup.team2Name}
                        onChange={(e) => setGameSetup({...gameSetup, team2Name: e.target.value})}
                        className="text-center"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">عدد الأسئلة</label>
                    <Input
                      type="number"
                      min="5"
                      max="20"
                      value={gameSetup.questionCount}
                      onChange={(e) => setGameSetup({...gameSetup, questionCount: parseInt(e.target.value) || 10})}
                      className="text-center"
                    />
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-sm font-medium mb-1">
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
                    <label className="block text-sm font-medium mb-2">اختر فئة الأسئلة</label>
                    <select 
                      className="w-full p-2 border rounded-md text-center"
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
                  
                  <Button 
                    onClick={handleStartGame} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-xl py-6"
                  >
                    بدء اللعب
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Game Tab */}
            <TabsContent value="game">
              {gameStarted && questions.length > 0 && (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Teams Score */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {teams.map((team, index) => (
                      <Card 
                        key={index} 
                        className={`p-4 ${currentTeam === index ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                      >
                        <h3 className="text-lg font-bold mb-1">{team.name}</h3>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {team.score}
                          {team.bonusPoints > 0 && (
                            <span className="text-sm text-green-600 dark:text-green-400 ml-1">
                              (+{team.bonusPoints})
                            </span>
                          )}
                        </div>
                        
                        {/* Streak indicator */}
                        {team.streak > 0 && (
                          <div className="flex items-center justify-center gap-1 text-sm mt-1">
                            <span>سلسلة: {team.streak} {team.streak >= 3 && '🔥'}</span>
                            {team.streak >= 3 && (
                              <span className="text-amber-500">(×{getStreakMultiplier(index)})</span>
                            )}
                          </div>
                        )}
                        
                        <div className="text-sm mt-1 flex items-center justify-center gap-2">
                          <span>
                            الجوكر: {team.jokers} {team.jokers > 0 && currentTeam === index && !showAnswer && (
                              <button 
                                onClick={useJoker} 
                                disabled={team.jokers <= 0 || excludedOptions.length > 0}
                                className="underline text-blue-600 dark:text-blue-400"
                              >
                                استخدم
                              </button>
                            )}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Power-ups */}
                  {currentTeam !== undefined && (
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={powerUpsAvailable.extraTime[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('extraTime')}
                        className="flex flex-col items-center py-2 h-auto"
                      >
                        <Timer className="h-5 w-5 mb-1" />
                        <span>وقت إضافي</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.extraTime[currentTeam]})</span>
                      </Button>
                      
                      <Button
                        variant={powerUpsAvailable.doublePoints[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('doublePoints')}
                        className="flex flex-col items-center py-2 h-auto"
                      >
                        <Star className="h-5 w-5 mb-1" />
                        <span>نقاط مضاعفة</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.doublePoints[currentTeam]})</span>
                      </Button>
                      
                      <Button
                        variant={powerUpsAvailable.skipQuestion[currentTeam] > 0 ? "outline" : "ghost"}
                        disabled={powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer}
                        onClick={() => usePowerUp('skipQuestion')}
                        className="flex flex-col items-center py-2 h-auto"
                      >
                        <Award className="h-5 w-5 mb-1" />
                        <span>تخطي السؤال</span>
                        <span className="text-xs mt-1">({powerUpsAvailable.skipQuestion[currentTeam]})</span>
                      </Button>
                    </div>
                  )}

                  {/* Current Question */}
                  <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        سؤال {currentQuestionIndex + 1} من {questions.length}
                      </div>
                      <div className="text-xl font-bold">
                        دور: {teams[currentTeam].name}
                      </div>
                      <div className={`
                        text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center
                        ${timer <= 10 ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 animate-pulse' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}
                      `}>
                        {timer}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-center my-6 leading-relaxed">
                      {questions[currentQuestionIndex].question}
                    </h3>
                    
                    {!showAnswer ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          {questions[currentQuestionIndex].options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswerSelect(option)}
                              disabled={excludedOptions.includes(index) || timer === 0}
                              className={`
                                p-4 rounded-lg text-center text-lg transition-all relative overflow-hidden
                                ${excludedOptions.includes(index) 
                                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500 line-through' 
                                  : 'bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm'
                                }
                              `}
                              whileHover={{ scale: excludedOptions.includes(index) ? 1 : 1.02 }}
                            >
                              {/* Time bonus indicator (only show for valid options) */}
                              {!excludedOptions.includes(index) && (
                                <motion.div 
                                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 to-green-500"
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
                        
                        {/* Time bonus indicator */}
                        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          نقاط الوقت: <span className="text-green-600 dark:text-green-400">+{calculateTimeBonus()}</span>
                        </div>
                      </>
                    ) : (
                      <div className="mt-6">
                        <div className="text-center text-xl mb-4">الإجابة الصحيحة:</div>
                        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-center text-xl font-bold text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700">
                          {questions[currentQuestionIndex].correctAnswer}
                        </div>
                      </div>
                    )}
                  </Card>

                  <Button 
                    onClick={resetGame} 
                    variant="outline" 
                    className="w-full"
                  >
                    إنهاء اللعبة
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  نتائج المسابقة
                  <Trophy className="w-6 h-6 text-yellow-500" />
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
                            ? 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800' 
                            : isWinner
                              ? 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900 border-2 border-yellow-400 dark:border-yellow-600' 
                              : 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
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
                        
                        <h3 className="text-xl font-bold mb-3">{team.name}</h3>
                        <div className="text-5xl font-bold mb-3">
                          {team.score}
                        </div>
                        
                        {team.bonusPoints > 0 && (
                          <div className="text-sm text-green-600 dark:text-green-400 mb-2">
                            نقاط إضافية: +{team.bonusPoints}
                          </div>
                        )}
                        
                        <div className="text-lg text-gray-700 dark:text-gray-300">
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
                
                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={resetGame} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    لعبة جديدة
                  </Button>
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
