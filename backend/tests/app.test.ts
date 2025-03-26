import request from 'supertest';
import axios from 'axios';
import app from '../src/app';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Balance Sheet API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return balance sheet data when API call is successful', async () => {
    // Mock data
    const mockData = {
      Reports: [
        {
          ReportID: '12345',
          ReportName: 'Balance Sheet',
          ReportDate: '2023-11-30',
          UpdatedDateUTC: '2023-11-30T12:00:00Z',
          Rows: [
            {
              RowType: 'Section',
              Title: 'Assets',
              Cells: [{ Value: '10000.00' }],
              Rows: [
                {
                  RowType: 'Row',
                  Title: 'Bank Account',
                  Cells: [{ Value: '10000.00' }]
                }
              ]
            }
          ]
        }
      ]
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await request(app).get('/api/balance-sheet');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api.xro/2.0/Reports/BalanceSheet'));
  });

  it('should return 500 error when Xero API call fails', async () => {
    const errorMessage = 'Service unavailable';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app).get('/api/balance-sheet');
    
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to fetch balance sheet data');
    expect(response.body.details).toBe(errorMessage);
  });

  it('should return 200 OK for health check endpoint', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
}); 