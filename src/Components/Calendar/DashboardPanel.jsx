import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const DashboardPanel = ({ range, data, onClose }) => {
  const isSingle = range[0] && !range[1];
  const isRange = range[0] && range[1];

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

  const Section = ({ title, items }) => (
    <div className="mb-4 max-w-6xl mx-auto p-4 bg-inherit text-inherit rounded-xl shadow-lg border border-black-200">
      <h4 className="text-md font-semibold text-blue-700 mb-1">{title}</h4>
      <ul className="list-disc list-inside text-gray-800 text-sm space-y-0.5">
        {items.map((item, idx) => (
          <li key={idx}>
            <span className="font-medium text-gray-600">{item.label}:</span>{' '}
            <span className="font-mono">{item.value}</span>
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
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 p-6 overflow-y-auto border-l border-gray-400 rounded-tl-xl rounded-bl-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {isSingle
            ? range[0].format('dddd, MMM D, YYYY')
            : `${range[0].format('MMM D')} - ${range[1].format('MMM D, YYYY')}`}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 transition"
          aria-label="Close dashboard panel"
        >
          <FaTimes size={18} />
        </button>
      </div>

      {!summaryData ? (
        <p className="text-gray-600">No data available for selected date</p>
      ) : (
        <div>
          <Section
            title="Prices"
            items={[
              { label: 'Open', value: format(summaryData.open) },
              { label: 'Close', value: format(summaryData.close) },
              { label: 'High', value: format(summaryData.high) },
              { label: 'Low', value: format(summaryData.low) },
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
              { label: 'Performance', value: formatPercent(summaryData.performance) },
              { label: 'Benchmark', value: formatPercent(summaryData.benchmarkPerf) },
              {
                label: 'Difference',
                value:
                  typeof summaryData.performance === 'number' &&
                  typeof summaryData.benchmarkPerf === 'number'
                    ? ((summaryData.performance - summaryData.benchmarkPerf) * 100).toFixed(2) + '%'
                    : 'N/A',
              },
            ]}
          />
          <Section
            title="Technical Indicators"
            items={[
              { label: 'Moving Average', value: movingAverage },
              { label: 'RSI', value: rsi },
            ]}
          />
        </div>
      )}
    </motion.div>
  );
};

export default DashboardPanel;
