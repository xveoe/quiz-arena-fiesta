
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Gift, Award, Users } from 'lucide-react';
import { toast } from 'sonner';

interface PunishmentBoxProps {
  teamName: string;
  onClose: () => void;
}

const PunishmentBox: React.FC<PunishmentBoxProps> = ({ teamName, onClose }) => {
  // Updated punishments, removing acting, imitation, singing, and running
  const punishments = [
    'تمارين ضغط جماعية ١٠ مرات لكل عضو',
    'الوقوف على شكل دائرة لمدة دقيقة',
    'حل لغز رياضي خلال وقت محدد',
    'كتابة جمل معينة بخط واضح',
    'تشكيل كلمة بأوراق ملونة',
    'لعبة الذاكرة: تذكر أسماء جميع الحاضرين بالترتيب',
    'حل لغز معقد كفريق واحد خلال وقت محدد',
    'تناول طعام حار (اختياري)',
    'تقديم هدية رمزية للفريق الفائز',
    'تحضير مشروب للفريق الفائز',
  ];

  const [selectedPunishment, setSelectedPunishment] = useState<string | null>(null);
  const [selectedPunishments, setSelectedPunishments] = useState<string[]>([]);
  const [showAIOption, setShowAIOption] = useState(false);
  const [aiGeneratedPunishment, setAIGeneratedPunishment] = useState<string | null>(null);

  const generatePunishments = () => {
    // Select two random punishments
    const randomPunishments = [...punishments].sort(() => 0.5 - Math.random()).slice(0, 2);
    setSelectedPunishments(randomPunishments);
    setSelectedPunishment(null);
    setShowAIOption(false);
    setAIGeneratedPunishment(null);
    
    toast.info("تم توليد عقوبتين للفريق، اختر واحدة منهما!", {
      position: "top-center"
    });
  };

  const choosePunishment = (punishment: string) => {
    setSelectedPunishment(punishment);
    toast.success("تم اختيار العقاب النهائي للفريق!", {
      position: "top-center"
    });
  };

  const generateAIPunishment = () => {
    // AI generated punishments avoiding physical activities like running, singing, etc.
    const aiPunishments = [
      "إعداد ملخص قصير حول موضوع يختاره الفريق الفائز",
      "حل ثلاثة ألغاز يختارها الفريق الفائز",
      "تقديم عرض تقديمي قصير عن موضوع علمي",
      "كتابة رسالة شكر للفريق الفائز",
      "تصميم شعار بسيط للمسابقة للمرة القادمة",
      "تحضير قائمة بـ 10 حقائق مثيرة للاهتمام حول موضوع معين",
      "تقديم وجبة خفيفة للفريق الفائز في اللقاء القادم",
      "الإجابة على 5 أسئلة صعبة يختارها الفريق الفائز",
      "تنظيم المكان بعد انتهاء المسابقة",
      "إعداد مجموعة أسئلة للمسابقة القادمة"
    ];

    const randomAIPunishment = aiPunishments[Math.floor(Math.random() * aiPunishments.length)];
    setAIGeneratedPunishment(randomAIPunishment);
    setSelectedPunishment(randomAIPunishment);
    
    toast.success("تم توليد عقاب بواسطة الذكاء الاصطناعي!", {
      position: "top-center"
    });
  };

  const toggleAIOption = () => {
    setShowAIOption(true);
    setSelectedPunishments([]);
    setSelectedPunishment(null);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-indigo-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        exit={{ scale: 0.8, y: 30, transition: { duration: 0.2 } }}
      >
        <Card className="p-6 relative overflow-hidden bg-gradient-to-b from-indigo-900/80 to-purple-900/80 border border-indigo-700/50 shadow-xl shadow-purple-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,90,240,0.1),transparent_70%)]"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-indigo-300 hover:text-indigo-100 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="w-8 h-8 text-indigo-300" />
              <h2 className="text-3xl font-bold text-center text-indigo-100">عقاب الفريق</h2>
            </div>
            
            <h3 className="text-xl text-center mb-8 text-indigo-200 font-medium">الفريق الخاسر: {teamName}</h3>
            
            <div className="space-y-6">
              {!showAIOption && !selectedPunishments.length && !selectedPunishment && !aiGeneratedPunishment && (
                <motion.div 
                  className="text-center p-5 rounded-lg bg-gradient-to-r from-purple-800/40 to-purple-700/40 border border-purple-600/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-indigo-100 mb-4">اختر طريقة العقاب:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      onClick={generatePunishments}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-lg border-2 bg-purple-900/50 border-purple-700/50 text-indigo-200 hover:bg-purple-800/50"
                    >
                      عقوبات معدة مسبقاً
                    </motion.button>
                    <motion.button
                      onClick={toggleAIOption}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-lg border-2 bg-indigo-900/50 border-indigo-700/50 text-indigo-200 hover:bg-indigo-800/50"
                    >
                      عقوبة من الذكاء الاصطناعي
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {selectedPunishments.length > 0 && (
                <motion.div 
                  className="text-center p-5 rounded-lg bg-gradient-to-r from-purple-800/40 to-purple-700/40 border border-purple-600/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-indigo-100 mb-4">اختر العقاب للفريق:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPunishments.map((punishment, index) => (
                      <motion.button
                        key={index}
                        onClick={() => choosePunishment(punishment)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${selectedPunishment === punishment 
                            ? 'bg-purple-600 border-purple-400 text-white'
                            : 'bg-purple-900/50 border-purple-700/50 text-indigo-200 hover:bg-purple-800/50'}
                        `}
                      >
                        {punishment}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {showAIOption && !aiGeneratedPunishment && (
                <motion.div 
                  className="text-center p-5 rounded-lg bg-gradient-to-r from-indigo-800/40 to-indigo-700/40 border border-indigo-600/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-indigo-100 mb-4">عقوبة من الذكاء الاصطناعي</h3>
                  <p className="text-indigo-200 mb-4">اضغط على الزر لتوليد عقوبة مناسبة بواسطة الذكاء الاصطناعي</p>
                  <Button
                    onClick={generateAIPunishment}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg"
                  >
                    توليد عقوبة بالذكاء الاصطناعي
                  </Button>
                </motion.div>
              )}

              {selectedPunishment || aiGeneratedPunishment ? (
                <motion.div 
                  className="text-center p-5 rounded-lg bg-gradient-to-r from-purple-800/40 to-purple-700/40 border border-purple-600/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-indigo-100 mb-3">العقاب النهائي للفريق هو:</h3>
                  <p className="text-2xl text-indigo-200 font-bold">{selectedPunishment}</p>
                </motion.div>
              ) : !showAIOption && selectedPunishments.length === 0 && !aiGeneratedPunishment ? (
                <motion.div 
                  className="text-center p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Gift className="w-16 h-16 mx-auto text-indigo-400 mb-4" />
                  <p className="text-indigo-200 mb-4">اختر طريقة تحديد العقاب للفريق الخاسر</p>
                </motion.div>
              ) : null}
              
              {(!selectedPunishment && selectedPunishments.length > 0) || (showAIOption && !aiGeneratedPunishment) ? (
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      setShowAIOption(false);
                      setSelectedPunishments([]);
                      setAIGeneratedPunishment(null);
                    }}
                    className="w-full md:w-auto text-md py-2 px-4 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-md"
                  >
                    العودة للخيارات
                  </Button>
                </div>
              ) : null}
            </div>
            
            <div className="mt-6 text-center text-xs text-indigo-300">
              العقوبات مناسبة للأجواء الودية وخالية من أي أذى جسدي أو نفسي
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PunishmentBox;
