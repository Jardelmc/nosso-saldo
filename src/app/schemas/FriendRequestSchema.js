import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    solicitation: {
      type: Array,
      default: [],
    },
  },
  { collection: 'friend_request', timestamps: true }
);

export default mongoose.model('FriendRequestMongo', FriendRequestSchema);
