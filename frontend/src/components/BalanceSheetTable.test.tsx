import React from 'react';
import { render, screen } from '@testing-library/react';
import BalanceSheetTable from './BalanceSheetTable';
import { BalanceSheetRow } from '../types/BalanceSheet';

describe('BalanceSheetTable Component', () => {
  const mockRows: BalanceSheetRow[] = [
    {
      RowType: 'Section',
      Title: 'Assets',
      Cells: [{ Value: 'Total' }],
      Rows: [
        {
          RowType: 'Row',
          Title: 'Bank Account',
          Cells: [{ Value: '5000.00' }]
        },
        {
          RowType: 'Row',
          Title: 'Accounts Receivable',
          Cells: [{ Value: '3000.00' }]
        }
      ]
    },
    {
      RowType: 'Section',
      Title: 'Liabilities',
      Cells: [{ Value: 'Total' }],
      Rows: [
        {
          RowType: 'Row',
          Title: 'Accounts Payable',
          Cells: [{ Value: '2000.00' }]
        }
      ]
    }
  ];

  const mockAdvancedRows: BalanceSheetRow[] = [
    {
      RowType: 'Header',
      Title: 'Balance Sheet Headers',
      Cells: [
        { Value: 'Amount' },
        { Value: 'Previous Year' }
      ]
    },
    {
      RowType: 'Section',
      Title: 'Assets',
      Cells: [{ Value: '8000.00' }],
      Rows: [
        {
          RowType: 'SummaryRow',
          Title: 'Current Assets',
          Cells: [{ Value: '5000.00' }],
          Rows: [
            {
              RowType: 'Row',
              Title: 'Cash',
              Cells: [{ Value: '3000.00' }]
            },
            {
              RowType: 'Row',
              Title: 'Accounts Receivable',
              Cells: [{ Value: '2000.00' }]
            }
          ]
        },
        {
          RowType: 'Total',
          Title: 'Total Assets',
          Cells: [{ Value: '8000.00' }]
        }
      ]
    },
    {
      RowType: 'Section',
      Title: '',
      Cells: [],
      Rows: [
        {
          RowType: 'Row',
          Title: 'Orphan Row',
          Cells: [{ Value: '100.00' }]
        }
      ]
    },
    {
      RowType: 'Section',
      Title: 'Equity',
      Cells: [{ Value: '6000.00' }]
    }
  ];

  test('renders loading state correctly', () => {
    render(
      <BalanceSheetTable
        rows={[]}
        reportDate=""
        isLoading={true}
        error={null}
      />
    );
    
    expect(screen.getByText('Loading balance sheet data...')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch data';
    render(
      <BalanceSheetTable
        rows={[]}
        reportDate=""
        isLoading={false}
        error={errorMessage}
      />
    );
    
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  test('renders empty state correctly', () => {
    render(
      <BalanceSheetTable
        rows={[]}
        reportDate=""
        isLoading={false}
        error={null}
      />
    );
    
    expect(screen.getByText('No balance sheet data available')).toBeInTheDocument();
  });

  test('renders balance sheet data correctly', () => {
    render(
      <BalanceSheetTable
        rows={mockRows}
        reportDate="2023-11-30"
        isLoading={false}
        error={null}
      />
    );
    
    expect(screen.getByText(/As of/)).toBeInTheDocument();
    expect(screen.getByText(/November 30, 2023/)).toBeInTheDocument();
    
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Liabilities')).toBeInTheDocument();
    
    expect(screen.getByText('Bank Account')).toBeInTheDocument();
    expect(screen.getByText('Accounts Receivable')).toBeInTheDocument();
    expect(screen.getByText('Accounts Payable')).toBeInTheDocument();
    
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('$3,000.00')).toBeInTheDocument();
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
  });

  describe('Advanced Row Type Tests', () => {
    test('renders header row correctly', () => {
      render(
        <BalanceSheetTable
          rows={mockAdvancedRows}
          reportDate="2023-12-31"
          isLoading={false}
          error={null}
        />
      );
      
      expect(screen.getByText('Balance Sheet Headers')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Previous Year')).toBeInTheDocument();
      
      const headerElements = screen.getAllByText('Balance Sheet Headers');
      expect(headerElements.length).toBeGreaterThanOrEqual(1);
    });

    test('renders summary row correctly', () => {
      render(
        <BalanceSheetTable
          rows={mockAdvancedRows}
          reportDate="2023-12-31"
          isLoading={false}
          error={null}
        />
      );
      
      expect(screen.getByText('Current Assets')).toBeInTheDocument();
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
      expect(screen.getByText('Cash')).toBeInTheDocument();
      expect(screen.getByText('$3,000.00')).toBeInTheDocument();
    });

    test('renders total row correctly', () => {
      render(
        <BalanceSheetTable
          rows={mockAdvancedRows}
          reportDate="2023-12-31"
          isLoading={false}
          error={null}
        />
      );
      
      expect(screen.getByText('Total Assets')).toBeInTheDocument();
      const amountElements = screen.getAllByText('$8,000.00');
      expect(amountElements.length).toBe(2);
    });

    test('renders section title row correctly', () => {
      render(
        <BalanceSheetTable
          rows={mockAdvancedRows}
          reportDate="2023-12-31"
          isLoading={false}
          error={null}
        />
      );
      
      expect(screen.getByText('Equity')).toBeInTheDocument();
      expect(screen.getByText('$6,000.00')).toBeInTheDocument();
    });

    test('handles rows with empty titles correctly', () => {
      render(
        <BalanceSheetTable
          rows={mockAdvancedRows}
          reportDate="2023-12-31"
          isLoading={false}
          error={null}
        />
      );
      
      expect(screen.getByText('Orphan Row')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });

    test('handles deeply nested rows correctly', () => {
      const deeplyNestedRows: BalanceSheetRow[] = [
        {
          RowType: 'Section',
          Title: 'Level 1',
          Cells: [{ Value: '1000.00' }],
          Rows: [
            {
              RowType: 'Section',
              Title: 'Level 2',
              Cells: [{ Value: '800.00' }],
              Rows: [
                {
                  RowType: 'Section',
                  Title: 'Level 3',
                  Cells: [{ Value: '500.00' }],
                  Rows: [
                    {
                      RowType: 'Row',
                      Title: 'Deepest Item',
                      Cells: [{ Value: '500.00' }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
      
      render(
        <BalanceSheetTable
          rows={deeplyNestedRows}
          reportDate="2023-12-31"
          isLoading={false}
          error={null}
        />
      );
      
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
      expect(screen.getByText('Level 3')).toBeInTheDocument();
      expect(screen.getByText('Deepest Item')).toBeInTheDocument();
      
      const fiveHundredElements = screen.getAllByText('$500.00');
      expect(fiveHundredElements.length).toBe(2);
    });
  });
}); 