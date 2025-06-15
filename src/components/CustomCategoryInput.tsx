
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CustomCategoryInputProps {
  onAddCustomCategory: (category: string) => void;
}

const CustomCategoryInput: React.FC<CustomCategoryInputProps> = ({ onAddCustomCategory }) => {
  const [customCategory, setCustomCategory] = useState('');
  
  const handleAddCategory = () => {
    if (customCategory.trim().length > 0) {
      onAddCustomCategory(customCategory.trim());
      setCustomCategory('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customCategory.trim().length > 0) {
      handleAddCategory();
    }
  };
  
  return (
    <div className="flex flex-col space-y-4 mb-6 w-full">
      <div className="flex items-center gap-3 w-full">
        <Input
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="أدخل تصنيف الأسئلة الخاص بك"
          className="flex-grow modern-input text-right"
          dir="rtl"
        />
        <button
          onClick={handleAddCategory}
          disabled={customCategory.trim().length === 0}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-lg border border-white/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة
        </button>
      </div>
      <div className="luxury-card p-4">
        <p className="text-sm text-blue-700 font-medium text-center">
          يمكنك إضافة تصنيفات مخصصة للأسئلة وسيقوم النظام بتوليد أسئلة مناسبة
        </p>
      </div>
    </div>
  );
};

export default CustomCategoryInput;
