import { useEffect } from 'react';

export const useChartStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Legend container */
      .apexcharts-legend {
        padding: 0 !important;
        margin: 0 !important;
        margin-bottom: 16px !important;
      }

      /* Legend items */
      .apexcharts-legend-series {
        display: inline-flex !important;
        align-items: center !important;
        margin: 0 !important;
      }

      /* Markers */
      .apexcharts-legend-marker {
        width: 12px !important;
        height: 12px !important;
        margin-right: 8px !important;
      }

      /* Cursor states */
      .apexcharts-legend-series:nth-child(1),
      .apexcharts-legend-series:nth-child(2),
      .apexcharts-legend-series:nth-child(3) {
        cursor: not-allowed !important;
        opacity: 0.7;
      }
      
      .apexcharts-legend-series:nth-child(4) {
        cursor: pointer !important;
      }
      
      /* Fix text wrapping */
      .apexcharts-legend-text {
        white-space: nowrap !important;
      }
      
      /* Fix for the dropdown menu in dark mode */
      .apexcharts-menu {
        background-color: #fff !important;
        color: #333 !important;
        border: 1px solid #ccc !important;
      }
      
      body.dark .apexcharts-menu {
        background-color: #374151 !important;
        color: #f3f4f6 !important;
        border: 1px solid #4b5563 !important;
      }
      
      .apexcharts-menu-item {
        color: #333 !important;
      }
      
      body.dark .apexcharts-menu-item {
        color: #f3f4f6 !important;
      }
      
      body.dark .apexcharts-menu-item:hover {
        background-color: #4b5563 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
};