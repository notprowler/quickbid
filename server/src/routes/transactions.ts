import express from 'express'
import transactionsController from '@/controllers/transactions.Controller';

const router = express.Router();

router.post('/:id', transactionsController.newTransaction);
router.get('/:id', transactionsController.getTransactions);

export default router;