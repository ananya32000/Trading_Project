import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';

const DashboardPanel = ({ range, data, onClose }) => {
  const { theme } = useTheme();
  const isSingle = range[0] && !range[1];
  const isRange = range[0] && range[1];

  // Theme-based colors
  const themeColors = {
    default: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-800',
      heading: 'text-blue-700',
      accent: 'text-blue-600',
      muted: 'text-gray-600',
      panelBg: 'bg-white',
      panelBorder: 'border-gray-300'
    },
    highContrast: {
      bg: 'bg-black',
      border: 'border-yellow-400',
      text: 'text-yellow-300',
      heading: 'text-yellow-400',
      accent: 'text-yellow-300',
      muted: 'text-yellow-400',
      panelBg: 'bg-gray-900',
      panelBorder: 'border-yellow-400'
    },
    colorblind: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      heading: 'text-blue-700',
      accent: 'text-blue-600',
      muted: 'text-amber-700',
      panelBg: 'bg-amber-50',
      panelBorder: 'border-amber-300'
    }
  };

  const colors = themeColors[theme] || themeColors.default;

  const getRangeSummary = (data, startDate, endDate) => {
    const start = startDate.clone();
    const end = endDate.clone();
    let count = 0;

    const summary = {
      open: null,
      close: null,
      high: -Infinity,
      low: Infinity,
      volume: 0,
      liquidity: 0,
      volatility: 0,
      stdDev: 0,
      performance: 0,
      benchmarkPerf: 0,
    };

    let volSum = 0;
    let volSqSum = 0;

    for (let day = start.clone(); day.isSameOrBefore(end); day.add(1, 'day')) {
      const dayStr = day.format('YYYY-MM-DD');
      const d = data[dayStr];
      if (!d) continue;

      if (summary.open === null) summary.open = d.open;
      summary.close = d.close;

      summary.high = Math.max(summary.high, d.high);
      summary.low = Math.min(summary.low, d.low);
      summary.volume += d.volume || 0;
      summary.liquidity += d.liquidity || 0;
      summary.performance += d.performance || 0;
      summary.benchmarkPerf += d.benchmarkPerf || 0;

      const vol = d.volatility || 0;
      volSum += vol;
      volSqSum += vol * vol;
      summary.volatility += vol;
      count++;
    }

    if (count === 0) return null;

    summary.volume /= count;
    summary.liquidity /= count;
    summary.performance /= count;
    summary.benchmarkPerf /= count;
    summary.volatility /= count;

    const mean = volSum / count;
    summary.stdDev = Math.sqrt(volSqSum / count - mean * mean);

    return summary;
  };

  let summaryData = null;
  try {
    summaryData = isSingle
      ? data[range[0].format('YYYY-MM-DD')]
      : isRange
      ? getRangeSummary(data, range[0], range[1])
      : null;
  } catch (err) {
    console.error("Error computing summary data:", err);
  }

  const format = (val, digits = 2) => (typeof val === 'number' ? val.toFixed(digits) : 'N/A');
  const formatPercent = (val) => (typeof val === 'number' ? (val * 100).toFixed(2) + '%' : 'N/A');
  const movingAverage = typeof summaryData?.close === 'number' ? (summaryData.close * 0.98).toFixed(2) : 'N/A';
  const rsi = 55; // Placeholder
  const vixLike = typeof summaryData?.volatility === 'number' ? (summaryData.volatility * 1.5).toFixed(2) : 'N/A';

  const getPerformanceColor = (value) => {
    if (typeof value !== 'number') return colors.text;
    return value >= 0 
      ? theme === 'highContrast' ? 'text-yellow-300' : 'text-green-600'
      : theme === 'highContrast' ? 'text-yellow-400' : 'text-red-600';
  };

  const Section = ({ title, items }) => (
    <div className={`mb-4 p-4 rounded-xl shadow-sm ${colors.panelBg} ${colors.panelBorder} border`}>
      <h4 className={`text-md font-semibold ${colors.heading} mb-2 pb-1 border-b ${colors.border}`}>
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between">
            <span className={`font-medium ${colors.muted}`}>{item.label}</span>
            <span className={`font-mono ${item.isPerformance ? getPerformanceColor(item.value) : colors.text}`}>
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed top-0 right-0 h-full w-96 shadow-2xl z-50 p-6 overflow-y-auto border-l ${colors.border} ${colors.bg}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold ${colors.text}`}>
          {isSingle
            ? range[0].format('dddd, MMM D, YYYY')
            : `${range[0].format('MMM D')} - ${range[1].format('MMM D, YYYY')}`}
        </h3>
        <button
          onClick={onClose}
          className={`${colors.text} hover:${theme === 'highContrast' ? 'text-yellow-400' : 'text-red-500'} transition`}
          aria-label="Close dashboard panel"
        >
          <FaTimes size={18} />
        </button>
      </div>

      {!summaryData ? (
        <p className={colors.muted}>No data available for selected date</p>
      ) : (
        <div>
          <Section
            title="Prices"
            items={[
              { label: 'Open', value: `$${format(summaryData.open)}` },
              { label: 'Close', value: `$${format(summaryData.close)}` },
              { label: 'High', value: `$${format(summaryData.high)}` },
              { label: 'Low', value: `$${format(summaryData.low)}` },
            ]}
          />
          <Section
            title="Volume & Liquidity"
            items={[
              { label: 'Volume', value: format(summaryData.volume) },
              { label: 'Liquidity', value: format(summaryData.liquidity) },
            ]}
          />
          <Section
            title="Volatility"
            items={[
              { label: 'Volatility', value: formatPercent(summaryData.volatility) },
              { label: 'Std Dev', value: format(summaryData.stdDev, 4) },
              { label: 'VIX-like Index', value: vixLike },
            ]}
          />
          <Section
            title="Performance"
            items={[
              { label: 'Performance', value: formatPercent(summaryData.performance), isPerformance: true },
              { label: 'Benchmark', value: formatPercent(summaryData.benchmarkPerf), isPerformance: true },
              {
                label: 'Difference',
                value:
                  typeof summaryData.performance === 'number' &&
                  typeof summaryData.benchmarkPerf === 'number'
                    ? ((summaryData.performance - summaryData.benchmarkPerf) * 100).toFixed(2) + '%'
                    : 'N/A',
                isPerformance: true
              },
            ]}
          />
          <Section
            title="Technical Indicators"
            items={[
              { label: 'Moving Average', value: `$${movingAverage}` },
              { label: 'RSI', value: rsi },
            ]}
          />
        </div>
      )}
    </motion.div>
  );
};

export default DashboardPanel;