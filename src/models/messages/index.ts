import mongoose, { Types } from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const MESSAGE = mongoose.model('Message', messageSchema);
