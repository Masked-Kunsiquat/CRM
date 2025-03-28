import React, { useEffect, useRef } from "react";
import { Card } from "flowbite-react";
import ReactApexChart from "react-apexcharts";
import { FloorMatrixProps } from "./types";
import { useChartData } from "./hooks/useChartData";
import { useChartOptions } from "./hooks/useChartOptions";
import { useChartStyles } from "./hooks/useChartStyles";

const FloorMatrix: React.FC<FloorMatrixProps> = ({
  data,
  className = "",
  audits = [],
  title: _title = "Floor Visit Matrix",
  showTitle: _showTitle = false,
}) => {
  const { floors, dates, chartData, auditInfo } = useChartData(data, audits);
  const chartRef = useRef(null);

  // Pass empty string to prevent the chart from displaying its own title
  const chartOptions = useChartOptions("", dates, floors, data, auditInfo);
  useChartStyles();

  useEffect(() => {
    // Force chart update after mount
    const timer = setTimeout(() => {
      if (chartRef.current) {
        // @ts-ignore - ApexCharts type definition issue
        chartRef.current.chart.updateOptions({
          chart: {
            width: "100%",
            redrawOnParentResize: true,
            redrawOnWindowResize: true,
          },
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Return empty message if no data
  if (floors.length === 0 || dates.length === 0) {
    return (
      <Card className={`${className}`}>
        <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Audit Visit Matrix
          </h2>
        </div>
        <p className="p-4 text-gray-500 dark:text-gray-400">
          No floor data available
        </p>
      </Card>
    );
  }

  // Custom Legend component to be displayed above the chart
  const CustomLegend = () => (
    <div className="mb-2 mr-4 flex items-center justify-end gap-4">
      <div className="flex items-center">
        <div className="mr-2 h-4 w-4 bg-gray-300"></div>
        <span className="text-xs">Unknown</span>
      </div>
      <div className="flex items-center">
        <div className="mr-2 h-4 w-4 bg-blue-700"></div>
        <span className="text-xs">Excluded (E)</span>
      </div>
      <div className="flex items-center">
        <div className="mr-2 h-4 w-4 bg-amber-600"></div>
        <span className="text-xs">Skipped (S)</span>
      </div>
      <div className="flex items-center">
        <div className="mr-2 h-4 w-4 bg-emerald-700"></div>
        <span className="text-xs">Visited (V)</span>
      </div>
    </div>
  );

  return (
    <Card className={`${className}`}>
      <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Audit Visit Matrix
        </h2>
      </div>
      <div className="min-w-[800px] overflow-x-auto">
        <div className="w-full p-4">
          {/* Add the custom legend above the chart */}
          <CustomLegend />

          <ReactApexChart
            ref={chartRef}
            options={chartOptions}
            series={chartData}
            type="heatmap"
            height={Math.max(350, floors.length * 40)}
          />
        </div>
      </div>
    </Card>
  );
};

export default FloorMatrix;
