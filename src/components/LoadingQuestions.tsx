
import React from 'react';
import { motion } from 'framer-motion';

const LoadingQuestions: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-10 rounded-2xl bg-white border border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 mb-6 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-blue-500/30"
        />
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </motion.div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">توليد الأسئلة جارٍ...</h3>
      <p className="text-gray-500 text-center max-w-xs">
        يتم الآن إعداد مجموعة متنوعة من الأسئلة المناسبة لمسابقتك
      </p>
    </motion.div>
  );
};

export default LoadingQuestions;
