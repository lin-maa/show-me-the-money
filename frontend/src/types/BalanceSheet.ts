export interface Cell {
  Value: string;
}

export interface BalanceSheetRow {
  RowType: string;
  Title: string;
  Cells: Cell[];
  Rows?: BalanceSheetRow[];
}

export interface BalanceSheetReport {
  ReportID: string;
  ReportName: string;
  ReportDate: string;
  UpdatedDateUTC: string;
  Rows: BalanceSheetRow[];
}

export interface BalanceSheetResponse {
  Reports: BalanceSheetReport[];
} 