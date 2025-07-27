import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';
import dayjs from 'dayjs';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';

const SummaryChart = ({ data, metric }) => {
  const { theme } = useTheme();

  const chartData = Object.entries(data)
    .map(([date, entry]) => ({
      date,
      value: entry?.[metric] ?? null,
    }))
    .filter((d) => d.value !== null);

  // Theme-based colors
  const themeColors = {
    default: {
      text: 'text-white',
      border: 'border-gray-200',
      chartLine: '#8884d8',
      grid: '#ccc',
      tooltipBg: 'bg-white',
      tooltipBorder: 'border-gray-300',
    },
    highContrast: {
      text: 'text-yellow-300',
      border: 'border-yellow-300',
      chartLine: '#FFD700',
      grid: '#555',
      tooltipBg: 'bg-black',
      tooltipBorder: 'border-yellow-300',
    },
    colorblind: {
      text: 'text-blue-800',
      border: 'border-orange-300',
      chartLine: '#1f78b4',
      grid: '#aaa',
      tooltipBg: 'bg-white',
      tooltipBorder: 'border-orange-300',
    }
  };

  const currentTheme = themeColors[theme] || themeColors.default;

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className={`text-lg font-bold mb-4 ${currentTheme.text}`}>
        {metric.charAt(0).toUpperCase() + metric.slice(1)} Trend
        <span className="block h-1 w-16 mt-2 rounded-full" 
              style={{ backgroundColor: currentTheme.chartLine }}></span>
      </h3>

      <div className={`rounded-lg border ${currentTheme.border} bg-opacity-10 backdrop-blur-sm`}
           style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentTheme.chartLine} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={currentTheme.chartLine} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={currentTheme.grid}
              opacity={0.5}
            />
            
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => dayjs(tick).format('MMM D')}
              minTickGap={15}
              stroke={currentTheme.text.includes('yellow') ? '#FFD700' : currentTheme.text.split('-')[1]}
              tickMargin={10}
            />
            
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(tick) =>
                metric === 'performance' || metric === 'volatility'
                  ? `${(tick * 100).toFixed(1)}%`
                  : tick
              }
              stroke={currentTheme.text.includes('yellow') ? '#FFD700' : currentTheme.text.split('-')[1]}
              tickMargin={10}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: currentTheme.tooltipBg.includes('black') ? '#000' : '#fff',
                borderColor: currentTheme.tooltipBorder.split('-')[1],
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                color: currentTheme.text.includes('yellow') ? '#FFD700' : currentTheme.text.split('-')[1],
              }}
              labelFormatter={(label) => dayjs(label).format('DD MMM YYYY')}
              formatter={(val) =>
                metric === 'performance' || metric === 'volatility'
                  ? `${(val * 100).toFixed(2)}%`
                  : val.toFixed(2)
              }
              itemStyle={{
                fontWeight: 'bold',
                color: currentTheme.chartLine,
              }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={currentTheme.chartLine}
              strokeWidth={3}
              fillOpacity={0.2}
              fill="url(#colorValue)"
              activeDot={{
                r: 6,
                stroke: currentTheme.chartLine,
                strokeWidth: 2,
                fill: '#fff'
              }}
            />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke={currentTheme.chartLine}
              strokeWidth={2}
              dot={{
                r: 3,
                stroke: currentTheme.chartLine,
                strokeWidth: 1,
                fill: '#fff'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SummaryChart;