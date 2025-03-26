import React, { useState, useEffect } from 'react';
import BalanceSheetTable from './components/BalanceSheetTable';
import { fetchBalanceSheet } from './services/balanceSheetService';
import { BalanceSheetRow, BalanceSheetReport } from './types/BalanceSheet';
import './App.css';

const App: React.FC = () => {
  const [rows, setRows] = useState<BalanceSheetRow[]>([]);
  const [reportDate, setReportDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBalanceSheet = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBalanceSheet();
        
        if (data.Reports && data.Reports.length > 0) {
          const report: BalanceSheetReport = data.Reports[0];
          setRows(report.Rows);
          setReportDate(report.ReportDate);
        } else {
          setError('No balance sheet data available');
        }
      } catch (err) {
        setError('Failed to load balance sheet data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBalanceSheet();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Show Me The Money</h1>
        <p>Xero Balance Sheet Viewer</p>
      </header>
      <main className="app-content">
        <BalanceSheetTable 
          rows={rows}
          reportDate={reportDate}
          isLoading={isLoading}
          error={error}
        />
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Show Me The Money</p>
      </footer>
    </div>
  );
};

export default App; 