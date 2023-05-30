import express from 'express';
import summaryRoute from './routes/summaryRoute'
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
const port = 3000; // Choose your desired port number

// Middleware to parse JSON requests
app.use(express.json());

// Routes

app.use('/api/v1', summaryRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});