
import React from 'react';
import { motion } from 'framer-motion';

const LoadingQuestions: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-16">
      <motion.div 
        className="flex flex-col items-center justify-center p-4 rounded-xl bg-transparent w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="w-16 h-16 mb-8 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-blue-500/30"
          />
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.2, 
              ease: "linear"
            }}
          />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">توليد الأسئلة جارٍ...</h3>
        <p className="text-blue-600 text-lg text-center max-w-xs">
          يتم إعداد أسئلة جديدة لمسابقتك الآن
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingQuestions;
