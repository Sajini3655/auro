import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  history: [
    {
      prize: String,
      date: { type: Date, default: Date.now },
    },
  ],
  points: { type: Number, default: 0 },
  vouchers: { type: [String], default: [] },
});

export default mongoose.models.Reward || mongoose.model("Reward", RewardSchema);
