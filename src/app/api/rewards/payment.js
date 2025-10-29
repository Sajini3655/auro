// /api/rewards/payment
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { username, voucher, status } = await req.json();
    // status: "success" or "failed"

    if (!username || !voucher || !status) {
      return Response.json({ message: "Missing parameters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("yourDBName");

    const user = await db.collection("rewards").findOne({ username });
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    if (status === "success") {
      // Payment successful → finalize voucher
      await db.collection("rewards").updateOne(
        { username, "vouchers.code": voucher },
        { $set: { "vouchers.$.used": true, "vouchers.$.usedPendingPayment": false } }
      );
    } else {
      // Payment failed → rollback voucher usage
      await db.collection("rewards").updateOne(
        { username, "vouchers.code": voucher },
        { $unset: { "vouchers.$.usedPendingPayment": "" } }
      );
    }

    const updatedRewards = await db.collection("rewards").findOne({ username });
    return Response.json({ updatedRewards }, { status: 200 });

  } catch (err) {
    console.error("payment API error:", err);
    return Response.json({ message: "Server error while confirming payment" }, { status: 500 });
  }
}
