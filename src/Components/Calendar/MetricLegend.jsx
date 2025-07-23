import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';

const legends = {
  volatility: [
    { color: 'bg-gray-100', label: '< 1%' },
    { color: 'bg-yellow-100', label: '1% – 2%' },
    { color: 'bg-orange-200', label: '2% – 4%' },
    { color: 'bg-red-300', label: '4% – 6%' },
    { color: 'bg-red-500 text-white', label: '> 6%' },
  ],
  volume: [
    { color: 'bg-green-50', label: '< 500' },
    { color: 'bg-green-100', label: '500 – 2K' },
    { color: 'bg-green-300', label: '2K – 5K' },
    { color: 'bg-green-500 text-white', label: '> 5K' },
  ],
  rsi: [
    { color: 'bg-blue-200', label: '< 30 (Oversold)' },
    { color: 'bg-white', label: '30 – 70 (Neutral)' },
    { color: 'bg-pink-200', label: '> 70 (Overbought)' },
  ],
  liquidity: [
    { color: 'bg-purple-50', label: '< 400' },
    { color: 'bg-purple-200', label: '400 – 800' },
    { color: 'bg-purple-100', label: '> 800' },
  ],
};

const MetricLegend = ({ metric }) => {
  const { theme } = useTheme();
  const items = legends[metric] || [];

  const containerClasses =
    theme === 'highContrast'
      ? 'mt-4 bg-black text-yellow-300 border border-yellow-400 p-4 rounded shadow-sm text-sm w-fit'
      : 'mt-4 bg-white text-black border border-gray-300 p-4 rounded shadow-sm text-sm w-fit';

  const labelColor = theme === 'highContrast' ? 'text-yellow-300' : 'text-gray-700';

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`font-semibold mb-2 ${labelColor}`}>
        Legend: {metric.charAt(0).toUpperCase() + metric.slice(1)}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-5 h-5 rounded ${item.color} border`} />
            <span className={labelColor}>{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MetricLegend;
