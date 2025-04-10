
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Award, Zap } from 'lucide-react';

interface CustomPunishmentBoxProps {
  teamName: string;
  onClose: () => void;
}

// قائمة العقوبات المناسبة للعب داخل المنزل مع الأصدقاء
const punishments = [
  "القيام بـ 10 تمارين ضغط",
  "الوقوف على قدم واحدة لمدة دقيقة كاملة",
  "الوقوف على أصابع القدمين لمدة 30 ثانية",
  "القيام بـ 15 تمرين قرفصاء (سكوات)",
  "العد من 100 إلى 1 بالعكس دون توقف",
  "الوقوف مع رفع الذراعين جانباً لمدة دقيقة",
  "ذكر خمسة أشياء تبدأ بحرف معين خلال 20 ثانية",
  "تناول ملعقة من العسل أو الخل (اختياري)",
  "القيام بـ 20 تمرين بطن",
  "البقاء في وضعية الجسر (بلانك) لمدة 30 ثانية",
  "الجلوس في وضع القرفصاء على الحائط لمدة دقيقة",
  "حل لغز رياضي بسيط في وقت محدد",
  "رمي كرة ورقية في سلة من مسافة 3 أمتار (3 محاولات)",
  "كتابة الاسم باليد غير المعتادة",
  "عمل وضعية اليوغا والبقاء ثابتاً لمدة 30 ثانية"
];

const CustomPunishmentBox: React.FC<CustomPunishmentBoxProps> = ({ teamName, onClose }) => {
  const [selectedPunishment, setSelectedPunishment] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedPunishment(null);
    
    // Generate a random rotation between 1800 and 3600 degrees (5-10 full spins)
    const spins = 5 + Math.floor(Math.random() * 5);
    const randomAngle = spins * 360 + Math.floor(Math.random() * 360);
    
    setRotationAngle(randomAngle);
    
    // Calculate which punishment is selected based on the final angle
    const segmentSize = 360 / punishments.length;
    const finalPosition = randomAngle % 360;
    const selectedIndex = Math.floor(finalPosition / segmentSize);
    
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPunishment(punishments[selectedIndex]);
    }, 3000); // 3 seconds for spinning animation
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-to-b from-gray-800/95 to-gray-900/95 border border-gray-700/50 shadow-2xl shadow-purple-900/20 rounded-xl overflow-hidden p-0">
          <div className="p-4 border-b border-gray-700/50 bg-gray-800/50 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-900/30 mr-2">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">عقاب {teamName}</h2>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-5 text-center">
            <div className="relative mb-6 flex justify-center">
              <motion.div
                className="w-48 h-48 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full
                          border-2 border-purple-500/30 flex items-center justify-center"
                style={{ 
                  boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)",
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: isSpinning ? "transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none"
                }}
              >
                <Zap className="w-16 h-16 text-purple-400/50" />
              </motion.div>
              
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 16L0 0H16L8 16Z" fill="#f43f5e" />
                </svg>
              </div>
            </div>
            
            <div className="min-h-24 flex flex-col items-center justify-center mb-6">
              {selectedPunishment ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold px-4 py-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-white mb-4"
                >
                  {selectedPunishment}
                </motion.div>
              ) : (
                <p className="text-gray-400 mb-4">
                  {isSpinning ? "جاري اختيار العقاب..." : "اضغط زر العجلة لاختيار العقاب!"}
                </p>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={spinWheel} 
                disabled={isSpinning}
                className={`px-8 py-6 ${
                  isSpinning 
                    ? "bg-gray-700 text-gray-300" 
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
                }`}
              >
                {isSpinning ? (
                  <>
                    <span className="mr-2">جاري الاختيار</span>
                    <span className="animate-spin inline-block">
                      <Award className="h-5 w-5" />
                    </span>
                  </>
                ) : (
                  selectedPunishment ? "اختيار عقاب آخر" : "تدوير العجلة"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CustomPunishmentBox;
