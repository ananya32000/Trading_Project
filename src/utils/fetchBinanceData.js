// utils/fetchBinanceData.js
import axios from 'axios';
import dayjs from 'dayjs';

export async function fetchBinanceDailyData(symbol = 'BTCUSDT', limit = 100) {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol,
        interval: '1d',
        limit,
      },
    });

    const rawData = response.data;
    const dataByDate = {};

    const closingPrices = [];

    for (let i = 0; i < rawData.length; i++) {
      const [
        openTime,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
      ] = rawData[i];

      const dateStr = dayjs(openTime).format('YYYY-MM-DD');
      const openNum = parseFloat(open);
      const closeNum = parseFloat(close);
      const perf = (closeNum - openNum) / openNum;
      const vol = Math.abs(perf);

      closingPrices.push(closeNum);

      dataByDate[dateStr] = {
        open: openNum,
        close: closeNum,
        high: parseFloat(high),
        low: parseFloat(low),
        volume: parseFloat(volume),
        liquidity: Math.random() * 1000,
        volatility: vol,
        performance: perf,
        benchmarkPerf: perf * 0.9 + (Math.random() * 0.02 - 0.01),
        intraday: [],
        ma7: null,
        ma14: null,
        rsi: null,
      };

      // Calculate MA7 and MA14
      if (i >= 6) {
        const ma7 = closingPrices.slice(i - 6, i + 1).reduce((a, b) => a + b, 0) / 7;
        dataByDate[dateStr].ma7 = ma7;
      }

      if (i >= 13) {
        const ma14 = closingPrices.slice(i - 13, i + 1).reduce((a, b) => a + b, 0) / 14;
        dataByDate[dateStr].ma14 = ma14;

        // RSI calculation
        let gain = 0;
        let loss = 0;
        for (let j = i - 13; j <= i; j++) {
          const diff = closingPrices[j] - closingPrices[j - 1];
          if (diff >= 0) gain += diff;
          else loss -= diff;
        }
        const avgGain = gain / 14;
        const avgLoss = loss / 14;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);

        dataByDate[dateStr].rsi = rsi;
      }
    }

    // Intraday hourly data (last 3 days)
    const intradayResponse = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol,
        interval: '1h',
        limit: 72, // 3 days
      },
    });

    const intradayData = intradayResponse.data;

    for (const item of intradayData) {
      const [openTime, open, , , close, volume] = item;
      const day = dayjs(openTime);
      const dateStr = day.format('YYYY-MM-DD');
      const hour = day.hour();

      if (!dataByDate[dateStr]) continue;

      const openNum = parseFloat(open);
      const closeNum = parseFloat(close);
      const perfChange = ((closeNum - openNum) / openNum) * 100;

      dataByDate[dateStr].intraday.push({
        hour,
        volume: parseFloat(volume),
        perfChange,
      });
    }

    return dataByDate;
  } catch (error) {
    console.error('Error fetching Binance data:', error.message);
    return {};
  }
}
