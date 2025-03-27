import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FloorMatrix from "../FloorMatrix/index";
import { FloorMatrixData } from "../FloorMatrix/types";


// Mock the Card component from flowbite-react since we're only testing our component logic
vi.mock("flowbite-react", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="flowbite-card" className={className}>
      {children}
    </div>
  ),
}));

describe("FloorMatrix Component", () => {
  // Sample data for tests
  const sampleData: FloorMatrixData = {
    5: {
      "01-2024": "visited",
      "02-2024": "skipped",
      "03-2024": "skipped",
    },
    4: {
      "01-2024": "excluded",
      "02-2024": "excluded",
      "03-2024": "excluded",
    },
    3: {
      "01-2024": "skipped",
      "02-2024": "visited",
      "03-2024": "skipped",
    },
    1: {
      "01-2024": "visited",
      "02-2024": "skipped",
      "03-2024": "visited",
    },
  };

  it("renders the component with title", () => {
    render(<FloorMatrix data={sampleData} title="Test Matrix" />);
    expect(screen.getByText("Test Matrix")).toBeInTheDocument();
  });

  it("renders floors in descending order", () => {
    render(<FloorMatrix data={sampleData} />);

    const floorCells = screen.getAllByText(/^[1345]$/);
    const floorNumbers = floorCells.map((cell) =>
      parseInt(cell.textContent || "0"),
    );

    // Check that floors are in descending order (5, 4, 3, 1)
    expect(floorNumbers).toEqual([5, 4, 3, 1]);
  });

  it("renders dates in chronological order", () => {
    render(<FloorMatrix data={sampleData} />);

    const dateHeaders = screen.getAllByText(/\d{2}-\d{4}/);
    const dates = dateHeaders.map((header) => header.textContent);

    // Check dates are in order: 01-2024, 02-2024, 03-2024
    expect(dates).toEqual(["01-2024", "02-2024", "03-2024"]);
  });

  it("applies correct color classes based on status", () => {
    const { container } = render(<FloorMatrix data={sampleData} />);

    // Only select cells within the table, excluding the legend
    const table = container.querySelector("table");
    if (!table) {
      throw new Error("Table element not found");
    }

    // Count status cells within the table only
    const greenCells = table.querySelectorAll(".bg-green-500");
    const yellowCells = table.querySelectorAll(".bg-yellow-300");
    const grayCells = table.querySelectorAll(".bg-gray-300");

    // Verify counts against our sample data
    // 4 visited cells (green)
    expect(greenCells.length).toBe(4);

    // 5 skipped cells (yellow)
    expect(yellowCells.length).toBe(5);

    // 3 excluded cells (gray)
    expect(grayCells.length).toBe(3);
  });

  it("shows empty state message when no data is provided", () => {
    render(<FloorMatrix data={{}} />);
    expect(screen.getByText("No floor data available")).toBeInTheDocument();
  });

  it("renders legend items for each status", () => {
    render(<FloorMatrix data={sampleData} />);

    expect(screen.getByText("Visited")).toBeInTheDocument();
    expect(screen.getByText("Skipped")).toBeInTheDocument();
    expect(screen.getByText("Excluded")).toBeInTheDocument();
  });
});
