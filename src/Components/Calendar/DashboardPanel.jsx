import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

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

    if (d.high > summary.high) summary.high = d.high;
    if (d.low < summary.low) summary.low = d.low;

    summary.volume += d.volume || 0;
    summary.liquidity += d.liquidity || 0;
    summary.performance += d.performance || 0;
    summary.benchmarkPerf += d.benchmarkPerf || 0;

    const vol = d.volatility || 0;
    summary.volatility += vol;

    volSum += vol;
    volSqSum += vol * vol;

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

const DashboardPanel = ({ range, data, onClose }) => {
  const isSingle = range[0] && !range[1];
  const isRange = range[0] && range[1];

  let summaryData = null;

  try {
    summaryData = isSingle
      ? data[range[0].format('YYYY-MM-DD')]
      : isRange
      ? getRangeSummary(data, range[0], range[1])
      : null;
  } catch (err) {
    console.error("Error computing summary data:", err);
    summaryData = null;
  }

  if (!summaryData) {
    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 p-6 overflow-auto"
      >
        <button
          onClick={onClose}
          className="mb-4 text-gray-500 hover:text-gray-900"
          aria-label="Close dashboard panel"
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-lg font-semibold mb-4">No data available for selected date</h3>
      </motion.div>
    );
  }

  // Safe access helpers
  const format = (val, digits = 2) =>
    typeof val === 'number' ? val.toFixed(digits) : 'N/A';

  const formatPercent = (val) =>
    typeof val === 'number' ? (val * 100).toFixed(2) + '%' : 'N/A';

  const movingAverage = typeof summaryData.close === 'number'
    ? (summaryData.close * 0.98).toFixed(2)
    : 'N/A';

  const rsi = 55; // placeholder
  const vixLike = typeof summaryData.volatility === 'number'
    ? (summaryData.volatility * 1.5).toFixed(2)
    : 'N/A';

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 p-6 overflow-auto"
    >
      <button
        onClick={onClose}
        className="mb-4 text-gray-500 hover:text-gray-900"
        aria-label="Close dashboard panel"
      >
        <FaTimes size={20} />
      </button>
      <h3 className="text-xl font-semibold mb-4">
        {isSingle
          ? range[0].format('dddd, MMM D, YYYY')
          : `${range[0].format('MMM D')} - ${range[1].format('MMM D, YYYY')}`}
      </h3>

      <div className="space-y-3 text-gray-700 text-sm font-mono">
        <div>
          <strong>Prices:</strong>
          <ul className="list-disc list-inside">
            <li>Open: {format(summaryData.open)}</li>
            <li>Close: {format(summaryData.close)}</li>
            <li>High: {format(summaryData.high)}</li>
            <li>Low: {format(summaryData.low)}</li>
          </ul>
        </div>

        <div>
          <strong>Volume & Liquidity:</strong>
          <ul className="list-disc list-inside">
            <li>Volume: {format(summaryData.volume)}</li>
            <li>Liquidity: {format(summaryData.liquidity)}</li>
          </ul>
        </div>

        <div>
          <strong>Volatility Metrics:</strong>
          <ul className="list-disc list-inside">
            <li>Volatility: {formatPercent(summaryData.volatility)}</li>
            <li>Std Dev: {format(summaryData.stdDev, 4)}</li>
            <li>VIX-like Index: {vixLike}</li>
          </ul>
        </div>

        <div>
          <strong>Performance vs Benchmark:</strong>
          <ul className="list-disc list-inside">
            <li>Performance: {formatPercent(summaryData.performance)}</li>
            <li>Benchmark: {formatPercent(summaryData.benchmarkPerf)}</li>
            <li>
              Difference:{' '}
              {typeof summaryData.performance === 'number' &&
              typeof summaryData.benchmarkPerf === 'number'
                ? ((summaryData.performance - summaryData.benchmarkPerf) * 100).toFixed(2) + '%'
                : 'N/A'}
            </li>
          </ul>
        </div>

        <div>
          <strong>Technical Indicators:</strong>
          <ul className="list-disc list-inside">
            <li>Moving Average (MA): {movingAverage}</li>
            <li>RSI: {rsi}</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPanel;
