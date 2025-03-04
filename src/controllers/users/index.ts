import {Router} from 'express';
import { getUsers } from '../../services';
import { makeResponse } from '../../lib';

const router = Router();

// Get all users except current user
router.get('/', async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const users = await getUsers({
      _id: { $ne: currentUserId }
    });

    return makeResponse(res, 200, true, 'Users retrieved successfully', users);
  } catch (error) {
    return makeResponse(res, 400, false, (error as Error).message, undefined);
  }
});

export const userRouter = router;