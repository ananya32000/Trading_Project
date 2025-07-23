import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderBookPanel = ({ symbol = 'BTCUSDT', limit = 10 }) => {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const res = await axios.get(`https://api.binance.com/api/v3/depth`, {
          params: { symbol, limit }
        });
        setOrderBook(res.data);
      } catch (err) {
        console.error("Error fetching order book:", err);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [symbol, limit]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full md:w-1/2">
      <h2 className="text-lg font-bold mb-2">Order Book: {symbol}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-md font-semibold text-green-600">Bids</h3>
          <ul className="text-sm font-mono">
            {orderBook.bids.map(([price, qty], i) => (
              <li key={i}>{price} ({qty})</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-md font-semibold text-red-600">Asks</h3>
          <ul className="text-sm font-mono">
            {orderBook.asks.map(([price, qty], i) => (
              <li key={i}>{price} ({qty})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderBookPanel;
