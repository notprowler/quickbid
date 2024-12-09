import express from "express";
import { getProductInformation, getListings, getProfileListings, removeProduct, createListing } from "@/controllers/listings.controller";
import { validateAccessToken } from "@/util/JWT";
const router = express.Router();


router.get("/:id", getListings);
router.get("/product/:id", validateAccessToken, getProductInformation);
router.delete("/removeProduct/:id", validateAccessToken, removeProduct);
router.get("/profile/user", validateAccessToken, getProfileListings);
router.post('/', validateAccessToken, createListing);

// router.delete('/:id', )
// router.patch('/:id', )

export default router;
