import express from "express";
import listingsController from "@/controllers/listings.controller";
import SuspensionPolicy from '@/middlewares/suspension';
import { validateAccessToken } from "@/util/JWT";
const router = express.Router();

/* Visitors route to view listings and individual product information */
router.get("/", listingsController.getListings);
router.get("/product/:id", listingsController.getProductInformation);

/* Routes accessible after becoming User */
router.post("/", validateAccessToken, SuspensionPolicy, listingsController.createListing);
router.delete("/removeProduct/:id", validateAccessToken, SuspensionPolicy, listingsController.removeProduct);
router.get("/profile/user", validateAccessToken, SuspensionPolicy, listingsController.getProfileListings);

// router.delete('/:id', )
// router.patch('/:id', )

export default router;
