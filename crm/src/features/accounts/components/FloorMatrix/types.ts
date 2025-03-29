export type FloorStatus = "visited" | "skipped" | "excluded";

export type FloorMatrixData = Record<number, Record<string, FloorStatus>>;

export interface Audit {
  date: string;
  visited_floors: number[];
  score?: number;
}

export interface FloorMatrixProps {
  data: FloorMatrixData;
  title?: string;
  className?: string;
  audits?: Audit[];
  showTitle?: boolean;
}

export interface AuditDetail {
  date: string;
  score?: number;
}

export interface ChartColors {
  unknown: string;
  excluded: string;
  skipped: string;
  visited: string;
}
