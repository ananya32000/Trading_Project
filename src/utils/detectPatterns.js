export function detectAnomalies(data, metric) {
  const weekdayMap = {}; // { 0: [], 1: [], ..., 6: [] }

  Object.entries(data).forEach(([dateStr, entry]) => {
    const date = new Date(dateStr);
    const weekday = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    if (!weekdayMap[weekday]) weekdayMap[weekday] = [];
    if (entry[metric] !== undefined) {
      weekdayMap[weekday].push({ date: dateStr, value: entry[metric] });
    }
  });

  const anomalies = new Set();

  for (const [weekday, entries] of Object.entries(weekdayMap)) {
    const values = entries.map(e => e.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length);

    for (const { date, value } of entries) {
      if (Math.abs(value - avg) > 2 * std) {
        anomalies.add(date);
      }
    }
  }

  return anomalies;
}
