
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Intro from "@/components/Intro";
import LoadingQuestions from "@/components/LoadingQuestions";
import ManualQuestionForm from "@/components/ManualQuestionForm";
import PunishmentBox from "@/components/PunishmentBox";
import SetupSteps from "@/components/SetupSteps";
import FeatureSelector from "@/components/FeatureSelector";
import EnhancedLoadingScreen from "@/components/EnhancedLoadingScreen";
import { useIsMobile } from "@/hooks/use-mobile";
import TeamsView from "@/components/game/TeamsView";
import QuestionView from "@/components/game/QuestionView";
import JudgeView from "@/components/game/JudgeView";
import ResultsView from "@/components/game/ResultsView";
import useGameState from "@/hooks/useGameState";

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
  const [showIntro, setShowIntro] = useState(false); // Changed to false to disable intro
  
  const gameState = useGameState();
  
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    if (gameState.gameStarted && gameState.questions.length > 0) {
      gameState.setCurrentTab("game");
    }
  }, [gameState.gameStarted, gameState.questions.length]);

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
            تحدي المعرفة
          </motion.h1>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-screen-sm mx-auto w-full">
        <Tabs value={gameState.currentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 shadow-xl">
            <TabsTrigger value="setup" disabled={gameState.gameStarted}>الإعدادات</TabsTrigger>
            <TabsTrigger value="game" disabled={!gameState.gameStarted}>اللعبة</TabsTrigger>
            <TabsTrigger value="results" disabled={gameState.gameStarted && gameState.currentQuestionIndex < gameState.questions.length - 1}>النتائج</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-2">
            <AnimatePresence mode="wait">
              {gameState.setupStep === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SetupSteps 
                    gameSetup={gameState.gameSetup}
                    setGameSetup={(value) => gameState.setGameSetup(value)}
                    selectedCategories={gameState.selectedCategories}
                    toggleCategory={gameState.toggleCategory}
                    onComplete={() => gameState.setSetupStep('features')}
                  />
                </motion.div>
              )}
              
              {gameState.setupStep === 'features' && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FeatureSelector 
                    gameFeatures={gameState.gameFeatures}
                    toggleFeature={gameState.toggleFeature}
                    onComplete={() => gameState.setSetupStep('loading')}
                  />
                </motion.div>
              )}
              
              {gameState.setupStep === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EnhancedLoadingScreen 
                    onComplete={gameState.handleStartGame}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="game" className="space-y-4 mt-2">
            <AnimatePresence mode="wait">
              {gameState.isLoading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingQuestions />
                </motion.div>
              )}
              
              {!gameState.isLoading && gameState.gameStarted && (
                <motion.div 
                  key={`${gameState.gameView}-${gameState.currentQuestionIndex}-${gameState.transitionType}`}
                  initial={transitionVariants[gameState.transitionType].initial}
                  animate={transitionVariants[gameState.transitionType].animate}
                  exit={transitionVariants[gameState.transitionType].exit}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  {gameState.gameView === 'teams' && (
                    <TeamsView 
                      teams={gameState.teams}
                      currentTeam={gameState.currentTeam}
                      gameFeatures={gameState.gameFeatures}
                      showAnswer={gameState.showAnswer}
                      changeTransitionType={gameState.changeTransitionType}
                      setGameView={gameState.setGameView}
                      endGame={gameState.endGame}
                    />
                  )}
                  
                  {gameState.gameView === 'question' && gameState.showQuestion && (
                    <QuestionView 
                      questions={gameState.questions}
                      currentQuestionIndex={gameState.currentQuestionIndex}
                      teams={gameState.teams}
                      currentTeam={gameState.currentTeam}
                      timer={gameState.timer}
                      timerActive={gameState.timerActive}
                      showAnswer={gameState.showAnswer}
                      excludedOptions={gameState.excludedOptions}
                      isRefreshingQuestion={gameState.isRefreshingQuestion}
                      gameSetup={gameState.gameSetup}
                      gameFeatures={gameState.gameFeatures}
                      powerUpsAvailable={gameState.powerUpsAvailable}
                      handleAnswerSelect={gameState.handleAnswerSelect}
                      handleStartTimer={gameState.handleStartTimer}
                      refreshCurrentQuestion={gameState.refreshCurrentQuestion}
                      nextQuestion={gameState.nextQuestion}
                      usePowerUp={gameState.usePowerUp}
                      useJoker={gameState.useJoker}
                      calculateTimeBonus={gameState.calculateTimeBonus}
                      changeTransitionType={gameState.changeTransitionType}
                      setGameView={gameState.setGameView}
                    />
                  )}
                  
                  {gameState.gameView === 'judge' && (
                    <JudgeView 
                      gameSetup={gameState.gameSetup}
                      handleJudgeDecision={gameState.handleJudgeDecision}
                      handleJudgeDeductPoints={gameState.handleJudgeDeductPoints}
                      nextQuestion={gameState.nextQuestion}
                      currentQuestionIndex={gameState.currentQuestionIndex}
                      questions={gameState.questions}
                      changeTransitionType={gameState.changeTransitionType}
                      setGameView={gameState.setGameView}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="results" className="mt-2">
            <ResultsView 
              teams={gameState.teams}
              losingTeamIndex={gameState.losingTeamIndex}
              showPunishment={gameState.showPunishment}
              resetGame={gameState.resetGame}
            />
          </TabsContent>
        </Tabs>
      </main>

      <AnimatePresence>
        {gameState.showManualQuestionForm && (
          <ManualQuestionForm 
            onClose={() => gameState.setShowManualQuestionForm(false)}
            onQuestionsGenerated={gameState.handleManualQuestionsGenerated}
          />
        )}
        
        {gameState.showPunishmentBox && (
          <PunishmentBox 
            teamName={gameState.teams[gameState.losingTeamIndex!].name} 
            onClose={() => gameState.setShowPunishmentBox(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
