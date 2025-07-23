import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import { useTheme } from './ThemeContext';

const SummaryChart = ({ data, metric }) => {
  const { theme } = useTheme();

  const chartData = Object.entries(data)
    .map(([date, entry]) => ({
      date,
      value: entry?.[metric] ?? null,
    }))
    .filter((d) => d.value !== null);

  const titleColor =
    theme === 'highContrast' ? 'text-yellow-300' : 'text-gray-700';

  const containerBg =
    theme === 'highContrast'
      ? 'bg-black border border-yellow-400'
      : 'bg-white';

  const lineColor =
    theme === 'highContrast'
      ? '#FFD700' // gold/yellow
      : theme === 'colorblind'
      ? '#1f78b4' // colorblind-friendly blue
      : '#8884d8'; // default purple

  return (
    <div className="mt-8">
      <h3 className={`text-sm font-semibold mb-2 ${titleColor}`}>
        {metric.charAt(0).toUpperCase() + metric.slice(1)} Trend
      </h3>
      <div className={`${containerBg} p-4 rounded shadow-md h-64`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === 'highContrast' ? '#999' : '#ccc'}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => dayjs(tick).format('MMM D')}
              minTickGap={15}
              stroke={theme === 'highContrast' ? '#FFD700' : '#666'}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(tick) =>
                metric === 'performance' || metric === 'volatility'
                  ? `${(tick * 100).toFixed(1)}%`
                  : tick
              }
              stroke={theme === 'highContrast' ? '#FFD700' : '#666'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'highContrast' ? '#222' : '#fff',
                borderColor: theme === 'highContrast' ? '#FFD700' : '#ccc',
                color: theme === 'highContrast' ? '#FFD700' : '#000',
              }}
              labelFormatter={(label) => dayjs(label).format('DD MMM YYYY')}
              formatter={(val) =>
                metric === 'performance' || metric === 'volatility'
                  ? `${(val * 100).toFixed(2)}%`
                  : val.toFixed(2)
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryChart;
