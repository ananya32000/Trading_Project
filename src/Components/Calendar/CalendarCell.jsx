import React from 'react';
import TooltipContent from './TooltipContent';
import dayjs from 'dayjs';

const getMetricColor = (metric, value, theme) => {
  if (value == null || isNaN(value)) return theme === 'highContrast' ? 'bg-gray-900' : 'bg-gray-50';

  switch (metric) {
    case 'volatility':
      if (theme === 'highContrast') {
        if (value < 0.01) return 'bg-gray-800';
        if (value < 0.02) return 'bg-yellow-900';
        if (value < 0.04) return 'bg-yellow-700';
        if (value < 0.06) return 'bg-orange-600';
        return 'bg-red-500 text-yellow-300';
      }
      if (value < 0.01) return 'bg-gray-100';
      if (value < 0.02) return 'bg-yellow-100';
      if (value < 0.04) return 'bg-orange-200';
      if (value < 0.06) return 'bg-red-300';
      return 'bg-red-500 text-white';
    case 'volume':
      if (theme === 'highContrast') {
        if (value < 500) return 'bg-gray-800';
        if (value < 2000) return 'bg-green-900';
        if (value < 5000) return 'bg-green-700';
        return 'bg-green-500 text-yellow-300';
      }
      if (value < 500) return 'bg-green-50';
      if (value < 2000) return 'bg-green-100';
      if (value < 5000) return 'bg-green-300';
      return 'bg-green-500 text-white';
    case 'rsi':
      if (theme === 'highContrast') {
        if (value < 30) return 'bg-blue-900';
        if (value > 70) return 'bg-purple-700';
        return 'bg-gray-800';
      }
      if (value < 30) return 'bg-blue-200';
      if (value > 70) return 'bg-pink-200';
      return 'bg-white';
    case 'liquidity':
      if (theme === 'highContrast') {
        if (value > 800) return 'bg-purple-700';
        if (value > 400) return 'bg-purple-900';
        return 'bg-gray-800';
      }
      if (value > 800) return 'bg-purple-100';
      if (value > 400) return 'bg-purple-200';
      return 'bg-purple-50';
    default:
      return theme === 'highContrast' ? 'bg-gray-800' : 'bg-white';
  }
};

const LiquidityIndicator = ({ liquidity, theme }) => {
  if (liquidity > 800) {
    return (
      <div 
        className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
          theme === 'highContrast' ? 'bg-yellow-400' : 'bg-green-500'
        }`}
      ></div>
    );
  }
  if (liquidity > 400) {
    return (
      <div 
        className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
          theme === 'highContrast' ? 'bg-yellow-500' : 'bg-yellow-400'
        }`}
      ></div>
    );
  }
  return null;
};

const PerformanceArrow = ({ performance, theme }) => {
  const baseStyle = "text-[10px] font-bold";
  
  if (performance > 0.002) {
    return (
      <span className={`${baseStyle} ${
        theme === 'highContrast' ? 'text-yellow-300' : 'text-green-600'
      }`}>▲</span>
    );
  } else if (performance < -0.002) {
    return (
      <span className={`${baseStyle} ${
        theme === 'highContrast' ? 'text-yellow-300' : 'text-red-600'
      }`}>▼</span>
    );
  } else {
    return (
      <span className={`${baseStyle} ${
        theme === 'highContrast' ? 'text-yellow-400' : 'text-gray-400'
      }`}>–</span>
    );
  }
};

const CalendarCell = ({ 
  day, 
  onClick, 
  isToday, 
  isSelected, 
  inRange, 
  isAnomalous, 
  data, 
  metric,
  zoom,
  theme
}) => {
  const metricValue = data?.[metric];
  const metricColorClass = getMetricColor(metric, metricValue, theme);

  const getDateTextColor = () => {
    if (isSelected) return 'text-white';
    if (isToday) return theme === 'highContrast' ? 'text-yellow-300' : 'text-blue-700';
    return theme === 'highContrast' ? 'text-yellow-300' : 'text-gray-700';
  };

  return (
    <div className="relative group" onClick={onClick}>
      {/* Enhanced Tooltip */}
      {data && (
        <div
          className={`absolute z-30 hidden group-hover:block rounded-lg p-3 text-xs w-64 pointer-events-none opacity-0 group-hover:opacity-100 transform group-hover:translate-y-1 transition-all duration-200 ${
            theme === 'highContrast'
              ? 'bg-black border-2 border-yellow-400 text-yellow-300'
              : 'bg-white border border-gray-200 shadow-xl'
          }`}
          style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
        >
          <TooltipContent data={data} date={day} theme={theme} />
        </div>
      )}

      {/* Main Cell */}
      <div
        role="gridcell"
        tabIndex={0}
        aria-selected={isSelected}
        aria-label={`${day.format('ddd, MMM D')}${isToday ? ', today' : ''}`}
        className={`relative p-1 border rounded-xl text-center select-none overflow-visible
          transition-all duration-200 ease-in-out transform
          ${metricColorClass}
          ${isToday ? 
            theme === 'highContrast' 
              ? 'border-yellow-400 bg-yellow-900 font-bold shadow-inner' 
              : 'border-blue-500 bg-blue-100 font-bold shadow-inner' 
            : ''}
          ${isSelected ? 
            theme === 'highContrast'
              ? 'bg-yellow-500 text-black shadow-xl ring-2 ring-yellow-300'
              : 'bg-blue-500 text-white shadow-xl ring-2 ring-blue-300'
            : ''}
          ${inRange ? 
            theme === 'highContrast' 
              ? 'bg-yellow-900/50' 
              : 'bg-blue-200/70'
            : ''}
          hover:scale-[1.03] hover:shadow-lg hover:z-10 ${
            theme === 'highContrast'
              ? 'hover:ring-2 hover:ring-yellow-400'
              : 'hover:ring-2 hover:ring-blue-200'
          }
          focus:outline-none ${
            theme === 'highContrast'
              ? 'focus:ring-2 focus:ring-yellow-400'
              : 'focus:ring-2 focus:ring-blue-400'
          } cursor-pointer
        `}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease',
          }}
          className="space-y-1"
        >
          {data && <LiquidityIndicator liquidity={data.liquidity} theme={theme} />}
          
          {isAnomalous && (
            <div
              className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full shadow-md ring-2 ${
                theme === 'highContrast'
                  ? 'bg-red-500 ring-yellow-400'
                  : 'bg-red-500 ring-red-300'
              } animate-pulse`}
              title="Anomaly"
            />
          )}

          <div className={`text-xs font-semibold ${getDateTextColor()}`}>
            {day.date()}
          </div>

          {data && (
            <div className={`text-[10px] ${
              theme === 'highContrast' 
                ? 'text-yellow-300' 
                : isSelected 
                  ? 'text-white/90' 
                  : 'text-gray-700'
            } flex items-center justify-center gap-1 leading-tight`}>
              Vol: {Math.round(data.volume)}
              <PerformanceArrow performance={data.performance} theme={theme} />
            </div>
          )}

          {data && (
            <div
              className={`w-full h-1.5 rounded-full mt-1 transition-all duration-300 shadow-sm ${
                data.performance >= 0
                  ? theme === 'highContrast'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    : 'bg-gradient-to-r from-green-400 to-green-600'
                  : theme === 'highContrast'
                    ? 'bg-gradient-to-r from-red-500 to-red-700'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarCell;