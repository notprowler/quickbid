import express from "express";
import listingsController from "@/controllers/listings.controller";
const router = express.Router();

router.get("/", listingsController.getListings);
router.get("/:id", listingsController.getListing);
router.post('/', listingsController.createListing);

// router.delete('/:id', )
// router.patch('/:id', )

export default router;
