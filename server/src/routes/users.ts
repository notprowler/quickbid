
import express from 'express';
import { getUser, updateUser, updateUserStatus, deleteUser } from '@/controllers/usersController';

const router = express.Router();

router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/status/:id', updateUserStatus)

export default router 

// GET /api/users/:id - Fetches profile data for a specific user by their ID.
// PUT /api/users/:id - Updates user profile information, such as username or balance. (CRUD: Update)
// DELETE /api/users/:id - Soft-deletes a user’s account (for deactivation or suspension).