import React from 'react';
import { useTheme } from './ThemeContext';

const AnomalyLegend = () => {
  const { theme } = useTheme();

  const dotStyle =
    theme === 'highContrast'
      ? 'bg-yellow-300 border border-black'
      : 'bg-red-500 border';

  const textStyle =
    theme === 'highContrast'
      ? 'text-yellow-300'
      : 'text-gray-700';

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className={`w-3 h-3 rounded-full ${dotStyle}`} />
      <span className={`text-sm text-white ${textStyle}`}>Red dot = Anomaly detected</span>
    </div>
  );
};

export default AnomalyLegend;
