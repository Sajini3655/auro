import { NextResponse } from "next/server";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

const rewardSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  vouchers: [{ type: String }],
  history: [
    {
      prize: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const Reward = mongoose.models.Reward || mongoose.model("Reward", rewardSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
}

// ✅ Ensure a user reward document exists
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username)
      return NextResponse.json({ error: "Username missing" }, { status: 400 });

    await connectDB();

    let userRewards = await Reward.findOne({ username });

    if (!userRewards) {
      userRewards = new Reward({ username, points: 0, vouchers: [], history: [] });
      await userRewards.save();
      console.log(`✅ Created reward record for ${username}`);
    }

    return NextResponse.json({ success: true, userRewards });
  } catch (err) {
    console.error("❌ Error in /api/rewards/user:", err);
    return NextResponse.json(
      { error: "Failed to fetch or create reward user" },
      { status: 500 }
    );
  }
}
