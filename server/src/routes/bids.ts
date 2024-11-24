import express from 'express'
import bidsController from '@/controllers/bidsController';
const router = express.Router();

router.post('/:{productID}', bidsController.newBid);
router.get('/:{productID}', bidsController.retrieveAllBids);
router.put('/:{productID}/accept', bidsController.bidAccepted);
router.put('/:{productID}/reject', bidsController.bidRejected);

export default router