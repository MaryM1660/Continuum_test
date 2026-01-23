import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Theme, lightTheme } from './colors';

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  
  // Проверяем, что контекст существует и имеет theme
  if (context && typeof context === 'object' && 'theme' in context) {
    return context.theme;
  }
  
  // Fallback для случаев, когда ThemeProvider не обернут
  return lightTheme;
};

