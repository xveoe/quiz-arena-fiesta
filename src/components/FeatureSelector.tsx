
import React from "react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

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
    streakBonus: "تمنح نقاط إضافية عند الفوز بعدة أجوبة متتالية.",
    timeBonus: "احصل على نقاط إضافية كلما أجبت أسرع.",
    confettiEffects: "تأثيرات احتفالية عند الفوز.",
    judgeFunctionality: "تحكم استثنائي للحكم وتعديل النتائج.",
    powerUps: "تفعيل قدرات خاصة أثناء المسابقة."
  };
  return descriptions[feature] || "";
};

const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  gameFeatures, toggleFeature, onComplete
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-2"
      style={{ width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0, padding: 0 }}
    >
      <div className="mb-9" style={{width: '98vw'}}>
        <h2 className="feature-header-title">اختر ميزات المسابقة</h2>
        <div className="text-gray-300 text-center" style={{fontSize:'1.20rem', paddingBottom:6}}>يمكنك تفعيل ميزات إضافية لزيادة التحدي والمتعة</div>
      </div>
      <div style={{width:"99vw"}}>
        {Object.entries(gameFeatures).map(([key, value], index) => (
          <div
            key={key}
            className={`feature-glass-btn${value ? " feature-glass-btn-active" : ""}`}
            style={{marginBottom:"1.37rem", width:"98vw"}}
          >
            <div style={{flex:"1"}}>
              <div style={{fontWeight: 900, fontSize:'1.31em'}}>{getFeatureName(key)}</div>
              <div className="feature-desc">{getFeatureDescription(key)}</div>
            </div>
            <div className="feature-switch-wrap">
              <Switch
                checked={value}
                onCheckedChange={() => toggleFeature(key as keyof typeof gameFeatures)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-500"
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:"2.4rem", width:"99vw"}}>
        <button
          onClick={onComplete}
          className="luxury-btn-primary"
          style={{fontSize:'1.29rem', minHeight:68, fontWeight:900}}
        >
          ابدأ المسابقة
        </button>
      </div>
    </motion.div>
  );
};
export default FeatureSelector;
