import express from 'express'
import transactionsController from '@/controllers/transactions.Controller';

const router = express.Router();

router.post('/', transactionsController.newTransaction);

export default router;