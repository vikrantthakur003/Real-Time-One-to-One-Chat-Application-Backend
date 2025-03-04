import { Router } from 'express';
import { getMessageCount, getMessages, saveMessage, updateMessages } from '../../services';
import { makeResponse } from '../../lib';

const router = Router();

// Get messages between two users
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;
    
    const messages = await getMessages({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId }
      ]
    });
    
    return makeResponse(res, 200, true, 'Messages retrieved successfully', messages);
  } catch (error) {
   return makeResponse(res, 400, false, (error as Error).message, undefined);
  }
});


// Get unread messages count
router.get('/unread/count', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // const unreadCount = await getMessageCount({
    //   to: userId,
    //   isRead: false
    // });

    const unreadMessage = await getMessages({
      to: userId,
      isRead: false
    });
    
    return makeResponse(res, 200, true, 'Unread count retrieved successfully', unreadMessage);
  } catch (error) {
    return makeResponse(res, 400, false, (error as Error).message, undefined);
  }
});

router.post('/', async (req, res) => {
  try {
    const { to, content } = req.body;
    const from = req.user.userId;
    
    const newMessage = await saveMessage({
      from,
      to,
      content,
      isRead: false
    })
    
    return makeResponse(res, 200, true, 'Message sent successfully', newMessage);
  } catch (error) {
    return makeResponse(res, 400, false, (error as Error).message, undefined);
  }
});

// Mark messages as read
router.put('/read/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

     await updateMessages(
      { from: userId, to: currentUserId, isRead: false },
      { isRead: true }
    );    
    
    return makeResponse(res, 200, true, 'Messages marked as read successfully');
  } catch (error) {
    return makeResponse(res, 400, false, (error as Error).message, undefined);
  }
});

export const messageRouter = router;