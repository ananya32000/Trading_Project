import Papa from 'papaparse';

export const exportToCSV = (data, filename = 'calendar-data.csv') => {
  if (!data) return;

  const flatData = Object.entries(data).map(([date, metrics]) => ({
    date,
    ...metrics,
  }));

  const csv = Papa.unparse(flatData);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
