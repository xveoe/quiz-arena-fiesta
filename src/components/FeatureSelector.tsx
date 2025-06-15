
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Sparkles, 
  Award, 
  Timer, 
  Gavel, 
  Zap,
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
  toggleFeature: (feature: keyof FeatureSelectorProps["gameFeatures"]) => void;
  onComplete: () => void;
}

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
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20 mr-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            ميزات اللعبة
          </h2>
        </div>
      </motion.div>

      <div className="mesomorphic-card">
        <div className="relative z-10 p-2">
          <motion.p variants={itemVariants} custom={1} className="text-gray-300 mb-6 text-center text-sm">
            اختر الميزات التي تريد تفعيلها في اللعبة لجعلها أكثر تشويقًا ومتعة
          </motion.p>
          
          <div className="space-y-4">
            {Object.entries(gameFeatures).map(([key, value], index) => (
              <motion.div 
                key={key} 
                variants={itemVariants} 
                custom={index + 2}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 luxury-glass ${
                  value ? 'border-purple-400/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    value 
                      ? 'bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {getFeatureIcon(key)}
                  </div>
                  <div className="mr-3">
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
      </div>

      <motion.div variants={itemVariants} custom={8} className="flex justify-center">
        <button 
          onClick={onComplete}
          className="luxury-btn-primary flex items-center gap-3 text-lg"
        >
          <span>ابدأ المسابقة</span>
          <CheckCircle className="h-5 w-5" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FeatureSelector;
