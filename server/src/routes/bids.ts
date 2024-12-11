import express from 'express'
import bidsController from '@/controllers/bids.Controller';
import { validateAccessToken } from '@/util/JWT';
const router = express.Router();

router.get('/:itemID', bidsController.retrieveAllBids);
router.put('/accept/:itemID', bidsController.bidAccepted);
router.put('/reject/:itemID', bidsController.bidRejected);
router.post('/place', validateAccessToken,bidsController.placeBid);
router.post('/place/:itemID', validateAccessToken, bidsController.placeBid);
export default router