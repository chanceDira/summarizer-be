import express from 'express';
import summaryController from '../controllers/summaryController';

const router = express.Router();

// Define routes
router.post('/summarize', summaryController.summarize);

export default router;