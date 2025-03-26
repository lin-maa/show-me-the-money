import axios from 'axios';
import { BalanceSheetResponse } from '../types/BalanceSheet';
import { fetchBalanceSheet } from './balanceSheetService';

// Mock axios
jest.mock('axios');

describe('balanceSheetService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fetches balance sheet data successfully', async () => {
    const mockResponse: BalanceSheetResponse = {
      Reports: [
        {
          ReportID: '123',
          ReportName: 'Balance Sheet',
          ReportDate: '2023-11-30',
          UpdatedDateUTC: '2023-11-30T00:00:00Z',
          Rows: []
        }
      ]
    };

    // Setup the mocked response
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchBalanceSheet();

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/balance-sheet'));

    expect(result).toEqual(mockResponse);
  });

  test('handles errors when fetching fails', async () => {
    // Setup the mocked error response
    const errorMessage = 'Network Error';
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchBalanceSheet()).rejects.toThrow();

    expect(axios.get).toHaveBeenCalled();
  });
}); 