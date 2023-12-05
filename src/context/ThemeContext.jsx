import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsDarkMode(currentHour >= 18 || currentHour < 6);

    const intervalId = setInterval(() => {
      const newHour = new Date().getHours();
      setIsDarkMode(newHour >= 18 || newHour < 6);
    }, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const value = {
    isDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
