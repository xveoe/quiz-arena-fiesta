
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { ArrowRight, Settings, Layers } from 'lucide-react';
import { categories } from "@/services/questionService";
import { GameSetup } from "@/hooks/useGameState";
import CustomCategoryInput from "@/components/CustomCategoryInput";

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
  setGameSetup: (value: Partial<GameSetup>) => void;
  selectedCategories: string[];
  toggleCategory: (categoryId: string) => void;
  onComplete: () => void;
  addCustomCategory: (categoryName: string) => string;
  customCategories: {[key: string]: string};
}

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: custom * 0.1,
      duration: 0.6, 
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  })
};

const SetupSteps: React.FC<SetupStepsProps> = ({ 
  gameSetup, 
  setGameSetup, 
  selectedCategories,
  toggleCategory,
  onComplete,
  addCustomCategory,
  customCategories
}) => {
  const handleAddCustomCategory = (category: string) => {
    addCustomCategory(category);
  };

  return (
    <div className="w-full mx-auto px-2 pb-32">
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
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mr-3">
              إعدادات اللعبة
            </h2>
          </div>
        </motion.div>

        <Card className="p-5 bg-gradient-to-b from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-xl shadow-blue-900/10 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 z-0"></div>
          <div className="relative z-10 space-y-5">
            <motion.div variants={fadeInVariants} custom={1} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">اسم الفريق الأول</label>
                <Input 
                  type="text" 
                  value={gameSetup.team1Name}
                  onChange={(e) => setGameSetup({...gameSetup, team1Name: e.target.value})}
                  className="bg-gray-800/80 border-gray-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">اسم الفريق الثاني</label>
                <Input 
                  type="text" 
                  value={gameSetup.team2Name}
                  onChange={(e) => setGameSetup({...gameSetup, team2Name: e.target.value})}
                  className="bg-gray-800/80 border-gray-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-white"
                />
              </div>
            </motion.div>
            
            <motion.div variants={fadeInVariants} custom={2}>
              <label className="block text-sm font-medium text-gray-300 mb-1">اسم الحكم</label>
              <Input 
                type="text" 
                value={gameSetup.judgeName}
                onChange={(e) => setGameSetup({...gameSetup, judgeName: e.target.value})}
                className="bg-gray-800/80 border-gray-700/70 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-white"
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
              <CustomCategoryInput onAddCustomCategory={handleAddCustomCategory} />
            </motion.div>
            
            <motion.div variants={fadeInVariants} custom={7}>
              <div className="flex items-center mb-2">
                <Layers className="w-4 h-4 text-blue-400 ml-2" />
                <label className="block text-sm font-medium text-gray-300">تصنيفات الأسئلة (يمكن اختيار أكثر من تصنيف)</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                    onClick={() => toggleCategory(category.id)}
                    className={`text-xs h-10 transition-all duration-300 ${
                      selectedCategories.includes(category.id) 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-700/20' 
                        : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/30 text-white'
                    }`}
                  >
                    {category.name}
                  </Button>
                ))}
                
                {Object.entries(customCategories).map(([id, name]) => (
                  <Button
                    key={id}
                    variant={selectedCategories.includes(id) ? "default" : "outline"}
                    onClick={() => toggleCategory(id)}
                    className={`text-xs h-10 transition-all duration-300 ${
                      selectedCategories.includes(id) 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md shadow-green-700/20' 
                        : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/30 text-white'
                    }`}
                  >
                    {name}
                  </Button>
                ))}
              </div>
              <div className="mt-2 text-xs text-blue-400">
                * تم اختيار {selectedCategories.length} {selectedCategories.length === 1 ? 'تصنيف' : 'تصنيفات'}
              </div>
            </motion.div>
          </div>
        </Card>

        <motion.div variants={fadeInVariants} custom={8} className="flex justify-end">
          <Button 
            onClick={onComplete}
            className="mt-4 px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                      text-white shadow-lg shadow-blue-700/30 transition-all duration-300 rounded-xl text-lg font-medium"
          >
            <span className="ml-2">التالي</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SetupSteps;
