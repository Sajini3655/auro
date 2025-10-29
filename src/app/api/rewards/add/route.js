import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, prize } = await request.json();

    if (!username || !prize) {
      return NextResponse.json({ error: "Username and prize are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("auro-clothing");
    const collection = db.collection("rewards");

    const userRewards = await collection.findOne({ username });

    if (!userRewards) {
      const newUser = {
        username,
        points: prize.type === "points" ? prize.value : 0,
        vouchers: prize.type === "voucher" ? [prize.value] : [],
        history: [{ prize: formatPrize(prize), date: new Date() }],
      };
      await collection.insertOne(newUser);
      return NextResponse.json({ updatedRewards: newUser }, { status: 201 });
    }

    // Update existing
    const updatedRewards = {
      ...userRewards,
      points:
        prize.type === "points"
          ? (userRewards.points || 0) + prize.value
          : userRewards.points || 0,
      vouchers:
        prize.type === "voucher"
          ? [...(userRewards.vouchers || []), prize.value]
          : userRewards.vouchers || [],
      history: [
        ...(userRewards.history || []),
        { prize: formatPrize(prize), date: new Date() },
      ],
    };

    await collection.updateOne(
      { username },
      { $set: updatedRewards },
      { upsert: true }
    );

    return NextResponse.json({ updatedRewards }, { status: 200 });
  } catch (err) {
    console.error("rewards/add error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function formatPrize(prize) {
  return prize.type === "points" ? `${prize.value} Points` : `Voucher: ${prize.value}`;
}
