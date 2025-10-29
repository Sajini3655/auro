import connectMongoDB from "@/libs/mongodb";
import Reward from "@/models/reward";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, value } = await req.json();
  await connectMongoDB();
  await Reward.deleteOne({
    username,
    "prize.value": value,
    "prize.type": "voucher",
  });
  return NextResponse.json({ message: "Voucher deleted" });
}
