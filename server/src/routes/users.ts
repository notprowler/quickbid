import express from 'express';
import express, { Request, Response } from "express";
import { validateAccessToken } from "@/util/JWT";
import { getUser, updateUser, updateUserStatus, deleteUser, updateUserRating, newUserComplaint, getUserProfile} from '@/controllers/users.controller';

const router = express.Router();

router.get("/profile", validateAccessToken, getUserProfile);
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/status/:id', updateUserStatus)
router.put('/rating/:id', updateUserRating)
router.post('/complaint/:id', newUserComplaint);

export default router;
