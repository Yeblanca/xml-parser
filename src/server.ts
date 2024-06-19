// server.ts
import express from 'express';
import { fetchAndProcessMakes } from './services/xml-parser.service';

const app = express();
const PORT = process.env.PORT || 3000;

// Function that starts the server.
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Start server only after data is done being fetched and processed
const initializeDataAndServer = async () => {
  try {
    console.log('Fetching and processing makes...');
    await fetchAndProcessMakes();
    console.log('Data fetched and processed successfully');
    startServer();
  } catch (error) {
    console.error('Error during initialization', error);
    process.exit(1); // Exit the process with a failure code
  }
};

// Initialize data and then start the server
initializeDataAndServer();
