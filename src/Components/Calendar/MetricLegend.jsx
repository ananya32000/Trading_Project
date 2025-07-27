import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';

const getThemeColors = (theme) => {
  switch (theme) {
    case 'highContrast':
      return {
        bg: 'bg-black/90 backdrop-blur-sm',
        border: 'border-2 border-yellow-400',
        text: 'text-yellow-300',
        itemBorder: 'border-yellow-400',
        legendBox: 'border-yellow-400'
      };
    case 'colorblind':
      return {
        bg: 'bg-amber-50/20 backdrop-blur-sm',
        border: 'border border-amber-300',
        text: 'text-amber-800',
        itemBorder: 'border-amber-400',
        legendBox: 'border-amber-300'
      };
    default:
      return {
        bg: 'bg-black/10 ',
        border: 'border border-white/30',
        text: 'text-white',
        itemBorder: 'border-white/40',
        legendBox: 'border-gray-300/30'
      };
  }
};

const legends = {
  volatility: [
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-gray-800' : 'bg-gray-100', 
      label: '< 1%' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-yellow-900' : 'bg-yellow-100', 
      label: '1% – 2%' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-yellow-700' : 'bg-orange-200', 
      label: '2% – 4%' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-orange-600' : 'bg-red-300', 
      label: '4% – 6%' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-red-500 text-yellow-300' : 'bg-red-500 text-white', 
      label: '> 6%' 
    },
  ],
  volume: [
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-gray-800' : 'bg-green-50', 
      label: '< 500' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-green-900' : 'bg-green-100', 
      label: '500 – 2K' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-green-700' : 'bg-green-300', 
      label: '2K – 5K' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-green-500 text-yellow-300' : 'bg-green-500 text-white', 
      label: '> 5K' 
    },
  ],
  rsi: [
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-blue-900' : 'bg-blue-200', 
      label: '< 30 (Oversold)' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-gray-800' : 'bg-white', 
      label: '30 – 70 (Neutral)' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-purple-700' : 'bg-pink-200', 
      label: '> 70 (Overbought)' 
    },
  ],
  liquidity: [
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-gray-800' : 'bg-purple-50', 
      label: '< 400' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-purple-900' : 'bg-purple-200', 
      label: '400 – 800' 
    },
    { 
      color: (theme) => theme === 'highContrast' ? 'bg-purple-700' : 'bg-purple-100', 
      label: '> 800' 
    },
  ],
};

const MetricLegend = ({ metric }) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const items = legends[metric] || [];

  return (
    <motion.div
      className={`mt-4 p-4 rounded-xl shadow-sm text-sm w-fit ${themeColors.bg} ${themeColors.border}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`font-semibold mb-3 text-lg ${themeColors.text}`}>
        {metric.charAt(0).toUpperCase() + metric.slice(1)} Legend
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <motion.div 
            key={index} 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div 
              className={`w-5 h-5 rounded-sm ${item.color(theme)} border ${themeColors.itemBorder} shadow-sm`}
            />
            <span className={`text-sm ${themeColors.text}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MetricLegend;