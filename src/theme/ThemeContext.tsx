import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightTheme, darkTheme, Theme } from './colors';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [theme, setTheme] = useState<Theme>(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  useEffect(() => {
    if (themeMode === 'auto') {
      const updateTheme = () => {
        const scheme = Appearance.getColorScheme();
        setTheme(scheme === 'dark' ? darkTheme : lightTheme);
      };
      
      updateTheme();
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      });

      return () => subscription.remove();
    } else {
      setTheme(themeMode === 'dark' ? darkTheme : lightTheme);
    }
  }, [themeMode]);

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

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, toggleTheme }}>
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

