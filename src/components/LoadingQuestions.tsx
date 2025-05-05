
import React from 'react';
import { motion } from 'framer-motion';

const LoadingQuestions: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-10 rounded-2xl bg-white border border-blue-100 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="w-16 h-16 mb-6 relative"
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
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
      </motion.div>
      
      <h3 className="text-xl font-bold text-blue-700 mb-2">توليد الأسئلة جارٍ...</h3>
      <p className="text-blue-500 text-center max-w-xs">
        يتم إعداد أسئلة جديدة لمسابقتك الآن
      </p>
    </motion.div>
  );
};

export default LoadingQuestions;
