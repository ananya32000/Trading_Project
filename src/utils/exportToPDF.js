// utils/exportToPDF.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId, setLoading) => {
  const calendarEl = document.getElementById(elementId);
  if (!calendarEl) {
    alert('Calendar content not found!');
    return;
  }

  try {
    setLoading?.(true);

    // Add blur and overlay effect to indicate loading
    const overlay = document.createElement('div');
    overlay.setAttribute('id', 'pdf-loading-overlay');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
    overlay.innerHTML = `
      <div class="loader-ring"></div>
      <style>
        .loader-ring {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(overlay);

    const canvas = await html2canvas(calendarEl, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    const positionY = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', 0, positionY, imgWidth, imgHeight);
    pdf.save('calendar.pdf');
  } catch (error) {
    console.error('PDF Export failed:', error);
  } finally {
    setLoading?.(false);
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) document.body.removeChild(overlay);
  }
};

export const showGlobalLoader = () => {
  const existing = document.getElementById('global-loading-overlay');
  if (existing) return;

  const overlay = document.createElement('div');
  overlay.setAttribute('id', 'global-loading-overlay');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  overlay.innerHTML = `
    <div class="loader-ring"></div>
    <style>
      .loader-ring {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  document.body.appendChild(overlay);
};

export const hideGlobalLoader = () => {
  const overlay = document.getElementById('global-loading-overlay');
  if (overlay) document.body.removeChild(overlay);
};
