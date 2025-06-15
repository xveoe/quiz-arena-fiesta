
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ManualQuestionForm from "@/components/ManualQuestionForm";
import PunishmentBox from "@/components/PunishmentBox";
import SetupSteps from "@/components/SetupSteps";
import FeatureSelector from "@/components/FeatureSelector";
import LuxuryLoadingCircle from "@/components/LuxuryLoadingCircle";
import Aurora from "@/components/Aurora";
import { useIsMobile } from "@/hooks/use-mobile";
import TeamsView from "@/components/game/TeamsView";
import QuestionView from "@/components/game/QuestionView";
import JudgeView from "@/components/game/JudgeView";
import ResultsView from "@/components/game/ResultsView";
import useGameState from "@/hooks/useGameState";

const transitionVariants = [
  {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  },
  {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  },
  {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: 20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  },
  {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  },
  {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeIn" } }
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

  const renderGameContent = () => {
    if (gameState.currentTab === "results") {
      return (
        <ResultsView 
          teams={gameState.teams}
          losingTeamIndex={gameState.losingTeamIndex}
          showPunishment={gameState.showPunishment}
          resetGame={gameState.resetGame}
        />
      );
    }

    if (!gameState.gameStarted) {
      return (
        <AnimatePresence mode="wait">
          {gameState.setupStep === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <SetupSteps 
                gameSetup={gameState.gameSetup}
                setGameSetup={(value) => gameState.setGameSetup(value)}
                selectedCategories={gameState.selectedCategories}
                toggleCategory={gameState.toggleCategory}
                onComplete={() => gameState.setSetupStep('features')}
                addCustomCategory={gameState.addCustomCategory}
                customCategories={gameState.customCategories}
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
              className="w-full"
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
              className="w-full h-full flex items-center justify-center"
            >
              <LuxuryLoadingCircle 
                onComplete={gameState.handleStartGame}
                duration={4000}
              />
            </motion.div>
          )}
        </AnimatePresence>
      );
    } else if (gameState.isLoading) {
      return (
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full flex items-center justify-center"
        >
          <LuxuryLoadingCircle 
            onComplete={() => gameState.setIsLoading(false)}
            duration={3000}
          />
        </motion.div>
      );
    } else {
      return (
        <motion.div 
          key={`${gameState.gameView}-${gameState.currentQuestionIndex}-${gameState.transitionType}`}
          initial={transitionVariants[gameState.transitionType].initial}
          animate={transitionVariants[gameState.transitionType].animate}
          exit={transitionVariants[gameState.transitionType].exit}
          className="w-full h-full"
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      
      {/* Main Content Container */}
      <div className="center-container">
        <div className="main-content">
          <div className="luxury-glass-intense p-6 w-full">
            {renderGameContent()}
          </div>
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
