import React from 'react';

const TooltipContent = ({ data, date, theme, className = '', style = {} }) => {
  if (!data) return (
    <span className={`text-xs ${theme === 'highContrast' ? 'text-yellow-400' : 'text-gray-500'}`}>
      No data available
    </span>
  );

  const safeNum = (n, digits = 2) =>
    typeof n === 'number' ? n.toFixed(digits) : 'N/A';

  const isGain = data.performance >= 0;

  const themeColors = {
    default: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-800',
      heading: 'text-gray-900',
      highlight: 'text-blue-600',
      gain: 'text-green-600',
      loss: 'text-red-600',
      muted: 'text-gray-500'
    },
    highContrast: {
      bg: 'bg-black',
      border: 'border-yellow-400',
      text: 'text-yellow-300',
      heading: 'text-yellow-300',
      highlight: 'text-yellow-400',
      gain: 'text-yellow-300',
      loss: 'text-yellow-300',
      muted: 'text-yellow-400'
    },
    colorblind: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      heading: 'text-amber-900',
      highlight: 'text-blue-700',
      gain: 'text-blue-700',
      loss: 'text-orange-600',
      muted: 'text-amber-700'
    }
  };

  const colors = themeColors[theme] || themeColors.default;

  return (
    <div
      className={`p-3 rounded-lg shadow-lg border max-w-xs text-left ${colors.bg} ${colors.border} ${className}`}
      style={style}
    >
      {/* Header */}
      <div className={`font-bold text-sm mb-2 pb-1 border-b ${colors.border} ${colors.heading}`}>
        {date?.format('ddd, MMM D, YYYY')}
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="col-span-2 grid grid-cols-2 gap-2 mb-1">
          <div><div className={colors.muted}>Open</div><div className={colors.text}>${safeNum(data.open)}</div></div>
          <div><div className={colors.muted}>Close</div><div className={colors.text}>${safeNum(data.close)}</div></div>
          <div><div className={colors.muted}>High</div><div className={colors.text}>${safeNum(data.high)}</div></div>
          <div><div className={colors.muted}>Low</div><div className={colors.text}>${safeNum(data.low)}</div></div>
        </div>
        <div><div className={colors.muted}>Volume</div><div className={colors.text}>{Math.round(data.volume ?? 0)}</div></div>
        <div><div className={colors.muted}>Liquidity</div><div className={colors.text}>{safeNum(data.liquidity)}</div></div>
        <div><div className={colors.muted}>Volatility</div><div className={colors.text}>{safeNum(data.volatility * 100, 2)}%</div></div>
        <div><div className={colors.muted}>Performance</div><div className={isGain ? colors.gain : colors.loss}>{safeNum(data.performance * 100, 2)}%</div></div>
        <div><div className={colors.muted}>MA (7)</div><div className={colors.text}>{safeNum(data.ma7)}</div></div>
        <div><div className={colors.muted}>MA (14)</div><div className={colors.text}>{safeNum(data.ma14)}</div></div>
        <div><div className={colors.muted}>RSI (14)</div><div className={colors.text}>{safeNum(data.rsi)}</div></div>
        <div><div className={colors.muted}>Std Dev</div><div className={colors.text}>{safeNum(data.stdDev, 4)}</div></div>
      </div>

      {/* Benchmark */}
      <div className={`mt-2 pt-2 border-t ${colors.border} text-xs`}>
        <div className={colors.muted}>Benchmark:</div>
        <div className={colors.text}>{safeNum(data.benchmarkPerf * 100, 2)}%</div>
      </div>

      {/* Intraday */}
      {Array.isArray(data.intraday) && data.intraday.length > 0 && (
        <div className={`mt-2 pt-2 border-t ${colors.border} text-xs ${colors.muted}`}>
          Intraday: {data.intraday.length} bars
          <div className={colors.text}>
            Hours {data.intraday[0]?.hour}–{data.intraday[data.intraday.length - 1]?.hour}
          </div>
        </div>
      )}
    </div>
  );
};

export default TooltipContent;
