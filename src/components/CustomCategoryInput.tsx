
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
    <div className="flex flex-col space-y-3 mb-4 w-full">
      <div className="flex items-center gap-3 w-full">
        <Input
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="أدخل تصنيف الأسئلة الخاص بك"
          className="flex-grow rounded-xl border-blue-700 bg-white text-gray-900 shadow-sm"
          dir="rtl"
        />
        <Button
          onClick={handleAddCategory}
          disabled={customCategory.trim().length === 0}
          className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all duration-300"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة
        </Button>
      </div>
      <p className="text-sm text-blue-700 font-medium px-1">
        يمكنك إضافة تصنيفات مخصصة للأسئلة وسيقوم النظام بتوليد أسئلة مناسبة
      </p>
    </div>
  );
};

export default CustomCategoryInput;
