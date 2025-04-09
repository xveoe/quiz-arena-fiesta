
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Palette } from 'lucide-react';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

// تعريف الثيمات المتاحة
export type ThemeType = 'silver' | 'gold' | 'light' | 'dark' | 'blood';

interface ThemeOption {
  id: ThemeType;
  name: string;
  icon: string;
}

const themes: ThemeOption[] = [
  { id: 'silver', name: 'فضي', icon: '🔗' },
  { id: 'gold', name: 'ذهبي', icon: '✨' },
  { id: 'light', name: 'أبيض', icon: '☀️' },
  { id: 'dark', name: 'أسود', icon: '🌙' },
  { id: 'blood', name: 'أحمر دموي', icon: '🔴' },
];

interface ThemeSelectorProps {
  onThemeChange?: (theme: ThemeType) => void;
}

// This component is hidden but preserved for future use
const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('silver');
  const isMobile = useIsMobile();
  
  // استرجاع الثيم المحفوظ عند التحميل
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (onThemeChange) onThemeChange(savedTheme);
    } else {
      // تعيين الثيم الفضي كافتراضي
      setCurrentTheme('silver');
      document.documentElement.setAttribute('data-theme', 'silver');
      localStorage.setItem('theme', 'silver');
      if (onThemeChange) onThemeChange('silver');
    }
  }, [onThemeChange]);
  
  const changeTheme = (themeId: ThemeType) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('theme', themeId);
    
    if (onThemeChange) onThemeChange(themeId);
    
    toast.success(`تم تغيير الثيم إلى ${themes.find(t => t.id === themeId)?.name}`);
  };
  
  return null; // Component is hidden
};

export default ThemeSelector;
