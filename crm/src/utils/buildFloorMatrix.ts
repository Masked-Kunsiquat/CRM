// src/utils/buildFloorMatrix.ts

type Account = {
  floors_min: number;
  floors_max: number;
  excluded_floors: number[];
};

type Audit = {
  date: string; // 'YYYY-MM-DD'
  visited_floors: number[];
};

export type FloorMatrix = Record<
  number,
  Record<string, "visited" | "skipped" | "excluded">
>;

// Helper function to format date from 'YYYY-MM-DD' to 'MM-YYYY'
const formatDateToMonthYear = (dateStr: string): string => {
  const dateParts = dateStr.split("-");
  if (dateParts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}. Expected 'YYYY-MM-DD'.`);
  }
  const [year, month] = dateParts;
  return `${month}-${year}`;
};

export function buildFloorMatrix(
  account: Account,
  audits: Audit[],
): FloorMatrix {
  // Basic validation and loading/error handling
  if (
    !account ||
    typeof account.floors_min !== "number" ||
    typeof account.floors_max !== "number" ||
    !Array.isArray(account.excluded_floors)
  ) {
    throw new Error("Invalid account object provided.");
  }

  if (!Array.isArray(audits)) {
    throw new Error("Audits must be an array.");
  }

  if (account.floors_min > account.floors_max) {
    throw new Error("floors_min cannot be greater than floors_max.");
  }

  const { floors_min, floors_max, excluded_floors } = account;

  // Create floors range
  const floors = Array.from(
    { length: floors_max - floors_min + 1 },
    (_, i) => i + floors_min,
  );

  // Extract and validate unique dates from audits
  let uniqueDates: string[];
  try {
    uniqueDates = Array.from(
      new Set(audits.map((a) => formatDateToMonthYear(a.date))),
    ).sort((a, b) => {
      const [monthA, yearA] = a.split("-").map(Number);
      const [monthB, yearB] = b.split("-").map(Number);
      return yearA - yearB || monthA - monthB;
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed extracting dates: ${err.message}`);
    } else {
      throw new Error("Failed extracting dates: unknown error");
    }
  }

  // Initialize matrix
  const matrix: FloorMatrix = {};
  floors.forEach((floor) => {
    matrix[floor] = {};
    uniqueDates.forEach((date) => {
      matrix[floor][date] = excluded_floors.includes(floor)
        ? "excluded"
        : "skipped";
    });
  });

  // Mark visited floors and validate audit data
  audits.forEach((audit) => {
    let dateKey: string;
    try {
      dateKey = formatDateToMonthYear(audit.date);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `Invalid date in audit (${audit.date}): ${err.message}`,
        );
      } else {
        throw new Error(`Invalid date in audit (${audit.date}): unknown error`);
      }
    }

    if (!Array.isArray(audit.visited_floors)) {
      throw new Error(
        `visited_floors must be an array for audit on ${audit.date}`,
      );
    }

    audit.visited_floors.forEach((floor) => {
      if (typeof floor !== "number") {
        throw new Error(
          `Invalid floor number (${floor}) in audit on ${audit.date}`,
        );
      }
      if (matrix[floor] && matrix[floor][dateKey] !== "excluded") {
        matrix[floor][dateKey] = "visited";
      }
    });
  });

  return matrix;
}
