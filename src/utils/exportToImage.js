// utils/exportToImage.js
import html2canvas from 'html2canvas';

export const exportCalendarAsImage = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Calendar content not found!');
    return;
  }

  const canvas = await html2canvas(element);
  const image = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = image;
  link.download = 'calendar.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
