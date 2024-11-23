
import express from 'express';

const router = express.Router();

router.get('/:id', )
router.put('/:id', )
router.delete('/:id', )

export default router 

// GET /api/users/:id - Fetches profile data for a specific user by their ID.
// PUT /api/users/:id - Updates user profile information, such as username or balance. (CRUD: Update)
// DELETE /api/users/:id - Soft-deletes a user’s account (for deactivation or suspension).