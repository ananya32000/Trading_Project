// src/Components/Calendar/DailyMetrics.jsx
import React from 'react';
import { FaChartLine, FaFire, FaStream } from 'react-icons/fa';

const DailyMetrics = ({ data, date }) => {
  if (!data || !data.intraday) {
    return (
      <div className="text-gray-500 p-4">
        No data for {date.format('DD MMM YYYY')}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow rounded-xl mt-4 space-y-4">
      <h3 className="text-lg font-semibold">
        Intraday: {date.format('DD MMM YYYY')}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {data.intraday.map((h) => (
          <div
            key={h.hour}
            className="text-xs text-gray-700 flex flex-col items-center"
          >
            <span className="font-medium">
              {String(h.hour).padStart(2, '0')}:00
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 my-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (h.volume / 1000) * 100)}%`,
                }}
              />
            </div>
            <span
              className={`${
                h.perfChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {h.perfChange.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyMetrics;
