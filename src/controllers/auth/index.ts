
import Router from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { getUser, saveUser } from '../../services/users';
import { makeResponse } from '../../lib';

const router = Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await getUser({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await saveUser({ username, email, password: hashPassword });

    return makeResponse(res, 200, true, 'User registered successfully', newUser);
  } catch (error) {
    return makeResponse(res, 400, false, (error as Error).message, undefined);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user: any = await getUser({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Incorrect password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    return makeResponse(res, 200, true, 'User logged in successfully', { user, token });
  } catch (error) {
    return makeResponse(res, 400, false, (error as Error).message, undefined);
  }
});

export const authRouter = router;