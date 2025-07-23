import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();
export { ThemeContext }; 

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('default'); // 'default' | 'highContrast' | 'colorblind'

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
