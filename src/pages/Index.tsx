
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Intro from "@/components/Intro";
import LoadingQuestions from "@/components/LoadingQuestions";
import { generateQuestions, categories } from "@/services/questionService";

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
}

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [gameSetup, setGameSetup] = useState({
    playerCount: 10,
    team1Name: "الفريق الأول",
    team2Name: "الفريق الثاني",
  });
  
  const [currentTab, setCurrentTab] = useState("setup");
  const [teams, setTeams] = useState<[Team, Team]>([
    { name: "الفريق الأول", players: [], score: 0, jokers: 2 },
    { name: "الفريق الثاني", players: [], score: 0, jokers: 2 },
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(45);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [excludedOptions, setExcludedOptions] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!gameStarted || timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, gameStarted]);

  // Start game and generate questions
  const handleStartGame = async () => {
    setIsLoading(true);
    
    try {
      const generatedQuestions = await generateQuestions(selectedCategory);
      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setGameStarted(true);
        setCurrentTab("game");
        setCurrentQuestionIndex(0);
        setTimer(45);
        setCurrentTeam(0);
        setExcludedOptions([]);
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
    if (!gameStarted || timer === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    if (option === currentQuestion.correctAnswer) {
      // Correct answer
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        newTeams[currentTeam].score += 1;
        return newTeams;
      });
      
      toast.success("إجابة صحيحة! 🎉");
      nextQuestion();
    } else {
      // Wrong answer
      toast.error("إجابة خاطئة! ❌");
      nextQuestion();
    }
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
    setTimer(45);
    setCurrentQuestionIndex(prev => prev + 1);
    setExcludedOptions([]);
  };

  // Use joker to exclude two wrong options
  const useJoker = () => {
    if (excludedOptions.length > 0 || !gameStarted) return;
    
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

  // Reset everything and go back to setup
  const resetGame = () => {
    setGameStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimer(45);
    setTeams([
      { name: gameSetup.team1Name, players: [], score: 0, jokers: 2 },
      { name: gameSetup.team2Name, players: [], score: 0, jokers: 2 }
    ]);
    setCurrentTab("setup");
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
            <h1 className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-blue-400">مسابقات المعرفة</h1>
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
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{team.score}</div>
                        <div className="text-sm mt-1">
                          الجوكر: {team.jokers} {team.jokers > 0 && currentTeam === index && (
                            <button 
                              onClick={useJoker} 
                              disabled={team.jokers <= 0 || excludedOptions.length > 0}
                              className="underline text-blue-600 dark:text-blue-400"
                            >
                              استخدم
                            </button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

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
                        ${timer <= 10 ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}
                      `}>
                        {timer}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-center my-6 leading-relaxed">
                      {questions[currentQuestionIndex].question}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {questions[currentQuestionIndex].options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={excludedOptions.includes(index) || timer === 0}
                          className={`
                            p-4 rounded-lg text-center text-lg transition-all
                            ${excludedOptions.includes(index) 
                              ? 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500 line-through' 
                              : 'bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm'
                            }
                          `}
                          whileHover={{ scale: excludedOptions.includes(index) ? 1 : 1.02 }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
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
                <h2 className="text-2xl font-bold text-center mb-6">نتائج المسابقة</h2>
                
                <div className="grid grid-cols-2 gap-8 text-center mb-8">
                  {teams.map((team, index) => (
                    <div key={index} className={`
                      p-6 rounded-lg
                      ${teams[0].score === teams[1].score 
                        ? 'bg-blue-50 dark:bg-blue-950' 
                        : team.score === Math.max(teams[0].score, teams[1].score) 
                          ? 'bg-green-50 dark:bg-green-950 ring-2 ring-green-500' 
                          : 'bg-gray-50 dark:bg-gray-900'
                      }
                    `}>
                      <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                      <div className="text-5xl font-bold mb-2">
                        {team.score}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {teams[0].score === teams[1].score 
                          ? 'تعادل' 
                          : team.score === Math.max(teams[0].score, teams[1].score) 
                            ? 'فائز! 🎉' 
                            : 'خاسر'
                        }
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={resetGame} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  لعبة جديدة
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Index;
