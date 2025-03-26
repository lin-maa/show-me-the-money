import React, { useMemo, useCallback } from 'react';
import { BalanceSheetRow } from '../types/BalanceSheet';
import './BalanceSheetTable.css';

interface BalanceSheetTableProps {
  rows: BalanceSheetRow[];
  reportDate: string;
  isLoading: boolean;
  error: string | null;
}

const BalanceSheetTable: React.FC<BalanceSheetTableProps> = ({ 
  rows, 
  reportDate, 
  isLoading, 
  error 
}) => {

  const formatValue = useCallback((value: string): string => {

    if (value && /^-?\d+(\.\d+)?$/.test(value)) {

      const numValue = parseFloat(value);
      return numValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    // Return the original value if it's not a number
    return value || '';
  }, []);

  const formattedDate = useMemo(() => {
    return reportDate ? new Date(reportDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';
  }, [reportDate]);

  // Recursive function to render rows
  const renderRows = useCallback((rowsToRender: BalanceSheetRow[], depth = 0): React.ReactNode[] => {
    return rowsToRender.map((row, index) => {

      if (!row) return null;
      
      const rowKey = `row-${depth}-${index}`;
      const isSection = row.RowType === 'Section';
      const isHeader = row.RowType === 'Header';
      const isSummary = row.RowType === 'SummaryRow';
      
      const hasTitle = row.Title && row.Title.trim() !== '';
      
      const hasCells = row.Cells && row.Cells.length > 0 && row.Cells.some(cell => cell.Value && cell.Value.trim() !== '');
      
      const hasChildRows = row.Rows && row.Rows.length > 0;
      
      if (!hasTitle && !hasCells) {
        if (hasChildRows && row.Rows) {
          return renderRows(row.Rows, depth + 1);
        }
        return null;
      }

      const isSectionTitle = isSection && hasTitle && !hasChildRows;
      
      const rowClassName = `
        balance-sheet-row 
        depth-${depth} 
        ${isSection ? 'section' : ''}
        ${isHeader ? 'header' : ''}
        ${isSummary ? 'summary-row' : ''}
        ${isSectionTitle ? 'section-title' : ''}
      `;

      return (
        <React.Fragment key={rowKey}>
          <div className={rowClassName}>
            <div className="values-container">
              {hasTitle && (
                <div 
                  key="cell-title" 
                  className={`value title-cell depth-${depth}`}
                >
                  {row.Title}
                </div>
              )}
              {row.Cells?.map((cell, cellIndex) => 
                cell.Value ? (
                  <div 
                    key={`cell-${cellIndex}`} 
                    className={`value ${cellIndex === 0 ? 'primary-value' : ''}`}
                  >
                    {formatValue(cell.Value)}
                  </div>
                ) : null
              )}
            </div>
          </div>
          {hasChildRows && row.Rows && renderRows(row.Rows, depth + 1)}
        </React.Fragment>
      );
    }).filter(Boolean);
  }, [formatValue]);

  const renderedRows = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    return renderRows(rows);
  }, [rows, renderRows]);

  if (isLoading) {
    return <div className="loading">Loading balance sheet data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!rows || rows.length === 0) {
    return <div className="empty">No balance sheet data available</div>;
  }

  return (
    <div className="balance-sheet-container">
      <div className="balance-sheet-header">
        <h2>Balance Sheet</h2>
        <p className="report-date">As of {formattedDate}</p>
      </div>
      <div className="table-container">
        <div className="balance-sheet-flex">
          {renderedRows}
        </div>
      </div>
    </div>
  );
};

export default React.memo(BalanceSheetTable); 