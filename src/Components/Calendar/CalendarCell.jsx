import React from 'react';
import TooltipContent from './TooltipContent';
import dayjs from 'dayjs';

const getMetricColor = (metric, value) => {
  if (value == null || isNaN(value)) return 'bg-gray-50';

  switch (metric) {
    case 'volatility':
      if (value < 0.01) return 'bg-gray-100';
      if (value < 0.02) return 'bg-yellow-100';
      if (value < 0.04) return 'bg-orange-200';
      if (value < 0.06) return 'bg-red-300';
      return 'bg-red-500 text-white';
    case 'volume':
      if (value < 500) return 'bg-green-50';
      if (value < 2000) return 'bg-green-100';
      if (value < 5000) return 'bg-green-300';
      return 'bg-green-500 text-white';
    case 'rsi':
      if (value < 30) return 'bg-blue-200';
      if (value > 70) return 'bg-pink-200';
      return 'bg-white';
    case 'liquidity':
      if (value > 800) return 'bg-purple-100';
      if (value > 400) return 'bg-purple-200';
      return 'bg-purple-50';
    default:
      return 'bg-white';
  }
};

const LiquidityIndicator = ({ liquidity }) => {
  if (liquidity > 800) {
    return <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>;
  }
  if (liquidity > 400) {
    return <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400"></div>;
  }
  return null;
};

const PerformanceArrow = ({ performance }) => {
  if (performance > 0.002) {
    return <span className="text-green-600 text-[10px]">▲</span>;
  } else if (performance < -0.002) {
    return <span className="text-red-600 text-[10px]">▼</span>;
  } else {
    return <span className="text-gray-400 text-[10px]">–</span>;
  }
};

const CalendarCell = ({ day, onClick, isToday, isSelected, inRange, isAnomalous, data, metric,zoom ,dateTextColor}) => {
  const metricValue = data?.[metric];
  const metricColorClass = getMetricColor(metric, metricValue);

  return (
    <div className="relative group" onClick={onClick}>
      {data && (
        <div
          className="absolute z-30 hidden group-hover:block bg-white border border-gray-300 shadow-md rounded p-2 text-left text-xs w-60 pointer-events-none"
          style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
        >
          <TooltipContent data={data} date={day} />
        </div>
      )}

    <div
  role="gridcell"
  tabIndex={0}
  aria-selected={isSelected}
  aria-label={`${day.format('ddd, MMM D')}${isToday ? ', today' : ''}`}
  className={`relative p-1 border rounded-lg text-center select-none transition-all duration-200 ease-in-out shadow-sm overflow-visible
    ${metricColorClass}
    ${isToday ? 'border-blue-500 bg-blue-100 font-bold' : ''}
    ${isSelected ? 'bg-blue-300 text-white' : ''}
    ${inRange ? 'bg-blue-200' : ''}`}
>
  <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s' }}>
    {data && <LiquidityIndicator liquidity={data.liquidity} />}
    {isAnomalous && (
      <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" title="Anomaly" />
    )}
    <div className={`text-xs font-semibold ${dateTextColor}`}>{day.date()}</div>
    {data && (
      <div className="text-[10px] text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
        Vol: {Math.round(data.volume)} <PerformanceArrow performance={data.performance} />
      </div>
    )}
    {data && (
      <div
        className={`w-full h-1 rounded mt-1 ${
          data.performance >= 0 ? 'bg-green-500' : 'bg-red-500'
        }`}
      ></div>
    )}
  </div>
</div>
    </div>
  );
};

export default CalendarCell;
