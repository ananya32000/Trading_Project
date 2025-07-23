import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { FaChevronLeft, FaChevronRight, FaSearchMinus, FaSearchPlus } from 'react-icons/fa';
import CalendarCell from './CalendarCell';
import DashboardPanel from './DashboardPanel';
import { AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { getRangeSummary } from './summaries';
import { fetchBinanceDailyData } from '../../utils/fetchBinanceData';
import MetricLegend from './MetricLegend';
import SummaryChart from '../summaryChart';
import { exportToCSV } from '../../utils/exporttoCSV';
import { exportToPDF } from '../../utils/exportToPDF';
import { exportCalendarAsImage } from '../../utils/exportToImage';
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
      const fetchedData = await fetchBinanceDailyData(instrument.value);
      setData(fetchedData);
    };
    loadData();
  }, [currentDate, instrument]);

  const onClickDay = (day) => {
    if (!range[0] || (range[0] && range[1])) {
      setRange([day, null]);
    } else {
      const [start] = range;
      if (day.isBefore(start)) setRange([day, start]);
      else setRange([start, day]);
    }
  };

  const inRange = (day) => {
    const [a, b] = range;
    return a && b && day.isBetween(a, b, 'day', '[]');
  };

  const isSelected = (day) => {
    return range[0] && !range[1] && day.isSame(range[0], 'day');
  };

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

  const numCols = 7;
  const cellDays =
    view === 'month'
      ? (() => {
          const start = currentDate.startOf('month').startOf('week');
          return Array.from({ length: 42 }, (_, i) => start.add(i, 'day'));
        })()
      : view === 'week'
      ? Array.from({ length: 7 }, (_, i) => currentDate.startOf('week').add(i, 'day'))
      : [currentDate];

  const themedButton = (base, hc) => (theme === 'highContrast' ? hc : base);

  return (
    <div className={`theme-${theme}`}>
      <div className="max-w-6xl mx-auto p-4 bg-inherit text-inherit rounded-xl shadow-lg">

        {/* Calendar Title */}
       <div
  className={`mb-4 text-xl font-semibold text-center ${
    theme === 'highContrast'
      ? 'text-yellow-300'
      : theme === 'colorblind'
      ? 'text-orange-600'
      : 'text-gray-800 dark:text-black'
  }`}
>
  {dayjs().format('dddd, MMMM D, YYYY')}
</div>


        {/* Control Bar */}
        <div className="flex flex-wrap items-center justify-between mb-4 space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))}
              className={themedButton("p-2 bg-white rounded-full shadow hover:bg-blue-100 transition", "p-2 bg-black text-yellow-300 rounded-full shadow hover:bg-gray-800 transition")}
              aria-label="Zoom In"
            >
              <FaSearchPlus />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
              className={themedButton("p-2 bg-white rounded-full shadow hover:bg-blue-100 transition", "p-2 bg-black text-yellow-300 rounded-full shadow hover:bg-gray-800 transition")}
              aria-label="Zoom Out"
            >
              <FaSearchMinus />
            </button>
          </div>

          <Select options={instruments} value={instrument} onChange={setInstrument} className="w-32" aria-label="Select Instrument" />

          <Select
            options={[
              { value: 'volatility', label: 'Volatility' },
              { value: 'volume', label: 'Volume' },
              { value: 'liquidity', label: 'Liquidity' },
              { value: 'rsi', label: 'RSI' },
            ]}
            value={{ value: selectedMetric, label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1) }}
            onChange={(option) => setSelectedMetric(option.value)}
            className="w-40"
            aria-label="Select Metric"
          />

          <Select
            options={[
              { value: 'default', label: 'Default' },
              { value: 'highContrast', label: 'High Contrast' },
              { value: 'colorblind', label: 'Colorblind-Friendly' },
            ]}
            value={{ value: theme, label: theme.charAt(0).toUpperCase() + theme.slice(1) }}
            onChange={(option) => setTheme(option.value)}
            className="w-48"
            aria-label="Select Theme"
          />

          <button onClick={() => exportToCSV(data)} className={themedButton("px-3 py-2 bg-blue-600 text-white rounded hover:bg-green-700 transition", "px-3 py-2 bg-black text-yellow-300 rounded hover:bg-gray-800 transition")}>Export CSV</button>
          <button onClick={() => exportToPDF('calendar-capture')} className={themedButton("px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition", "px-3 py-2 bg-black text-yellow-300 rounded hover:bg-gray-800 transition")}>Export PDF</button>
          <button onClick={() => exportCalendarAsImage('calendar-capture')} className={themedButton("px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition", "px-3 py-2 bg-black text-yellow-300 rounded hover:bg-gray-800 transition")}>Export Image</button>

          <div className="flex space-x-2">
            <button onClick={() => setCurrentDate((d) => d.subtract(1, view))} className={themedButton("p-2 bg-white rounded-full shadow hover:bg-blue-100 transition", "p-2 bg-black text-yellow-300 rounded-full shadow hover:bg-gray-800 transition")}>
              <FaChevronLeft />
            </button>
            <button onClick={() => setCurrentDate(dayjs())} className={themedButton("px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", "px-3 py-2 rounded bg-black text-yellow-300 hover:bg-gray-800")}>
              Today
            </button>
            <button onClick={() => setCurrentDate((d) => d.add(1, view))} className={themedButton("p-2 bg-white rounded-full shadow hover:bg-blue-100 transition", "p-2 bg-black text-yellow-300 rounded-full shadow hover:bg-gray-800 transition")}>
              <FaChevronRight />
            </button>
          </div>

          <div className="flex space-x-1">
            <button onClick={() => setView('month')} className={`px-2 py-1 rounded ${view === 'month' ? themedButton('bg-blue-600 text-white', 'bg-yellow-400 text-black') : themedButton('bg-white shadow', 'bg-black text-yellow-300')}`}>Month</button>
            <button onClick={() => setView('week')} className={`px-2 py-1 rounded ${view === 'week' ? themedButton('bg-blue-600 text-white', 'bg-yellow-400 text-black') : themedButton('bg-white shadow', 'bg-black text-yellow-300')}`}>Week</button>
            <button onClick={() => setView('day')} className={`px-2 py-1 rounded ${view === 'day' ? themedButton('bg-blue-600 text-white', 'bg-yellow-400 text-black') : themedButton('bg-white shadow', 'bg-black text-yellow-300')}`}>Day</button>
          </div>
        </div>

        <div id="calendar-capture">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }} role="grid" aria-label={`${view} calendar view`}>
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
          </div>
        </div>

        <MetricLegend metric={selectedMetric} />
        <AnomalyLegend />

        {summary && (
          <div className="mt-4 p-4 bg-inherit text-inherit border rounded shadow font-mono text-sm">
            <div>
              <strong>Summary:</strong> Volatility: {(summary.volatility * 100).toFixed(2)}%, Performance: {(summary.performance * 100).toFixed(2)}%
            </div>
          </div>
        )}
      </div>

      {summary && <SummaryChart data={data} metric={selectedMetric} />}

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
  );
};

export default Calendar;
