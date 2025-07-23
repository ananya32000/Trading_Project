import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { FaChevronLeft, FaChevronRight, FaSearchMinus, FaSearchPlus } from 'react-icons/fa';
import CalendarCell from './CalendarCell';
import DashboardPanel from './DashboardPanel';
import { AnimatePresence, motion } from 'framer-motion';
import Select from 'react-select';
import { getRangeSummary } from './summaries';
import { fetchBinanceDailyData } from '../../utils/fetchBinanceData';
import MetricLegend from './MetricLegend';
import SummaryChart from '../summaryChart';
import { exportToCSV } from '../../utils/exporttoCSV';
import { showGlobalLoader, hideGlobalLoader } from '../../utils/exportToPDF';
import { useTheme } from '../ThemeContext';
import { detectAnomalies } from '../../utils/detectPatterns';
import AnomalyLegend from '../AnomalyLegend';

dayjs.extend(isBetween);

const instruments = [
  { value: 'BTCUSDT', label: 'Bitcoin' },
  { value: 'ETHUSDT', label: 'Ethereum' },
  { value: 'BNBUSDT', label: 'BNB' },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState('month');
  const [data, setData] = useState({});
  const [instrument, setInstrument] = useState(instruments[0]);
  const [range, setRange] = useState([null, null]);
  const [zoom, setZoom] = useState(1);
  const [selectedMetric, setSelectedMetric] = useState('volatility');
  const { theme, setTheme } = useTheme();
  const anomalies = detectAnomalies(data, selectedMetric);

  useEffect(() => {
    const loadData = async () => {
      try {
        showGlobalLoader();
        const symbol = instrument?.value || 'BTCUSDT';
        const fetchedData = await fetchBinanceDailyData(symbol);
        setData(fetchedData);
      } catch (error) {
        console.error('Error loading calendar data:', error);
      } finally {
        hideGlobalLoader();
      }
    };
    loadData();
  }, [currentDate, instrument]);

  const onClickDay = (day) => {
    if (!range[0] || (range[0] && range[1])) {
      setRange([day, null]);
    } else {
      const [start] = range;
      setRange(day.isBefore(start) ? [day, start] : [start, day]);
    }
  };

  const inRange = (day) => {
    const [a, b] = range;
    return a && b && day.isBetween(a, b, 'day', '[]');
  };

  const isSelected = (day) => range[0] && !range[1] && day.isSame(range[0], 'day');

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') setCurrentDate((d) => d.subtract(1, view));
      if (e.key === 'ArrowRight') setCurrentDate((d) => d.add(1, view));
      if (e.key === 'Escape') {
        setRange([null, null]);
        setCurrentDate(dayjs());
      }
    },
    [view]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const summary = getRangeSummary(
    data,
    view === 'week' ? currentDate.startOf('week') : currentDate.startOf('month'),
    view === 'week' ? currentDate.endOf('week') : currentDate.endOf('month')
  );

  const cellDays =
    view === 'month'
      ? Array.from({ length: 42 }, (_, i) =>
          currentDate.startOf('month').startOf('week').add(i, 'day')
        )
      : view === 'week'
      ? Array.from({ length: 7 }, (_, i) => currentDate.startOf('week').add(i, 'day'))
      : [currentDate];

  const themedButton = (base, hc) => (theme === 'highContrast' ? hc : base);

  return (
    <motion.div
      className={`theme-${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto p-6 rounded-2xl animated-gradient-border text-inherit">
        {/* Header */}
        <motion.h2
          className="text-center text-2xl font-bold mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {dayjs().format('dddd, MMMM D, YYYY')}
        </motion.h2>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))}
              className={themedButton(
                "p-2 bg-white rounded-full shadow-md hover:bg-blue-100 transition duration-200 focus:ring-2 ring-blue-300",
                "p-2 bg-black text-yellow-300 rounded-full hover:bg-gray-800 transition"
              )}
            >
              <FaSearchPlus />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
              className={themedButton(
                "p-2 bg-white rounded-full shadow-md hover:bg-blue-100 transition duration-200 focus:ring-2 ring-blue-300",
                "p-2 bg-black text-yellow-300 rounded-full hover:bg-gray-800 transition"
              )}
            >
              <FaSearchMinus />
            </button>
          </div>

          <Select options={instruments} value={instrument} onChange={setInstrument} className="w-32" />
          <Select
            options={[
              { value: 'volatility', label: 'Volatility' },
              { value: 'volume', label: 'Volume' },
              { value: 'liquidity', label: 'Liquidity' },
              { value: 'rsi', label: 'RSI' },
            ]}
            value={{ value: selectedMetric, label: selectedMetric }}
            onChange={(option) => setSelectedMetric(option.value)}
            className="w-40"
          />
          <Select
            options={[
              { value: 'default', label: 'Default' },
              { value: 'highContrast', label: 'High Contrast' },
              { value: 'colorblind', label: 'Colorblind-Friendly' },
            ]}
            value={{ value: theme, label: theme }}
            onChange={(option) => setTheme(option.value)}
            className="w-48"
          />
          <button
            onClick={() => exportToCSV(data)}
            className={themedButton(
              "px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition",
              "px-4 py-2 bg-black text-yellow-300 rounded shadow hover:bg-gray-800 transition"
            )}
          >
            Export CSV
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 shadow transition" onClick={() => setCurrentDate((d) => d.subtract(1, view))}>
            <FaChevronLeft />
          </button>
          <button className="px-4 py-1 bg-white rounded-full hover:bg-blue-50 shadow transition" onClick={() => setCurrentDate(dayjs())}>
            Today
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 shadow transition" onClick={() => setCurrentDate((d) => d.add(1, view))}>
            <FaChevronRight />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-3 mb-4">
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-full transition duration-200 shadow-md ${
                view === v
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white hover:bg-blue-50 text-gray-700'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Calendar Grid */}
        <motion.div
          layout
          className="grid gap-1"
          style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', fontSize: `${zoom}rem` }}
        >
          {cellDays.map((day, i) => (
            <CalendarCell
              key={i}
              day={day}
              onClick={() => onClickDay(day)}
              isToday={day.isSame(dayjs(), 'day')}
              isSelected={isSelected(day)}
              inRange={inRange(day)}
              data={data[day.format('YYYY-MM-DD')]}
              isAnomalous={anomalies.has(day.format('YYYY-MM-DD'))}
              metric={selectedMetric}
              zoom={zoom}
            />
          ))}
        </motion.div>

        {/* Legends */}
        <div className="mt-6 p-4 rounded-xl  bg-white shadow-xl border border-gray-300">
          <MetricLegend metric={selectedMetric} />
          <AnomalyLegend />
        </div>

        {/* Summary */}
        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mt-4 p-4 rounded-xl shadow-xl text-sm border border-gray-200 transition duration-200"
              style={{
                backgroundColor:
                  theme === 'highContrast' ? '#000' :
                  theme === 'colorblind' ? '#fef3c7' : '#fff',
                color:
                  theme === 'highContrast' ? '#ff0' :
                  theme === 'colorblind' ? '#000' : '#000',
              }}
            >
              <strong>Summary:</strong> Volatility: {(summary.volatility * 100).toFixed(2)}%, Performance: {(summary.performance * 100).toFixed(2)}%
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chart */}
        {summary && (
          <div className="mt-4 p-4 rounded-xl bg-white shadow-md border border-gray-200">
            <SummaryChart data={data} metric={selectedMetric} />
          </div>
        )}

        {/* Dashboard Panel */}
        <AnimatePresence>
          {range[0] && (
            <DashboardPanel
              range={range}
              data={data}
              onClose={() => setRange([null, null])}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Calendar;
