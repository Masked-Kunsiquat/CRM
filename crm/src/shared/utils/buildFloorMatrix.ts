// src/utils/buildFloorMatrix.ts

/**
 * Represents an account with floor-related configuration
 */
type Account = {
  /** Minimum floor number in the building */
  floors_min: number;
  /** Maximum floor number in the building */
  floors_max: number;
  /** List of floors excluded from regular auditing */
  excluded_floors: number[];
};

/**
 * Represents a single audit record
 */
type Audit = {
  /** Date of the audit in 'YYYY-MM-DD' format */
  date: string;
  /** List of floor numbers that were visited during this audit */
  visited_floors: number[];
};

/**
 * Represents the floor visitation matrix
 * The outer key is the floor number
 * The inner key is the month-year in 'MM-YYYY' format
 * The value indicates the status of that floor for that month
 */
export type FloorMatrix = Record<
  number,
  Record<string, "visited" | "skipped" | "excluded">
>;

/**
 * Formats a date from 'YYYY-MM-DD' to 'MM-YYYY' format
 *
 * @param dateStr - The date string in 'YYYY-MM-DD' format
 * @returns The formatted date in 'MM-YYYY' format
 * @throws Error if the date string is not in the expected format
 */
const formatDateToMonthYear = (dateStr: string): string => {
  const dateParts = dateStr.split("-");
  if (dateParts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}. Expected 'YYYY-MM-DD'.`);
  }
  const [year, month] = dateParts;
  return `${month}-${year}`;
};

/**
 * Builds a matrix showing the status of each floor for each month based on account configuration and audit history
 *
 * The matrix provides a comprehensive view of floor visitation patterns over time, with each floor
 * marked as either 'visited', 'skipped', or 'excluded' for each month.
 *
 * @param account - The account object containing floor configuration
 * @param audits - Array of audit records showing which floors were visited on which dates
 * @returns A floor matrix mapping each floor to its status for each month
 * @throws Error if account or audit data is invalid
 *
 * @example
 * const account = {
 *   floors_min: 1,
 *   floors_max: 10,
 *   excluded_floors: [13]
 * };
 *
 * const audits = [
 *   { date: '2023-01-15', visited_floors: [1, 2, 3] },
 *   { date: '2023-02-10', visited_floors: [4, 5, 6] }
 * ];
 *
 * const matrix = buildFloorMatrix(account, audits);
 */
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
