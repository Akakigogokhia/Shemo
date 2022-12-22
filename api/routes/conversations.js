import express from 'express';
import Conversation from '../models/Conversation.js';

const router = express.Router();

//new conversation
router.post('/', async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get conversations
router.get('/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/find/:firstId/:secondId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(conversation);
  } catch (error) {}
});

export default router;
