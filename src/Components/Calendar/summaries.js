// src/Components/Calendar/summaries.js
import dayjs from 'dayjs';

export function getRangeSummary(data, start, end) {
  const days = [];

  for (
    let d = start.clone();
    d.isBefore(end) || d.isSame(end, 'day');
    d = d.add(1, 'day')
  ) {
    const key = d.format('YYYY-MM-DD');
    if (data[key]) days.push(data[key]);
  }

  if (days.length === 0) return null;

  const open = days[0].open;
  const close = days[days.length - 1].close;
  const high = Math.max(...days.map((d) => d.high));
  const low = Math.min(...days.map((d) => d.low));
  const volume = days.reduce((sum, d) => sum + d.volume, 0);

  const performance = (close - open) / open;

  const stdDev = Math.sqrt(
    days.reduce((sum, d) => {
      const dailyPerf = (d.close - d.open) / d.open;
      return sum + Math.pow(dailyPerf - performance, 2);
    }, 0) / days.length
  );

  const volatility = stdDev; // use std dev as a volatility proxy

  return {
    open,
    close,
    high,
    low,
    volume,
    performance,
    volatility,
    stdDev,
  };
}
