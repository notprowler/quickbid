import express from 'express'
import bidsController from '@/controllers/bids.Controller';
import SuspensionPolicy from '@/middlewares/suspension';
const router = express.Router();

router.post('/:itemID', bidsController.newBid);
router.get('/:itemID', bidsController.retrieveAllBids);
router.put('/accept/:itemID', bidsController.bidAccepted);
router.put('/reject/:itemID', bidsController.bidRejected);

export default router