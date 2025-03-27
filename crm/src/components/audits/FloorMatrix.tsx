// src/components/audits/FloorMatrix.tsx
import { useMemo } from "react";
import { Card } from "flowbite-react";

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
 * Renders a color-coded matrix of floor visits over time.
 * - Y-axis shows floors (from highest to lowest)
 * - X-axis shows dates in MM-YYYY format
 * - Colors indicate status: visited, skipped, or excluded
 *
 * @param {FloorMatrixProps} props - Component props
 * @returns {JSX.Element} A visual heatmap of floor visits
 */
const FloorMatrix = ({
  data,
  title = "Floor Visit Matrix",
  className = "",
}: FloorMatrixProps) => {
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

  // Get color class based on status
  const getStatusColor = (status: "visited" | "skipped" | "excluded") => {
    switch (status) {
      case "visited":
        return "bg-green-500";
      case "skipped":
        return "bg-yellow-300";
      case "excluded":
        return "bg-gray-300";
      default:
        return "bg-gray-100";
    }
  };

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
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                  >
                    Floor
                  </th>
                  {dates.map((date) => (
                    <th
                      key={date}
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                    >
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {floors.map((floor) => (
                  <tr key={floor}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                      {floor}
                    </td>
                    {dates.map((date) => {
                      const status = data[floor][date];
                      return (
                        <td
                          key={`${floor}-${date}`}
                          className={`px-6 py-4 text-center ${getStatusColor(status)}`}
                          title={`Floor ${floor}, ${date}: ${status}`}
                        >
                          <div className="sr-only">{status}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-4">
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 bg-green-500"></div>
          <span className="text-xs">Visited</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 bg-yellow-300"></div>
          <span className="text-xs">Skipped</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 bg-gray-300"></div>
          <span className="text-xs">Excluded</span>
        </div>
      </div>
    </Card>
  );
};

export default FloorMatrix;
