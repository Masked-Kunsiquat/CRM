import React, { useMemo } from "react";
import { Card } from "flowbite-react";
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export type FloorMatrixData = Record<
  number,
  Record<string, "visited" | "skipped" | "excluded">
>;

interface FloorMatrixProps {
  data: FloorMatrixData;
  title?: string;
  className?: string;
}

/**
 * Renders a color-coded matrix of floor visits over time using ApexCharts.
 * 
 * @param {FloorMatrixProps} props - Component props
 * @returns {JSX.Element} A visual heatmap of floor visits
 */
const FloorMatrix: React.FC<FloorMatrixProps> = ({
  data,
  title = "Floor Visit Matrix",
  className = "",
}) => {
  // Extract and sort floors (Y-axis)
  const floors = useMemo(() => {
    return Object.keys(data)
      .map(Number)
      .sort((a, b) => b - a); // Sort in descending order (highest floor at top)
  }, [data]);

  // Extract and sort dates (X-axis)
  const dates = useMemo(() => {
    if (floors.length === 0) return [];
    // Get dates from the first floor's data
    const firstFloorData = data[floors[floors.length - 1]];
    return Object.keys(firstFloorData).sort((a, b) => {
      const [monthA, yearA] = a.split("-").map(Number);
      const [monthB, yearB] = b.split("-").map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });
  }, [data, floors]);

  // Convert FloorMatrixData to ApexCharts series format
  const chartData = useMemo(() => {
    return floors.map((floor) => ({
      name: `Floor ${floor}`,
      data: dates.map(date => {
        const status = data[floor][date];
        switch (status) {
          case "visited": return 3; // High
          case "skipped": return 2; // Medium
          case "excluded": return 1; // Low
          default: return 0; // No data
        }
      })
    }));
  }, [data, floors, dates]);

  // ApexCharts configuration
  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      type: 'heatmap',
      height: `${Math.max(350, floors.length * 40)}px`, // Dynamic height based on number of floors
      width: '100%', // Full width to ensure labels are visible
      animations: {
        enabled: false
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '0.75rem',
    },
    plotOptions: {
      heatmap: {
        enableShades: false,
        radius: 0,
        useFillColorAsStroke: false,
        distributed: true,
        columnWidth: '100%', // Ensure full width usage
        rowHeight: '100%', // Ensure full height usage
        reverseNegativeShade: false,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              color: '#E0E0E0', // Neutral gray for no data
              name: 'Unknown'
            },
            {
              from: 1,
              to: 1,
              color: '#1D4ED8', // Blue-700 for excluded
              name: 'Excluded'
            },
            {
              from: 2,
              to: 2,
              color: '#CA8A04', // Amber-600 for skipped
              name: 'Skipped'
            },
            {
              from: 3,
              to: 3,
              color: '#047857', // Emerald-600 for visited
              name: 'Visited'
            }
          ]
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#000'],
        fontSize: '0.6rem'
      },
      formatter: (val) => {
        switch(val) {
          case 3: return 'V';
          case 2: return 'S';
          case 1: return 'E';
          default: return '';
        }
      }
    },
    xaxis: {
      type: 'category',
      categories: dates,
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: '0.7rem',
          colors: '#6B7280' // text-gray-500
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '0.7rem',
          colors: '#6B7280', // text-gray-500
          fontWeight: 'bold'
        },
        offsetX: -20 // Push labels slightly to the left
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0
      }
    },
    title: {
      text: title,
      style: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#111827' // text-gray-900
      }
    }
  }), [title, dates, floors]);

  // Return empty message if no data
  if (floors.length === 0 || dates.length === 0) {
    return (
      <Card className={`${className}`}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="text-gray-500 dark:text-gray-400">
          No floor data available
        </p>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <div className="overflow-x-auto">
        <ReactApexChart 
          options={chartOptions} 
          series={chartData} 
          type="heatmap" 
          height={Math.max(350, floors.length * 40)} 
        />
      </div>
    </Card>
  );
};

export default FloorMatrix;