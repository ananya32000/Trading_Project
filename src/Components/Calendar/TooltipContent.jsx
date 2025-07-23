import React from 'react';
import dayjs from 'dayjs';

const TooltipContent = ({ data, date }) => {
  if (!data) return <span className="text-xs text-gray-500">No data</span>;

  const safeNum = (n, digits = 2) =>
    typeof n === 'number' ? n.toFixed(digits) : 'N/A';

  const isGain = data.performance >= 0;

  return (
    <div className="p-2 text-xs text-gray-900 space-y-1 max-w-xs font-mono leading-snug">
      <div className="font-semibold text-gray-700">{date?.format('DD MMM YYYY')}</div>

      <div>Open: ${safeNum(data.open)}</div>
      <div>Close: ${safeNum(data.close)}</div>
      <div>High: ${safeNum(data.high)}</div>
      <div>Low: ${safeNum(data.low)}</div>
      <div>Volume: {Math.round(data.volume ?? 0)}</div>

      <div>Liquidity: {safeNum(data.liquidity)}</div>
      <div>Volatility: {safeNum(data.volatility * 100, 2)}%</div>
      <div>MA7: {safeNum(data.ma7)}</div>
<div>MA14: {safeNum(data.ma14)}</div>
<div>RSI (14): {safeNum(data.rsi)}</div>
      <div>Std Dev: {safeNum(data.stdDev, 4)}</div>

      <div className={isGain ? 'text-green-600' : 'text-red-600'}>
        Performance: {safeNum(data.performance * 100, 2)}%
      </div>
      <div className="text-gray-600">
        Benchmark Perf: {safeNum(data.benchmarkPerf * 100, 2)}%
      </div>

      {Array.isArray(data.intraday) && data.intraday.length > 0 && (
        <div className="text-gray-600">
          Intraday: {data.intraday.length} bars (hrs {data.intraday[0]?.hour}–{data.intraday[data.intraday.length - 1]?.hour})
        </div>
      )}
    </div>
  );
};

export default TooltipContent;
