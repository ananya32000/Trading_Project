import dayjs from 'dayjs';

// Helper to generate random data
const random = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);

// Generate intraday data (hourly breakdown)
const generateIntraday = () => {
  return Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i;
    return {
      hour,
      volume: random(100, 1000),
      perfChange: random(-1, 1),
    };
  });
};

// Generate daily data for each date in range
export const generateDailyData = (centerDate, rangeDays = 60) => {
  const data = {};
  const start = centerDate.clone().subtract(rangeDays, 'day');
  const end = centerDate.clone().add(rangeDays, 'day');

  for (let day = start.clone(); day.isSameOrBefore(end); day = day.add(1, 'day')) {
    const dateStr = day.format('YYYY-MM-DD');

    data[dateStr] = {
      open: random(90, 110),
      close: random(90, 110),
      high: random(110, 120),
      low: random(80, 90),
      volume: random(1000, 10000),
      liquidity: random(100, 1000),
      volatility: random(0.01, 0.05),
      performance: random(-0.02, 0.03),
      benchmarkPerf: random(-0.015, 0.025),
      intraday: generateIntraday(),
    };
  }

  return data;
};
