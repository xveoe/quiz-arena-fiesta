
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Trophy } from "lucide-react";
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
import { AspectRatio } from "@/components/ui/aspect-ratio";

const transitionVariants = [
  { // اتجاه لأعلى - أكثر سلاسة الآن
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
  },
  { // اتجاه لأسفل - أكثر سلاسة الآن
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
  },
  { // اتجاه لليمين - أكثر سلاسة الآن
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { x: 20, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
  },
  { // اتجاه لليسار - أكثر سلاسة الآن
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
  },
  { // ظهور وتلاشي مع تكبير وتصغير - أكثر سلاسة الآن
    initial: { scale: 0.98, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { scale: 0.98, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
  }
];

const Index = () => {
  const isMobile = useIsMobile();
  const [showIntro, setShowIntro] = useState(false);
  
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
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <header className="py-4 px-6 bg-white">
        <div className="max-w-screen-md mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold text-blue-600 text-center"
          >
            تحدي المعرفة
          </motion.h1>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-screen-md mx-auto w-full">
        <Tabs value={gameState.currentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-blue-50 rounded-xl p-1">
            <TabsTrigger 
              value="setup" 
              disabled={gameState.gameStarted}
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <span className="ml-1">الإعدادات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="game" 
              disabled={!gameState.gameStarted}
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <HelpCircle className="w-4 h-4 ml-2" />
              اللعبة
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={gameState.gameStarted && gameState.currentQuestionIndex < gameState.questions.length - 1}
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Trophy className="w-4 h-4 ml-2" />
              النتائج
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-2">
            <AnimatePresence mode="wait">
              {gameState.setupStep === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                  className="fade-in"
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                  className="fade-in"
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
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6 }}
                  className="fade-in"
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
                  transition={{ duration: 0.6, ease: "easeInOut" }}
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
                  
                  {gameState.gameView === 'question' && (
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
