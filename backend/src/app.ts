import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 4000;
const xeroApiUrl = process.env.XERO_API_URL || 'http://xero-mock:3000/api.xro/2.0/Reports/BalanceSheet';

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://frontend:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.get('/api/balance-sheet', async (_req, res) => {
  try {
    console.log(`Fetching balance sheet from Xero API: ${xeroApiUrl}`);
    const response = await axios.get(xeroApiUrl);
    console.log('Successfully fetched balance sheet data from Xero API');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching balance sheet:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to fetch balance sheet data',
      details: errorMessage 
    });
  }
});

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
    console.log(`Using Xero API URL: ${xeroApiUrl}`);
    console.log(`CORS enabled for frontend origins`);
  });
}

export default app; 