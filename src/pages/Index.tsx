
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const transitionVariants = [
  { // اتجاه لأعلى
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  },
  { // اتجاه لأسفل
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  },
  { // اتجاه لليمين
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: 20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  },
  { // اتجاه لليسار
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  },
  { // ظهور وتلاشي
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
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

  // Render different screens based on game state without tabs
  const renderGameContent = () => {
    if (!gameState.gameStarted) {
      // Setup phase
      return (
        <AnimatePresence mode="wait">
          {gameState.setupStep === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="fade-in w-full"
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
              transition={{ duration: 0.4 }}
              className="fade-in w-full"
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
              transition={{ duration: 0.4 }}
              className="fade-in w-full flex items-center justify-center"
            >
              <EnhancedLoadingScreen 
                onComplete={gameState.handleStartGame}
              />
            </motion.div>
          )}
        </AnimatePresence>
      );
    } else if (gameState.isLoading) {
      // Loading phase
      return (
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full flex items-center justify-center"
        >
          <LoadingQuestions />
        </motion.div>
      );
    } else if (!gameState.gameStarted || gameState.currentQuestionIndex >= gameState.questions.length) {
      // Results phase
      return (
        <ResultsView 
          teams={gameState.teams}
          losingTeamIndex={gameState.losingTeamIndex}
          showPunishment={gameState.showPunishment}
          resetGame={gameState.resetGame}
        />
      );
    } else {
      // Game phase
      return (
        <motion.div 
          key={`${gameState.gameView}-${gameState.currentQuestionIndex}-${gameState.transitionType}`}
          initial={transitionVariants[gameState.transitionType].initial}
          animate={transitionVariants[gameState.transitionType].animate}
          exit={transitionVariants[gameState.transitionType].exit}
          className="w-full"
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
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <div className="flex-1 p-3 w-full h-full overflow-auto">
        <div className="w-full max-w-md mx-auto h-full flex flex-col items-center justify-center">
          {renderGameContent()}
        </div>
      </div>

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
