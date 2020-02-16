import mongoose from 'mongoose';

const BalanceSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
    },
    participants: {
      type: Object,
    },
    historic: {
      type: Array,
    },
  },
  { collection: 'balance', timestamps: true }
);

export default mongoose.model('BalanceMongo', BalanceSchema);
