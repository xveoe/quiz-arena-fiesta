
import React from 'react';

// تعريف الثيم الافتراضي - فقط الفضي
export type ThemeType = 'silver';

interface ThemeSelectorProps {
  onThemeChange?: (theme: ThemeType) => void;
}

// تم إلغاء وظيفة تبديل الثيمات وتثبيت الثيم الفضي كافتراضي
const ThemeSelector: React.FC<ThemeSelectorProps> = () => {
  // تهيئة الثيم الفضي
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'silver');
    localStorage.setItem('theme', 'silver');
  }, []);
  
  // لا يظهر أي عنصر في الواجهة
  return null;
};

export default ThemeSelector;
