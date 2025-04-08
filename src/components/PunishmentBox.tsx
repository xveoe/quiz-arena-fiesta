
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Gift, Award } from 'lucide-react';
import { toast } from 'sonner';

interface PunishmentBoxProps {
  teamName: string;
  onClose: () => void;
}

const PunishmentBox: React.FC<PunishmentBoxProps> = ({ teamName, onClose }) => {
  const punishments = [
    'تمرين ضغط ١٠ مرات',
    'الوقوف بقدم واحدة لمدة دقيقة',
    'تقليد حيوان لمدة ٣٠ ثانية',
    'الركض في المكان لمدة دقيقة',
    'القفز ٢٠ مرة',
    'تقليد شخصية مشهورة',
    'رواية نكتة للجميع',
    'التصفيق بحماس لمدة ٣٠ ثانية',
    'تكرار جملة مضحكة ٥ مرات',
    'وقوف على رؤوس الأصابع لمدة دقيقة',
  ];

  const [selectedPunishment, setSelectedPunishment] = useState<string | null>(null);
  const [selectedPunishments, setSelectedPunishments] = useState<string[]>([]);

  const generatePunishments = () => {
    // Select two random punishments
    const randomPunishments = [...punishments].sort(() => 0.5 - Math.random()).slice(0, 2);
    setSelectedPunishments(randomPunishments);
    setSelectedPunishment(null);
    
    toast.info("تم توليد عقوبتين، اختر واحدة منهما!", {
      position: "top-center"
    });
  };

  const choosePunishment = (punishment: string) => {
    setSelectedPunishment(punishment);
    toast.success("تم اختيار العقاب النهائي!", {
      position: "top-center"
    });
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <Card className="p-6 luxury-card relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-center mb-2 text-silver">صندوق العقاب</h2>
          <h3 className="text-lg text-center mb-6 text-red-400">للفريق الخاسر: {teamName}</h3>
          
          <div className="space-y-6">
            {selectedPunishments.length > 0 ? (
              <motion.div 
                className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-900/50 to-purple-800/50 border border-purple-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">اختر العقاب:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPunishments.map((punishment, index) => (
                    <button
                      key={index}
                      onClick={() => choosePunishment(punishment)}
                      className={`
                        p-3 rounded-lg border-2 transition-all
                        ${selectedPunishment === punishment 
                          ? 'bg-purple-700 border-purple-400 text-white'
                          : 'bg-purple-950/70 border-purple-800/50 text-purple-200 hover:bg-purple-900/70'}
                      `}
                    >
                      {punishment}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : selectedPunishment ? (
              <motion.div 
                className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-900/50 to-purple-800/50 border border-purple-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-2">العقاب النهائي هو:</h3>
                <p className="text-2xl text-purple-200 font-bold">{selectedPunishment}</p>
              </motion.div>
            ) : (
              <motion.div 
                className="text-center p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Gift className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                <p className="text-zinc-300 mb-4">اضغط على الزر أدناه لتوليد عقابين واختيار واحد منهما</p>
              </motion.div>
            )}
            
            <div className="flex justify-center">
              <Button
                onClick={generatePunishments}
                disabled={selectedPunishment !== null}
                className="w-full md:w-auto text-lg py-6 px-8 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-purple-100 disabled:opacity-50"
              >
                <Award className="w-5 h-5" />
                <span>توليد العقوبات</span>
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-zinc-500">
            العقوبات مناسبة للأجواء الودية وخالية من أي أذى جسدي أو نفسي
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PunishmentBox;
