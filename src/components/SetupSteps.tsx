
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { ArrowRight, Settings, Users, Zap } from 'lucide-react';
import { categories } from "@/services/questionService";

interface SetupStepsProps {
  gameSetup: {
    playerCount: number;
    team1Name: string;
    team2Name: string;
    questionCount: number;
    difficulty: number;
    timePerQuestion: number;
    judgeName: string;
  };
  setGameSetup: React.Dispatch<React.SetStateAction<{
    playerCount: number;
    team1Name: string;
    team2Name: string;
    questionCount: number;
    difficulty: number;
    timePerQuestion: number;
    judgeName: string;
  }>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  onComplete: () => void;
}

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: custom * 0.1,
      duration: 0.5, 
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  })
};

const SetupSteps: React.FC<SetupStepsProps> = ({ 
  gameSetup, 
  setGameSetup, 
  selectedCategory, 
  setSelectedCategory,
  onComplete 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
      className="space-y-6 py-4"
    >
      <motion.div variants={fadeInVariants} custom={0}>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent ml-3">
            إعدادات اللعبة
          </h2>
        </div>
      </motion.div>

      <Card className="p-5 bg-gradient-to-b from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-xl shadow-blue-900/10 backdrop-blur-sm rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 z-0"></div>
        <div className="relative z-10 space-y-5">
          <motion.div variants={fadeInVariants} custom={1} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">اسم الفريق الأول</label>
              <Input 
                type="text" 
                value={gameSetup.team1Name}
                onChange={(e) => setGameSetup({...gameSetup, team1Name: e.target.value})}
                className="bg-gray-800/80 border-gray-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">اسم الفريق الثاني</label>
              <Input 
                type="text" 
                value={gameSetup.team2Name}
                onChange={(e) => setGameSetup({...gameSetup, team2Name: e.target.value})}
                className="bg-gray-800/80 border-gray-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </motion.div>
          
          <motion.div variants={fadeInVariants} custom={2}>
            <label className="block text-sm font-medium text-gray-300 mb-1">اسم الحكم</label>
            <Input 
              type="text" 
              value={gameSetup.judgeName}
              onChange={(e) => setGameSetup({...gameSetup, judgeName: e.target.value})}
              className="bg-gray-800/80 border-gray-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </motion.div>
          
          <motion.div variants={fadeInVariants} custom={3}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              عدد الأسئلة: <span className="text-blue-400 font-bold">{gameSetup.questionCount}</span>
            </label>
            <Slider 
              value={[gameSetup.questionCount]} 
              min={5}
              max={30}
              step={1}
              onValueChange={(value) => setGameSetup({...gameSetup, questionCount: value[0]})}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span>
              <span>30</span>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInVariants} custom={4}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              مستوى الصعوبة: <span className="text-blue-400 font-bold">{
                gameSetup.difficulty === 1 ? 'سهل جدًا' : 
                gameSetup.difficulty <= 30 ? 'سهل' : 
                gameSetup.difficulty <= 70 ? 'متوسط' : 
                gameSetup.difficulty <= 90 ? 'صعب' : 'صعب جدًا'
              }</span>
            </label>
            <Slider 
              value={[gameSetup.difficulty]} 
              min={1}
              max={100}
              step={1}
              onValueChange={(value) => setGameSetup({...gameSetup, difficulty: value[0]})}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>سهل</span>
              <span>صعب</span>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInVariants} custom={5}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              وقت السؤال: <span className="text-blue-400 font-bold">{gameSetup.timePerQuestion}</span> ثانية
            </label>
            <Slider 
              value={[gameSetup.timePerQuestion]} 
              min={20}
              max={90}
              step={5}
              onValueChange={(value) => setGameSetup({...gameSetup, timePerQuestion: value[0]})}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20 ثانية</span>
              <span>90 ثانية</span>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInVariants} custom={6}>
            <label className="block text-sm font-medium text-gray-300 mb-2">تصنيف الأسئلة</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-xs h-10 transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-700/20' 
                      : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/30'
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </Card>

      <motion.div variants={fadeInVariants} custom={7} className="flex justify-end">
        <Button 
          onClick={onComplete}
          className="mt-4 px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                    text-white shadow-lg shadow-blue-700/30 transition-all duration-300 rounded-xl"
        >
          <span className="ml-2">التالي</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SetupSteps;
