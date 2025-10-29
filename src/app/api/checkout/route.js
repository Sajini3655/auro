// src/app/api/rewards/use/route.js
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { username, voucher } = await req.json();

    if (!username || !voucher) {
      return Response.json(
        { message: "Missing username or voucher" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("yourDBName"); // ⚠️ replace with your actual DB name

    // find user's rewards doc
    const user = await db.collection("rewards").findOne({ username });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // handle both array-of-strings or array-of-objects
    const vouchers = user.vouchers || [];
    let foundIndex = -1;

    const foundVoucher = vouchers.find((v, i) => {
      const code = typeof v === "string" ? v : v.code || v.name;
      if (code === voucher && !v.used) {
        foundIndex = i;
        return true;
      }
      return false;
    });

    if (!foundVoucher) {
      return Response.json(
        { message: "Invalid or already used voucher" },
        { status: 400 }
      );
    }

    // mark it as used
    if (typeof vouchers[foundIndex] === "string") {
      vouchers[foundIndex] = { code: vouchers[foundIndex], used: true };
    } else {
      vouchers[foundIndex].used = true;
    }

    await db.collection("rewards").updateOne(
      { username },
      { $set: { vouchers } }
    );

    return Response.json(
      {
        message: "Voucher marked as used successfully",
        usedVoucher: foundVoucher,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("use voucher API error:", err);
    return Response.json(
      { message: "Server error while using voucher" },
      { status: 500 }
    );
  }
}
