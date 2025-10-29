import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, voucher } = req.body;
    if (!username || !voucher) {
      return res.status(400).json({ message: "Missing username or voucher" });
    }

    const client = await clientPromise;
    const db = client.db("yourDBName");

    const user = await db.collection("rewards").findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingVoucher = user.vouchers.find(v => v.code === voucher && !v.used);
    if (!existingVoucher) {
      return res.status(400).json({ message: "Invalid or already used voucher" });
    }

    await db.collection("rewards").updateOne(
      { username, "vouchers.code": voucher },
      { $set: { "vouchers.$.used": true } }
    );

    const updatedRewards = await db.collection("rewards").findOne({ username });
    res.status(200).json({ updatedRewards });
  } catch (err) {
    console.error("use voucher error:", err);
    res.status(500).json({ message: "Server error while using voucher" });
  }
}
