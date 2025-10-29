import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing"); // your actual DB name

    let userRewards = await db.collection("rewards").findOne({ username });

    if (!userRewards) {
      userRewards = { username, points: 0, vouchers: [], history: [] };
      await db.collection("rewards").insertOne(userRewards);
    }

    return NextResponse.json(userRewards, { status: 200 });
  } catch (err) {
    console.error("rewards/get error:", err);
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}
