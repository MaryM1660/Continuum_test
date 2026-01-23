import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightTheme, darkTheme, Theme } from './colors';
import { createAppleHIGTheme, AppleHIGTheme } from './apple-hig/theme';

type ThemeMode = 'light' | 'dark' | 'auto';

// Флаг для переключения между старой и новой темой
// По умолчанию true (используем новую тему Apple HIG) - миграция завершена
const USE_APPLE_HIG = true;

interface ThemeContextType {
  theme: Theme | AppleHIGTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  useAppleHIG: boolean;
  setUseAppleHIG: (use: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [useAppleHIG, setUseAppleHIGState] = useState<boolean>(USE_APPLE_HIG);
  
  // Инициализация темы
  const getInitialTheme = (): Theme | AppleHIGTheme => {
    const isDark = systemColorScheme === 'dark';
    if (useAppleHIG) {
      return createAppleHIGTheme('auto', systemColorScheme);
    }
    return isDark ? darkTheme : lightTheme;
  };

  const [theme, setTheme] = useState<Theme | AppleHIGTheme>(getInitialTheme());

  // Обновление темы при изменении themeMode или useAppleHIG
  useEffect(() => {
    const updateTheme = () => {
      if (useAppleHIG) {
        // Используем новую тему Apple HIG
        if (themeMode === 'auto') {
          const scheme = Appearance.getColorScheme();
          setTheme(createAppleHIGTheme('auto', scheme));
        } else {
          setTheme(createAppleHIGTheme(themeMode));
        }
      } else {
        // Используем старую тему
        if (themeMode === 'auto') {
          const scheme = Appearance.getColorScheme();
          setTheme(scheme === 'dark' ? darkTheme : lightTheme);
        } else {
          setTheme(themeMode === 'dark' ? darkTheme : lightTheme);
        }
      }
    };

    if (themeMode === 'auto') {
      updateTheme();
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if (useAppleHIG) {
          setTheme(createAppleHIGTheme('auto', colorScheme));
        } else {
          setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
        }
      });

      return () => subscription.remove();
    } else {
      updateTheme();
    }
  }, [themeMode, useAppleHIG]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    if (themeMode === 'auto') {
      setThemeMode(systemColorScheme === 'dark' ? 'light' : 'dark');
    } else {
      setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
    }
  };

  const setUseAppleHIG = (use: boolean) => {
    setUseAppleHIGState(use);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeMode, 
      setThemeMode, 
      toggleTheme,
      useAppleHIG,
      setUseAppleHIG,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

