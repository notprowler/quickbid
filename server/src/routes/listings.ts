import express from "express";
import listingsController from "@/controllers/listings.controller";
import { validateAccessToken } from "@/util/JWT";
const router = express.Router();

router.get("/", listingsController.getListings);
router.post("/", validateAccessToken, listingsController.createListing);
router.get("/product/:id", listingsController.getProductInformation);
router.delete(
  "/removeProduct/:id",
  validateAccessToken,
  listingsController.removeProduct
);
router.get(
  "/profile/user",
  validateAccessToken,
  listingsController.getProfileListings
);

// router.delete('/:id', )
// router.patch('/:id', )

export default router;
