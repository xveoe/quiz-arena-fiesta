
import React from 'react';
import { motion } from 'framer-motion';

const LoadingQuestions = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-black/90 z-40">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="mb-6"
      >
        <svg className="w-16 h-16 text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </motion.div>
      <h2 className="text-2xl font-bold mb-2">يرجى الانتظار</h2>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        جاري توليد الأسئلة باستخدام الذكاء الاصطناعي...
      </p>
    </div>
  );
};

export default LoadingQuestions;
