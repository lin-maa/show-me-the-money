import axios from 'axios';
import { BalanceSheetResponse } from '../types/BalanceSheet';

export const fetchBalanceSheet = async (): Promise<BalanceSheetResponse> => {
  try {
    const url = '/api/balance-sheet';
    
    const response = await axios.get(url);
    console.log('Balance sheet data received successfully');
    
    return response.data as BalanceSheetResponse;
  } catch (error) {
    console.error('Error fetching balance sheet:', error);

    if (axios.isAxiosError(error)) {
      console.error('API Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
    }
    throw error;
  }
};