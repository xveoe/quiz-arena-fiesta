
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

// تعريف الثيمات المتاحة
export type ThemeType = 'gold' | 'light' | 'dark' | 'blood';

interface ThemeOption {
  id: ThemeType;
  name: string;
  icon: string;
}

const themes: ThemeOption[] = [
  { id: 'gold', name: 'ذهبي', icon: '✨' },
  { id: 'light', name: 'أبيض', icon: '☀️' },
  { id: 'dark', name: 'أسود', icon: '🌙' },
  { id: 'blood', name: 'أحمر دموي', icon: '🔴' },
];

interface ThemeSelectorProps {
  onThemeChange?: (theme: ThemeType) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('gold');
  
  // استرجاع الثيم المحفوظ عند التحميل
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (onThemeChange) onThemeChange(savedTheme);
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
        <Button variant="outline" size="icon" className="theme-button theme-border">
          <Palette className="h-5 w-5 theme-text" />
          <span className="sr-only">تغيير الثيم</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-card border theme-border shadow-lg">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            className={`flex items-center gap-2 cursor-pointer ${currentTheme === theme.id ? 'theme-selected-item' : ''}`}
            onClick={() => changeTheme(theme.id)}
          >
            <span className="text-lg">{theme.icon}</span>
            <span>{theme.name}</span>
            {currentTheme === theme.id && <span className="ml-2">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
