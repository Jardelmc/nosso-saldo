import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password_hash: {
      type: String,
    },
    balances: {
      type: Array,
      default: [],
    },
  },
  { collection: 'user', timestamps: true }
);

export default mongoose.model('UserMongo', UserSchema);
