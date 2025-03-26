import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as balanceSheetService from './services/balanceSheetService';

jest.mock('./services/balanceSheetService');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the app header', () => {
    jest.spyOn(balanceSheetService, 'fetchBalanceSheet').mockResolvedValue({
      Reports: []
    });

    render(<App />);
    
    expect(screen.getByText('Show Me The Money')).toBeInTheDocument();
    expect(screen.getByText('Xero Balance Sheet Viewer')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    jest.spyOn(balanceSheetService, 'fetchBalanceSheet').mockImplementation(
      () => new Promise(() => {})
    );

    render(<App />);
    
    expect(screen.getByText('Loading balance sheet data...')).toBeInTheDocument();
  });

  test('displays balance sheet data when loaded successfully', async () => {
    const mockData = {
      Reports: [{
        ReportID: '1',
        ReportName: 'Balance Sheet',
        ReportDate: '2023-11-30',
        UpdatedDateUTC: '2023-11-30T00:00:00Z',
        Rows: [{
          RowType: 'Section',
          Title: 'Assets',
          Cells: [{ Value: '10000' }]
        }]
      }]
    };
    
    jest.spyOn(balanceSheetService, 'fetchBalanceSheet').mockResolvedValue(mockData);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Assets')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      const dateElement = screen.getByText(/November 30, 2023/);
      expect(dateElement).toBeInTheDocument();
    });
  });

  test('shows error message when data fetching fails', async () => {
    jest.spyOn(balanceSheetService, 'fetchBalanceSheet').mockRejectedValue(
      new Error('Network error')
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load balance sheet data')).toBeInTheDocument();
    });
  });
}); 