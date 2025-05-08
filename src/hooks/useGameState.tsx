import { useState, useEffect } from 'react';
import confetti from "canvas-confetti";
import { resetUsedQuestions, swapQuestion, generateQuestions } from "@/services/questionService";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Team {
  name: string;
  players: string[];
  score: number;
  jokers: number;
  streak: number;
  bonusPoints: number;
}

export interface GameSetup {
  playerCount: number;
  team1Name: string;
  team2Name: string;
  questionCount: number;
  difficulty: number;
  timePerQuestion: number;
  judgeName: string;
}

export interface GameFeatures {
  streakBonus: boolean;
  timeBonus: boolean;
  confettiEffects: boolean;
  judgeFunctionality: boolean;
  powerUps: boolean;
}

export type GameView = 'teams' | 'question' | 'judge';
export type SetupStep = 'settings' | 'features' | 'loading';

const useGameState = () => {
  const [gameSetup, setGameSetup] = useState<GameSetup>({
    playerCount: 10,
    team1Name: "الفريق الأول",
    team2Name: "الفريق الثاني",
    questionCount: 10,
    difficulty: 50,
    timePerQuestion: 45,
    judgeName: "الحكم",
  });
  
  const [gameFeatures, setGameFeatures] = useState<GameFeatures>({
    streakBonus: true,
    timeBonus: true,
    confettiEffects: false,  // Turned off as per request
    judgeFunctionality: true,
    powerUps: true
  });
  
  const [currentTab, setCurrentTab] = useState("setup");
  const [teams, setTeams] = useState<[Team, Team]>([
    { name: "الفريق الأول", players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 },
    { name: "الفريق الثاني", players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 },
  ]);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["general"]);
  const [customCategories, setCustomCategories] = useState<{[key: string]: string}>({});
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(45);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [excludedOptions, setExcludedOptions] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [powerUpsAvailable, setPowerUpsAvailable] = useState<{
    extraTime: [number, number];
    doublePoints: [number, number];
    skipQuestion: [number, number];
  }>({
    extraTime: [2, 2],
    doublePoints: [1, 1],
    skipQuestion: [1, 1]
  });
  
  const [showManualQuestionForm, setShowManualQuestionForm] = useState(false);
  const [showPunishmentBox, setShowPunishmentBox] = useState(false);
  const [losingTeamIndex, setLosingTeamIndex] = useState<number | null>(null);
  
  const [isRefreshingQuestion, setIsRefreshingQuestion] = useState(false);
  const [transitionType, setTransitionType] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [gameView, setGameView] = useState<GameView>('teams');
  
  const [setupStep, setSetupStep] = useState<SetupStep>('settings');
  const [doublePointsActive, setDoublePointsActive] = useState<[boolean, boolean]>([false, false]);
  
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
          setTimerActive(false);
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

  const changeTransitionType = () => {
    const newType = Math.floor(Math.random() * 5); // Assuming 5 transition types
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

  const handleStartGame = async () => {
    setIsLoading(true);
    
    try {
      resetUsedQuestions();
      
      // Use all selected categories for generating questions
      let allQuestions: Question[] = [];
      
      // Calculate how many questions to get from each category
      const questionsPerCategory = Math.ceil(gameSetup.questionCount / selectedCategories.length);
      
      // Generate questions from each selected category
      for (const category of selectedCategories) {
        // Check if this is a custom category
        if (category.startsWith('custom-')) {
          const categoryName = customCategories[category] || "general";
          const categoryQuestions = await generateQuestions(
            category,
            questionsPerCategory,
            gameSetup.difficulty,
            categoryName // Pass the custom category name
          );
          allQuestions = [...allQuestions, ...categoryQuestions];
        } else {
          const categoryQuestions = await generateQuestions(
            category,
            questionsPerCategory,
            gameSetup.difficulty
          );
          allQuestions = [...allQuestions, ...categoryQuestions];
        }
      }
      
      // Trim to exact question count if we got too many
      if (allQuestions.length > gameSetup.questionCount) {
        allQuestions = allQuestions.slice(0, gameSetup.questionCount);
      }
      
      // Shuffle the questions to mix categories
      const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
      
      if (shuffledQuestions.length > 0) {
        setQuestions(shuffledQuestions);
        setGameStarted(true);
        setCurrentTab("game");
        setCurrentQuestionIndex(0);
        setTimer(gameSetup.timePerQuestion);
        setTimerActive(false);
        setCurrentTeam(0);
        setExcludedOptions([]);
        setShowAnswer(false);
        setGameView('teams');
        // Reset team scores and stats
        setTeams([
          { name: gameSetup.team1Name, players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 },
          { name: gameSetup.team2Name, players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 }
        ]);
        setDoublePointsActive([false, false]);
      } else {
        setSetupStep('settings');
      }
    } catch (error) {
      setSetupStep('settings');
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
    // Reset team scores and stats
    setTeams([
      { name: gameSetup.team1Name, players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 },
      { name: gameSetup.team2Name, players: [], score: 0, jokers: 2, streak: 0, bonusPoints: 0 }
    ]);
    setDoublePointsActive([false, false]);
  };

  const handleStartTimer = () => {
    setTimerActive(true);
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
        
        // Calculate time bonus correctly
        let timeBonus = 0;
        if (gameFeatures.timeBonus) {
          timeBonus = Math.round((timer / gameSetup.timePerQuestion) * 0.5 * 10) / 10;
        }
        
        // Update streak and apply streak multiplier if applicable
        newTeams[currentTeam].streak += 1;
        let streakMultiplier = 1;
        if (gameFeatures.streakBonus && newTeams[currentTeam].streak >= 3) {
          streakMultiplier = 1.5;
        }
        
        // Apply double points if active
        let doubleMultiplier = 1;
        if (doublePointsActive[currentTeam]) {
          doubleMultiplier = 2;
        }
        
        // Calculate total points with all multipliers
        pointsToAdd = (pointsToAdd + timeBonus) * streakMultiplier * doubleMultiplier;
        
        // Update score and bonus points
        newTeams[currentTeam].score = Math.round((newTeams[currentTeam].score + pointsToAdd) * 10) / 10;
        newTeams[currentTeam].bonusPoints = Math.round((newTeams[currentTeam].bonusPoints + timeBonus) * 10) / 10;
        
        return newTeams;
      });
      
      triggerConfetti();
    } else {
      setTeams(prev => {
        const newTeams = [...prev] as [Team, Team];
        newTeams[currentTeam].streak = 0;
        return newTeams;
      });
    }
  };

  const handleJudgeDecision = (isCorrect: boolean) => {
    if (!showAnswer || !gameFeatures.judgeFunctionality) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Check if the answer was already marked correct via normal means
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
    }
  };

  const handleJudgeDeductPoints = (points: number, teamIndex?: number) => {
    if (!gameFeatures.judgeFunctionality) return;
    
    setTeams(prev => {
      const newTeams = [...prev] as [Team, Team];
      // If teamIndex is provided, deduct from that team, otherwise use current team
      const targetTeam = teamIndex !== undefined ? teamIndex : currentTeam;
      newTeams[targetTeam].score = Math.max(0, Math.round((newTeams[targetTeam].score - points) * 10) / 10);
      return newTeams;
    });
  };

  const nextQuestion = () => {
    // If this is the last question, show results
    if (currentQuestionIndex >= questions.length - 1) {
      setCurrentTab("results"); 
      
      // Important: We need to keep gameStarted true until we actually show the results
      // This fixes the issue where clicking "Next Question" on the last question goes back to setup
      
      if (teams[0].score !== teams[1].score) {
        const losingIndex = teams[0].score < teams[1].score ? 0 : 1;
        setLosingTeamIndex(losingIndex);
      }
      return;
    }

    // Switch to the other team for next question
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
      // Use the first selected category for consistency when swapping questions
      const category = selectedCategories[0]; 
      const newQuestion = await swapQuestion(category, currentQuestion, gameSetup.difficulty);
      
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
        }, 300);
      }
    } catch (error) {
      console.error("خطأ أثناء تبديل السؤال:", error);
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
    } 
    else if (powerUp === 'doublePoints' && powerUpsAvailable.doublePoints[currentTeam] > 0) {
      setDoublePointsActive(prev => {
        const newDoublePoints = [...prev] as [boolean, boolean];
        newDoublePoints[currentTeam] = true;
        return newDoublePoints;
      });
      
      setPowerUpsAvailable(prev => {
        const newPowerUps = {...prev};
        newPowerUps.doublePoints[currentTeam] -= 1;
        return newPowerUps;
      });
    }
    else if (powerUp === 'skipQuestion' && powerUpsAvailable.skipQuestion[currentTeam] > 0) {
      setPowerUpsAvailable(prev => {
        const newPowerUps = {...prev};
        newPowerUps.skipQuestion[currentTeam] -= 1;
        return newPowerUps;
      });
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
    setDoublePointsActive([false, false]);
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
    
    // This is the correct way to handle ending the game
    setCurrentTab("results");
    
    if (teams[0].score !== teams[1].score) {
      const losingIndex = teams[0].score < teams[1].score ? 0 : 1;
      setLosingTeamIndex(losingIndex);
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
    }
  };

  const toggleFeature = (feature: keyof typeof gameFeatures) => {
    setGameFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };
  
  const getFeatureName = (feature: keyof typeof gameFeatures): string => {
    const featureNames: Record<keyof typeof gameFeatures, string> = {
      streakBonus: "مكافأة ا��سلسلة",
      timeBonus: "مكافأة الوقت",
      confettiEffects: "تأثيرات الاحتفال",
      judgeFunctionality: "وظيفة الحكم",
      powerUps: "القدرات الخاصة"
    };
    
    return featureNames[feature];
  };

  const handleAdvanceSetup = () => {
    if (setupStep === 'settings') {
      setSetupStep('features');
    } else if (setupStep === 'features') {
      setSetupStep('loading');
      handleStartGame();
    }
  };

  const setGameSetupValue = (newValue: SetupStep | Partial<GameSetup>) => {
    if (typeof newValue === 'string') {
      setSetupStep(newValue as SetupStep);
    } else {
      setGameSetup(prevState => ({
        ...prevState,
        ...newValue
      }));
    }
  };

  // Updated to toggle category selection and handle custom categories
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Don't remove if it's the last category
        if (prev.length <= 1) return prev;
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const addCustomCategory = (categoryName: string) => {
    // Generate a unique ID for this custom category
    const categoryId = `custom-${Date.now()}`;
    
    // Store the mapping between ID and category name
    setCustomCategories(prev => ({
      ...prev,
      [categoryId]: categoryName
    }));
    
    // Add this category to selected categories
    setSelectedCategories(prev => [...prev, categoryId]);
    
    return categoryId;
  };

  return {
    gameSetup,
    setGameSetup: setGameSetupValue,
    gameFeatures,
    currentTab,
    setCurrentTab,
    teams,
    setTeams,
    selectedCategories,
    toggleCategory,
    questions,
    setQuestions,
    currentQuestionIndex,
    timer,
    currentTeam,
    excludedOptions,
    gameStarted,
    isLoading,
    showAnswer,
    timerActive,
    powerUpsAvailable,
    doublePointsActive,
    showManualQuestionForm,
    setShowManualQuestionForm,
    showPunishmentBox,
    losingTeamIndex,
    isRefreshingQuestion,
    transitionType,
    showQuestion,
    gameView,
    setupStep,
    setSetupStep,
    changeTransitionType,
    triggerConfetti,
    handleStartGame,
    handleManualQuestionsGenerated,
    handleStartTimer,
    handleAnswerSelect,
    handleJudgeDecision,
    handleJudgeDeductPoints,
    nextQuestion,
    refreshCurrentQuestion,
    useJoker,
    usePowerUp,
    resetGame,
    endGame,
    calculateTimeBonus,
    getStreakMultiplier,
    showPunishment,
    toggleFeature,
    getFeatureName,
    handleAdvanceSetup,
    setGameView,
    setShowPunishmentBox,
    customCategories,
    addCustomCategory
  };
};

export default useGameState;
