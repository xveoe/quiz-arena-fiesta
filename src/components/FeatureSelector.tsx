
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Sparkles, 
  Award, 
  Timer, 
  Gavel, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface FeatureSelectorProps {
  gameFeatures: {
    streakBonus: boolean;
    timeBonus: boolean;
    confettiEffects: boolean;
    judgeFunctionality: boolean;
    powerUps: boolean;
  };
  toggleFeature: (feature: keyof typeof gameFeatures) => void;
  onComplete: () => void;
}

// Changed to use a simple Record instead of referencing gameFeatures
const getFeatureName = (feature: string): string => {
  const featureNames: Record<string, string> = {
    streakBonus: "مكافأة السلسلة",
    timeBonus: "مكافأة الوقت",
    confettiEffects: "تأثيرات الاحتفال",
    judgeFunctionality: "وظيفة الحكم",
    powerUps: "القدرات الخاصة"
  };
  
  return featureNames[feature] || feature;
};

const getFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    streakBonus: "تمنح نقاط إضافية عند الإجابة على ثلاثة أسئلة صحيحة متتالية",
    timeBonus: "احصل على نقاط إضافية كلما أجبت بشكل أسرع",
    confettiEffects: "تأثيرات احتفالية عند الإجابة الصحيحة",
    judgeFunctionality: "تُتيح للحكم تغيير نتيجة الإجابة",
    powerUps: "قدرات خاصة مثل الجوكر وإضافة وقت ومضاعفة النقاط"
  };
  
  return descriptions[feature] || "وصف غير متوفر";
};

const getFeatureIcon = (feature: string) => {
  const icons: Record<string, React.ReactNode> = {
    streakBonus: <Sparkles className="w-5 h-5" />,
    timeBonus: <Timer className="w-5 h-5" />,
    confettiEffects: <Sparkles className="w-5 h-5" />,
    judgeFunctionality: <Gavel className="w-5 h-5" />,
    powerUps: <Zap className="w-5 h-5" />
  };
  
  return icons[feature] || <Award className="w-5 h-5" />;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
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

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ 
  gameFeatures, 
  toggleFeature, 
  onComplete 
}) => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 py-4"
    >
      <motion.div variants={itemVariants} custom={0}>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent ml-3">
            ميزات اللعبة
          </h2>
        </div>
      </motion.div>

      <Card className="overflow-hidden bg-gradient-to-b from-gray-800/70 to-gray-900/90 border border-gray-700/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 z-0"></div>
        <div className="relative z-10 p-5">
          <motion.p variants={itemVariants} custom={1} className="text-gray-300 mb-6 text-sm">
            اختر الميزات التي تريد تفعيلها في اللعبة لجعلها أكثر تشويقًا ومتعة
          </motion.p>
          
          <div className="space-y-4">
            {Object.entries(gameFeatures).map(([key, value], index) => (
              <motion.div 
                key={key} 
                variants={itemVariants} 
                custom={index + 2}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                  value 
                    ? 'bg-gradient-to-r from-gray-800/70 to-gray-800/40 border border-gray-700/30' 
                    : 'bg-gray-800/20 border border-gray-800/20'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    value 
                      ? 'bg-gradient-to-tr from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {getFeatureIcon(key)}
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-medium ${value ? 'text-white' : 'text-gray-400'}`}>
                      {getFeatureName(key)}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{getFeatureDescription(key)}</p>
                  </div>
                </div>
                
                <Switch 
                  checked={value}
                  onCheckedChange={() => toggleFeature(key as keyof typeof gameFeatures)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-blue-600"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <motion.div variants={itemVariants} custom={8} className="flex justify-end">
        <Button 
          onClick={onComplete}
          className="mt-4 px-6 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 
                   text-white shadow-lg shadow-purple-700/30 transition-all duration-300 rounded-xl"
        >
          <span className="ml-2">ابدأ المسابقة</span>
          <CheckCircle className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default FeatureSelector;
