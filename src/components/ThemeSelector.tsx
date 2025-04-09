
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
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={isMobile ? "icon" : "icon"}
          className="theme-button theme-border w-8 h-8 p-0"
        >
          <Palette className="h-4 w-4 theme-text" />
          <span className="sr-only">تغيير الثيم</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-card border theme-border shadow-lg w-44">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            className={`flex items-center gap-2 cursor-pointer text-sm py-1.5 ${currentTheme === theme.id ? 'theme-selected-item' : ''}`}
            onClick={() => changeTheme(theme.id)}
          >
            <span className="text-base">{theme.icon}</span>
            <span>{theme.name}</span>
            {currentTheme === theme.id && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
