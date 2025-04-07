
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, X } from 'lucide-react';

interface PunishmentWheelProps {
  teamName: string;
  onClose: () => void;
}

const PunishmentWheel: React.FC<PunishmentWheelProps> = ({ teamName, onClose }) => {
  const punishments = [
    'تمرين ضغط ١٠ مرات',
    'الوقوف بقدم واحدة لمدة ٥ دقائق',
    'تقليد حيوان لمدة ٣٠ ثانية',
    'الركض في المكان لمدة دقيقة',
    'القفز ٢٠ مرة',
    'تقليد شخصية مشهورة',
    'رواية نكتة للجميع',
    'التصفيق بحماس لمدة ٣٠ ثانية',
    'تكرار جملة مضحكة ٥ مرات',
    'وقوف على رؤوس الأصابع لمدة دقيقة',
  ];

  const [spinning, setSpinning] = useState(false);
  const [selectedPunishment, setSelectedPunishment] = useState<string | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [finalPunishments, setFinalPunishments] = useState<string[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    setSelectedPunishment(null);
    setFinalPunishments([]);
    
    // Random rotation between 1800 and 3600 degrees (5-10 full spins) plus a bit more for the random segment
    const randomAdditionalAngle = Math.floor(Math.random() * 360);
    const randomRotation = 1800 + Math.floor(Math.random() * 1800) + randomAdditionalAngle;
    
    setRotationDegrees(rotationDegrees + randomRotation);
    
    // Calculate which punishment is selected after spinning
    setTimeout(() => {
      const segmentSize = 360 / punishments.length;
      // The extra modulo 360 is to get the final position between 0-359 degrees
      const finalAngle = (randomAdditionalAngle) % 360;
      const selectedIndex = Math.floor(finalAngle / segmentSize);
      
      // Select the main punishment
      const mainPunishment = punishments[selectedIndex];
      
      // Select a random second punishment that's different from the first
      let secondIndex = Math.floor(Math.random() * punishments.length);
      while (secondIndex === selectedIndex) {
        secondIndex = Math.floor(Math.random() * punishments.length);
      }
      const secondPunishment = punishments[secondIndex];
      
      setFinalPunishments([mainPunishment, secondPunishment]);
      setSpinning(false);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 5000); // Match this with the CSS animation duration
  };

  const choosePunishment = (punishment: string) => {
    setSelectedPunishment(punishment);
    
    // Additional confetti effect when choosing final punishment
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
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

          <h2 className="text-2xl font-bold text-center mb-2 text-silver">عجلة العقاب</h2>
          <h3 className="text-lg text-center mb-6 text-red-400">للفريق الخاسر: {teamName}</h3>
          
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Pointer/indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-zinc-300 z-10"></div>
            
            {/* Wheel */}
            <motion.div 
              ref={wheelRef}
              className="w-full h-full rounded-full overflow-hidden relative"
              style={{
                background: "conic-gradient(from 0deg, #581c87, #9333ea, #7e22ce, #6b21a8, #581c87, #9333ea, #7e22ce, #6b21a8, #581c87, #9333ea)",
                transformOrigin: "center center",
                boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)"
              }}
              animate={{ 
                rotate: rotationDegrees,
              }}
              transition={{ 
                duration: 5,
                ease: [0.2, 0.8, 0.2, 1] // Custom ease function for realistic spinning
              }}
            >
              {punishments.map((_, index) => {
                const angle = (index / punishments.length) * 360;
                return (
                  <div 
                    key={index}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 text-white text-xs font-bold"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-62px) rotate(90deg)`,
                      width: "100px",
                      textAlign: "center",
                      transformOrigin: "center bottom"
                    }}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </motion.div>
          </div>
          
          <div className="space-y-6">
            {finalPunishments.length > 0 ? (
              <motion.div 
                className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-900/50 to-purple-800/50 border border-purple-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">اختر العقاب:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {finalPunishments.map((punishment, index) => (
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
              <div className="h-[88px]"></div> // Placeholder to maintain layout
            )}
            
            <div className="flex justify-center">
              <Button
                onClick={spinWheel}
                disabled={spinning || selectedPunishment !== null}
                className="w-full md:w-auto text-lg py-6 px-8 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-purple-100 disabled:opacity-50"
              >
                <RotateCcw className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
                <span>{spinning ? 'جاري الدوران...' : 'تدوير العجلة'}</span>
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

export default PunishmentWheel;
