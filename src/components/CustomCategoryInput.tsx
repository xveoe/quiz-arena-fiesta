
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
  
  return (
    <div className="flex flex-col space-y-3 mb-4">
      <div className="flex items-center gap-3">
        <Input
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          placeholder="أدخل تصنيف الأسئلة الخاص بك"
          className="modern-input flex-grow text-gray-800 placeholder:text-blue-400 rounded-xl border-blue-100 focus:border-blue-400 bg-white shadow-sm"
        />
        <Button
          onClick={handleAddCategory}
          disabled={customCategory.trim().length === 0}
          className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-1" />
          إضافة
        </Button>
      </div>
      <p className="text-xs text-blue-500 px-1">
        يمكنك إضافة تصنيفات مخصصة للأسئلة وسيقوم النظام بتوليد أسئلة مناسبة
      </p>
    </div>
  );
};

export default CustomCategoryInput;
