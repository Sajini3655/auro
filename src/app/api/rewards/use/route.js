import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const { username, voucher } = await req.json();
    if (!username || !voucher) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("gym");

    // Find the user
    const user = await db.collection("rewards").findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user actually has this voucher
    if (!user.vouchers?.includes(voucher)) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 400 });
    }

    // Remove voucher and add history entry
    await db.collection("rewards").updateOne(
      { username },
      {
        $pull: { vouchers: voucher },
        $push: {
          history: {
            prize: `Used voucher: ${voucher}`,
            date: new Date(),
          },
        },
      }
    );

    return NextResponse.json({ success: true, message: "Voucher marked as used" });
  } catch (err) {
    console.error("Voucher use error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
