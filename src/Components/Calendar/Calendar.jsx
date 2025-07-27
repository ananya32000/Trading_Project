import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { FaChevronLeft, FaChevronRight, FaSearchMinus, FaSearchPlus, FaCalendarAlt } from 'react-icons/fa';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import GradientText from '../gradient_text';
                
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
  const [filteredData, setFilteredData] = useState({});
  const [instrument, setInstrument] = useState(instruments[0]);
  const [range, setRange] = useState([null, null]);
  const [zoom, setZoom] = useState(1);
  const [selectedMetric, setSelectedMetric] = useState('volatility');
  const { theme, setTheme } = useTheme();
  const [dateFilter, setDateFilter] = useState('month');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  
  const anomalies = detectAnomalies(data, selectedMetric);

  useEffect(() => {
    const loadData = async () => {
      try {
        showGlobalLoader();
        const symbol = instrument?.value || 'BTCUSDT';
        const fetchedData = await fetchBinanceDailyData(symbol);
        setData(fetchedData);
        applyDateFilter(fetchedData);
      } catch (error) {
        console.error('Error loading calendar data:', error);
      } finally {
        hideGlobalLoader();
      }
    };
    loadData();
  }, [currentDate, instrument]);

  const applyDateFilter = (dataToFilter) => {
    let filtered = {};
    
    if (dateFilter === 'month') {
      const startOfMonth = currentDate.startOf('month');
      const endOfMonth = currentDate.endOf('month');
      
      Object.keys(dataToFilter).forEach(date => {
        const day = dayjs(date);
        if (day.isBetween(startOfMonth, endOfMonth, 'day', '[]')) {
          filtered[date] = dataToFilter[date];
        }
      });
    } 
    else if (dateFilter === 'week') {
      const startOfWeek = currentDate.startOf('week');
      const endOfWeek = currentDate.endOf('week');
      
      Object.keys(dataToFilter).forEach(date => {
        const day = dayjs(date);
        if (day.isBetween(startOfWeek, endOfWeek, 'day', '[]')) {
          filtered[date] = dataToFilter[date];
        }
      });
    }
    else if (dateFilter === 'day') {
      const dateStr = currentDate.format('YYYY-MM-DD');
      if (dataToFilter[dateStr]) {
        filtered[dateStr] = dataToFilter[dateStr];
      }
    }
    else if (dateFilter === 'custom' && customStartDate && customEndDate) {
      const start = dayjs(customStartDate);
      const end = dayjs(customEndDate);
      
      Object.keys(dataToFilter).forEach(date => {
        const day = dayjs(date);
        if (day.isBetween(start, end, 'day', '[]')) {
          filtered[date] = dataToFilter[date];
        }
      });
    } else {
      filtered = {...dataToFilter};
    }
    
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyDateFilter(data);
  }, [dateFilter, currentDate, customStartDate, customEndDate, data]);

  const onClickDay = (day) => {
    if (!range[0] || (range[0] || range[1])) {
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
    filteredData,
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
          
<GradientText
  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
  animationSpeed={3}
  showBorder={false}
  className="custom-class"
>
        <motion.h2
          className="text-center text-2xl font-bold mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {dayjs().format('dddd, MMMM D, YYYY')}
        </motion.h2></GradientText>

{/* Controls Section */}
<div className="flex flex-col gap-4 mb-6">
  {/* Top Row - Zoom, Export, Theme */}
  <div className="flex flex-wrap items-center justify-between gap-3">
    {/* Zoom Controls */}
    <div className="flex items-center gap-2">
      <button
        onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))}
        className={`p-2 rounded-full transition-all ${
          theme === 'highContrast'
            ? 'bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10'
            : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50'
        }`}
      >
        <FaSearchPlus className="w-4 h-4" />
      </button>
      <button
        onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
        className={`p-2 rounded-full transition-all ${
          theme === 'highContrast'
            ? 'bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10'
            : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50'
        }`}
      >
        <FaSearchMinus className="w-4 h-4" />
      </button>
      <span className={`text-sm ml-1 ${
        theme === 'highContrast' ? 'text-yellow-300' : 'text-gray-600'
      }`}>
        Zoom: {zoom}x
      </span>
    </div>

    {/* Right-aligned Controls */}
    <div className="flex flex-wrap items-center gap-3">
      <Select 
        options={instruments} 
        value={instrument} 
        onChange={setInstrument} 
        className="w-36"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: theme === 'highContrast' ? '#facc15' : '#e5e7eb',
            backgroundColor: theme === 'highContrast' ? '#000' : '#fff',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
          })
        }}
      />
      
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
        styles={{
          control: (base) => ({
            ...base,
            borderColor: theme === 'highContrast' ? '#facc15' : '#e5e7eb',
            backgroundColor: theme === 'highContrast' ? '#000' : '#fff',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
          })
        }}
      />
      
      <Select
        options={[
          { value: 'default', label: 'Default' },
          { value: 'highContrast', label: 'High Contrast' },
          { value: 'colorblind', label: 'Colorblind' },
        ]}
        value={{ value: theme, label: theme }}
        onChange={(option) => setTheme(option.value)}
        className="w-44"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: theme === 'highContrast' ? '#facc15' : '#e5e7eb',
            backgroundColor: theme === 'highContrast' ? '#000' : '#fff',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
          })
        }}
      />
      
      <button
        onClick={() => exportToCSV(filteredData)}
        className={`px-4 py-2 rounded-md transition-all ${
          theme === 'highContrast'
            ? 'bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
        }`}
      >
        Export CSV
      </button>
    </div>
  </div>

  {/* Date Filter Row */}
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
        <FaCalendarAlt className={
          theme === 'highContrast' ? 'text-yellow-400' : 'text-gray-500'
        } />
        <Select
          options={[
            { value: 'month', label: 'This Month' },
            { value: 'week', label: 'This Week' },
            { value: 'day', label: 'Today' },
            { value: 'custom', label: 'Custom Range' },
          ]}
          value={{ value: dateFilter, label: dateFilter === 'month' ? 'This Month' : 
                  dateFilter === 'week' ? 'This Week' : 
                  dateFilter === 'day' ? 'Today' : 'Custom Range' }}
          onChange={(option) => {
            setDateFilter(option.value);
            if (option.value !== 'custom') {
              setCurrentDate(dayjs());
            }
          }}
          className="w-40"
          styles={{
            control: (base) => ({
              ...base,
              border: 'none',
              backgroundColor: 'transparent',
              boxShadow: 'none'
            })
          }}
        />
      </div>
      
      {dateFilter === 'custom' && (
        <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
          <DatePicker
            selected={customStartDate}
            onChange={(date) => setCustomStartDate(date)}
            selectsStart
            startDate={customStartDate}
            endDate={customEndDate}
            placeholderText="Start Date"
            className={`w-28 text-sm focus:outline-none ${
              theme === 'highContrast' ? 'bg-black text-yellow-300' : ''
            }`}
          />
          <span className={theme === 'highContrast' ? 'text-yellow-300' : 'text-gray-500'}>to</span>
          <DatePicker
            selected={customEndDate}
            onChange={(date) => setCustomEndDate(date)}
            selectsEnd
            startDate={customStartDate}
            endDate={customEndDate}
            minDate={customStartDate}
            placeholderText="End Date"
            className={`w-28 text-sm focus:outline-none ${
              theme === 'highContrast' ? 'bg-black text-yellow-300' : ''
            }`}
          />
        </div>
      )}
    </div>

    {/* Navigation Controls */}
    <div className="flex items-center gap-3">
      <button 
        className={`p-2 rounded-full transition-all ${
          theme === 'highContrast' 
            ? 'bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10' 
            : 'bg-white hover:bg-blue-50 border border-gray-200 shadow-sm hover:shadow-md'
        }`}
        onClick={() => setCurrentDate((d) => d.subtract(1, view))}
      >
        <FaChevronLeft />
      </button>
      
      <button 
        className={`px-4 py-1 rounded-full transition-all ${
          theme === 'highContrast' 
            ? 'bg-yellow-400 text-black font-bold hover:bg-yellow-500' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
        }`}
        onClick={() => setCurrentDate(dayjs())}
      >
        Today
      </button>
      
      <button 
        className={`p-2 rounded-full transition-all ${
          theme === 'highContrast' 
            ? 'bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10' 
            : 'bg-white hover:bg-blue-50 border border-gray-200 shadow-sm hover:shadow-md'
        }`}
        onClick={() => setCurrentDate((d) => d.add(1, view))}
      >
        <FaChevronRight />
      </button>
    </div>
  </div>
</div>

{/* View Toggle */}
<div className="flex justify-center gap-3 mb-6">
  {['month', 'week', 'day'].map((v) => (
    <motion.button
      key={v}
      onClick={() => setView(v)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-5 py-2 rounded-full transition-all duration-200 ${
        view === v
          ? theme === 'highContrast'
            ? 'bg-yellow-400 text-black font-bold shadow-lg'
            : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
          : theme === 'highContrast'
          ? 'bg-black text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400/10'
          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:shadow-md'
      }`}
    >
      {v.charAt(0).toUpperCase() + v.slice(1)}
    </motion.button>
  ))}
</div>

{/* Calendar Grid */}
<motion.div
  layout
  className="grid gap-1.5 p-2 rounded-xl backdrop-blur-sm"
  style={{
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', 
    fontSize: `${zoom}rem`,
    backgroundColor: theme === 'highContrast' 
      ? 'rgba(0,0,0,0.7)' 
      : theme === 'colorblind' 
      ? 'rgba(254, 243, 199, 0.2)' 
      : 'rgba(255, 255, 255, 0.1)',
    border: theme === 'highContrast' 
      ? '1px solid rgba(234, 179, 8, 0.3)' 
      : '1px solid rgba(209, 213, 219, 0.3)'
  }}
>
  {cellDays.map((day, i) => (
    <CalendarCell
      key={i}
      day={day}
      onClick={() => onClickDay(day)}
      isToday={day.isSame(dayjs(), 'day')}
      isSelected={isSelected(day)}
      inRange={inRange(day)}
      data={filteredData[day.format('YYYY-MM-DD')]}
      isAnomalous={anomalies.has(day.format('YYYY-MM-DD'))}
      metric={selectedMetric}
      zoom={zoom}
      theme={theme}
    />
  ))}
</motion.div>
        {/* Legends */}
       
          <MetricLegend metric={selectedMetric} />
          <AnomalyLegend />

{/* Summary */}
<AnimatePresence>
  {summary && (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`mt-6 p-4 rounded-xl backdrop-blur-sm ${
        theme === 'highContrast' 
          ? 'bg-black/90 border-2 border-yellow-400 text-yellow-300' 
          : theme === 'colorblind' 
          ? 'bg-amber-50/20 border border-amber-300 text-amber-900' 
          : 'bg-black/10 border border-white/30 text-white'  // Brighter white elements
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold tracking-wider uppercase ${
          theme === 'highContrast' ? 'text-yellow-300' :
          theme === 'colorblind' ? 'text-amber-700' : 'text-white/90'  // Brighter white text
        }`}>
          Market Summary
        </h3>
        <span className={`text-xs ${
          theme === 'highContrast' ? 'text-yellow-400' :
          theme === 'colorblind' ? 'text-amber-600' : 'text-white/70'  // Lighter white
        }`}>
          {dayjs().format('MMM D')}
        </span>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <div className={`text-xs mb-1 ${
            theme === 'highContrast' ? 'text-yellow-400' :
            theme === 'colorblind' ? 'text-amber-600' : 'text-white/70'  // Lighter white
          }`}>
            Volatility
          </div>
          <div className={`text-2xl font-bold ${
            theme === 'highContrast' ? 'text-yellow-300' :
            theme === 'colorblind' ? 'text-amber-700' : 'text-white'  // Pure white
          }`}>
            {(summary.volatility * 100).toFixed(2)}%
          </div>
        </div>
        
        <div className="flex-1">
          <div className={`text-xs mb-1 ${
            theme === 'highContrast' ? 'text-yellow-400' :
            theme === 'colorblind' ? 'text-amber-600' : 'text-white/70'  // Lighter white
          }`}>
            Performance
          </div>
          <div className={`text-2xl font-bold ${
            theme === 'highContrast' ? 'text-yellow-300' :
            theme === 'colorblind' ? 'text-amber-700' : 'text-white'  // Pure white
          }`}>
            {(summary.performance * 100).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className={`mt-3 pt-3 border-t ${
        theme === 'highContrast' ? 'border-yellow-400/30' :
        theme === 'colorblind' ? 'border-amber-300/30' : 'border-white/20'  // White border
      }`}>
        <div className={`text-xs ${
          theme === 'highContrast' ? 'text-yellow-400/80' :
          theme === 'colorblind' ? 'text-amber-600/80' : 'text-white/60'  // White text
        }`}>
          {summary.volatility > 0.05 ? (
            <span>↗ High market activity</span>
          ) : (
            <span>↘ Stable conditions</span>
          )}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
        {/* Chart */}
        {summary && (
          <div className="mt-4 p-4 rounded-xl bg-transparent shadow-md border border-gray-200">
            <SummaryChart data={filteredData} metric={selectedMetric} />
          </div>
        )}

        {/* Dashboard Panel */}
        <AnimatePresence>
          {range[0] && (
            <DashboardPanel
              range={range}
              data={filteredData}
              onClose={() => setRange([null, null])}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Calendar;