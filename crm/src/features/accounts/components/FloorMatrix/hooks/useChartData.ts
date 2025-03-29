import { useMemo } from "react";
import { FloorMatrixData, Audit, AuditDetail } from "../types.ts";

export const useChartData = (data: FloorMatrixData, audits: Audit[] = []) => {
  // Extract and sort floors (Y-axis)
  const floors = useMemo(() => {
    return Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b);
  }, [data]);

  // Extract and sort dates (X-axis)
  const dates = useMemo(() => {
    if (floors.length === 0) return [];
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
      // Changed the name to just the number to avoid any prefix issues
      name: `${floor}`,
      data: dates.map((date) => {
        const status = data[floor][date];
        switch (status) {
          case "visited":
            return 3;
          case "skipped":
            return 2;
          case "excluded":
            return 1;
          default:
            return 0;
        }
      }),
    }));
  }, [data, floors, dates]);

  // Create audit information map
  const auditInfo = useMemo(() => {
    const tooltipMap = new Map<string, AuditDetail[]>();

    if (!audits.length) return tooltipMap;

    audits.forEach((audit) => {
      const auditDate = new Date(audit.date);
      const monthYear = `${String(auditDate.getMonth() + 1).padStart(2, "0")}-${auditDate.getFullYear()}`;

      audit.visited_floors.forEach((floor) => {
        const key = `${monthYear}-${floor}`;
        if (!tooltipMap.has(key)) {
          tooltipMap.set(key, []);
        }
        const details = tooltipMap.get(key);
        if (details) {
          details.push({
            date: auditDate.toLocaleDateString(),
            score: audit.score,
          });
        }
      });
    });

    return tooltipMap;
  }, [audits]);

  return {
    floors,
    dates,
    chartData,
    auditInfo,
  };
};
