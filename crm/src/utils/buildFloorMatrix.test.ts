import { describe, it, expect } from "vitest";
import { buildFloorMatrix } from "./buildFloorMatrix";

describe("buildFloorMatrix", () => {
  // Basic successful scenario
  it("should generate matrix for standard account and audits", () => {
    const account = {
      floors_min: 1,
      floors_max: 5,
      excluded_floors: [4],
    };

    const audits = [
      {
        date: "2024-01-15",
        visited_floors: [1, 2, 3],
      },
      {
        date: "2024-02-20",
        visited_floors: [2, 5],
      },
    ];

    const matrix = buildFloorMatrix(account, audits);

    // Convert keys to numbers for comparison
    const matrixFloors = Object.keys(matrix).map(Number);
    expect(matrixFloors).toEqual([1, 2, 3, 4, 5]);

    // Rest of the test remains the same
    expect(Object.keys(matrix[1])).toEqual(["01-2024", "02-2024"]);

    // Floor 1 checks
    expect(matrix[1]["01-2024"]).toBe("visited");
    expect(matrix[1]["02-2024"]).toBe("skipped");

    // Floor 2 checks
    expect(matrix[2]["01-2024"]).toBe("visited");
    expect(matrix[2]["02-2024"]).toBe("visited");

    // Excluded floor check
    expect(matrix[4]["01-2024"]).toBe("excluded");
    expect(matrix[4]["02-2024"]).toBe("excluded");
  });

  // Edge case: Negative floors
  it("should handle accounts with negative floor numbers", () => {
    const account = {
      floors_min: -2,
      floors_max: 2,
      excluded_floors: [-1],
    };

    const audits = [
      {
        date: "2024-01-15",
        visited_floors: [-2, 0, 1, 2],
      },
    ];

    const matrix = buildFloorMatrix(account, audits);

    // Convert keys to numbers and sort them
    const matrixFloors = Object.keys(matrix)
      .map(Number)
      .sort((a, b) => a - b);

    expect(matrixFloors).toEqual([-2, -1, 0, 1, 2]);

    expect(matrix[-1]["01-2024"]).toBe("excluded");
    expect(matrix[-2]["01-2024"]).toBe("visited");
  });

  // Error handling scenarios
  describe("Error Handling", () => {
    it("should throw error for invalid account object", () => {
      expect(() =>
        buildFloorMatrix(
          // @ts-ignore - intentionally invalid input
          { floors_min: "invalid" },
          [],
        ),
      ).toThrow("Invalid account object");
    });

    it("should throw error if floors_min > floors_max", () => {
      expect(() =>
        buildFloorMatrix(
          { floors_min: 10, floors_max: 5, excluded_floors: [] },
          [],
        ),
      ).toThrow("floors_min cannot be greater than floors_max");
    });

    it("should throw error for invalid date format", () => {
      expect(() =>
        buildFloorMatrix(
          { floors_min: 1, floors_max: 5, excluded_floors: [] },
          [{ date: "invalid-date", visited_floors: [1] }],
        ),
      ).toThrow("Invalid date format");
    });
  });

  // Complex scenario: Multiple audits with overlapping dates
  it("should handle multiple audits with overlapping visits", () => {
    const account = {
      floors_min: 1,
      floors_max: 6,
      excluded_floors: [3],
    };

    const audits = [
      {
        date: "2024-01-15",
        visited_floors: [1, 2, 4],
      },
      {
        date: "2024-01-15",
        visited_floors: [2, 5, 6],
      },
      {
        date: "2024-02-20",
        visited_floors: [1, 4, 5],
      },
    ];

    const matrix = buildFloorMatrix(account, audits);

    // Floor 2 should be visited in January
    expect(matrix[2]["01-2024"]).toBe("visited");

    // Floor 1 checks
    expect(matrix[1]["01-2024"]).toBe("visited");
    expect(matrix[1]["02-2024"]).toBe("visited");

    // Excluded floor check
    expect(matrix[3]["01-2024"]).toBe("excluded");
    expect(matrix[3]["02-2024"]).toBe("excluded");
  });

  // Date sorting verification
  it("should sort dates chronologically", () => {
    const account = {
      floors_min: 1,
      floors_max: 3,
      excluded_floors: [],
    };

    const audits = [
      { date: "2024-02-15", visited_floors: [1] },
      { date: "2024-01-10", visited_floors: [2] },
      { date: "2024-03-20", visited_floors: [3] },
    ];

    const matrix = buildFloorMatrix(account, audits);

    // Verify chronological order in matrix keys
    const dateKeys = Object.keys(matrix[1]);
    expect(dateKeys).toEqual(["01-2024", "02-2024", "03-2024"]);

    // Additional checks to verify sorting
    expect(matrix[1]["01-2024"]).toBe("skipped");
    expect(matrix[1]["02-2024"]).toBe("visited");
    expect(matrix[1]["03-2024"]).toBe("skipped");
  });
});
