import { useMemo, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { ChartColors } from "../types.ts";

const colors: ChartColors = {
  unknown: "#E0E0E0",
  excluded: "#1D4ED8",
  skipped: "#CA8A04",
  visited: "#047857",
};

export const useChartOptions = (
  title: string,
  dates: string[],
  floors: number[],
  data: any,
  auditInfo: Map<string, any>,
): ApexOptions => {
  // Track dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // We'll use fixed values instead of dynamic calculations to ensure consistency
  const yAxisOffsetX = -10; // Reduced offset since we're only showing numbers
  const leftPadding = 50; // Reduced padding since labels are shorter

  return useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "heatmap",
        height: `${Math.max(350, floors.length * 40)}px`,
        width: "100%",
        animations: { enabled: false },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
          export: {
            png: {
              filename: `audit_matrix_${new Date().toISOString().split("T")[0]}`,
            },
            svg: {
              filename: `audit_matrix_${new Date().toISOString().split("T")[0]}`,
            },
            csv: {
              filename: `audit_matrix_${new Date().toISOString().split("T")[0]}`,
              headerCategory: "Month",
              headerValue: "Floor_Status",
            },
          },
        },
        events: {
          legendClick: function (_chartContext, seriesIndex, opts) {
            const seriesNames = opts.w.globals.seriesNames;
            const seriesName =
              seriesNames &&
              seriesIndex !== undefined &&
              seriesIndex >= 0 &&
              seriesIndex < seriesNames.length
                ? seriesNames[seriesIndex]
                : "";
            return seriesName === "Visited" ? undefined : false;
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "0.75rem",
        offsetY: 40,
        markers: {
          width: 16,
          height: 16,
          radius: 2,
          offsetX: 0,
          offsetY: 0,
        },
        labels: {
          useSeriesColors: false,
          colors: isDarkMode ? "#f3f4f6" : "#111827",
        },
        itemMargin: { horizontal: 10 },
        onItemClick: { toggleDataSeries: true },
        onItemHover: { highlightDataSeries: true },
        formatter: function (_seriesName, opts) {
          const statusNames = ["Unknown", "Excluded", "Skipped", "Visited"];
          const valueIndex = opts.seriesIndex;
          return valueIndex >= 0 && valueIndex < statusNames.length
            ? statusNames[valueIndex]
            : "";
        },
        // Add custom items that will be visible in exports
        customLegendItems: ["Unknown", "Excluded", "Skipped", "Visited"],
      },
      plotOptions: {
        heatmap: {
          enableShades: false,
          radius: 0,
          useFillColorAsStroke: false,
          distributed: true,
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: colors.unknown, name: "Unknown" },
              { from: 1, to: 1, color: colors.excluded, name: "Excluded" },
              { from: 2, to: 2, color: colors.skipped, name: "Skipped" },
              { from: 3, to: 3, color: colors.visited, name: "Visited" },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: [isDarkMode ? "#fff" : "#000"],
          fontSize: "0.6rem",
        },
        formatter: (val) => {
          switch (val) {
            case 3:
              return "V";
            case 2:
              return "S";
            case 1:
              return "E";
            default:
              return "";
          }
        },
      },
      stroke: {
        width: 1,
        colors: [isDarkMode ? "#374151" : "#fff"],
      },
      xaxis: {
        type: "category",
        categories: dates,
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            fontSize: "0.7rem",
            colors: isDarkMode ? "#d1d5db" : "#6B7280",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "0.7rem",
            colors: isDarkMode ? "#d1d5db" : "#6B7280",
            fontWeight: "bold",
          },
          //offsetX: -30,
          formatter: (val) => {
            // Just return the floor number
            return val.toString();
          },
        },
        title: {
          text: "Floor",
          style: {
            fontSize: "0.8rem",
            fontWeight: "bold",
            color: isDarkMode ? "#f3f4f6" : "#111827",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      grid: {
        show: false,
        padding: {
          left: 40, // Standard padding
          right: 0,
          top: 30,
        },
      },
      states: {
        hover: {
          filter: { type: "none" },
        },
        active: {
          allowMultipleDataPointsSelection: true,
          filter: { type: "none" },
        },
      },
      tooltip: {
        custom: function ({ seriesIndex, dataPointIndex }) {
          const floor = floors[seriesIndex];
          const date = dates[dataPointIndex];
          const status = data[floor][date];

          const key = `${date}-${floor}`;
          const auditDetails = auditInfo.get(key) || [];

          let auditInfoHtml = "";
          if (auditDetails.length > 0) {
            auditInfoHtml = auditDetails
              .map((detail: any) => {
                const scoreInfo =
                  detail.score !== undefined
                    ? `<br/>Score: ${detail.score}`
                    : "";
                return `<div class="font-medium">Audit Date: ${detail.date}${scoreInfo}</div>`;
              })
              .join("");
          }

          let statusColor = "";
          switch (status) {
            case "visited":
              statusColor = colors.visited;
              break;
            case "skipped":
              statusColor = colors.skipped;
              break;
            case "excluded":
              statusColor = colors.excluded;
              break;
            default:
              statusColor = colors.unknown;
          }

          return `
          <div class="p-2 bg-white dark:bg-gray-800 rounded shadow-md text-sm">
            <div class="font-bold">Floor ${floor}</div>
            <div>Month: ${date}</div>
            <div>Status: <span class="capitalize" style="color:${statusColor};font-weight:bold">${status}</span></div>
            ${auditInfoHtml}
          </div>`;
        },
      },
      title: {
        text: title,
        floating: true,
        offsetY: 0,
        style: {
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: isDarkMode ? "#f3f4f6" : "#111827",
        },
      },
    }),
    [
      title,
      dates,
      floors,
      data,
      auditInfo,
      isDarkMode,
      yAxisOffsetX,
      leftPadding,
    ],
  );
};
