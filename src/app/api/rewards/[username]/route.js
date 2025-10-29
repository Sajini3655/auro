import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    const { username } = params;
    if (!username) {
      return Response.json({ message: "Missing username" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("yourDBName"); // 🔧 replace with your DB name

    const user = await db.collection("rewards").findOne({ username });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Convert string vouchers like "Rs.1000 Gift" into usable objects
    const vouchers = (user.vouchers || []).map((v, i) => {
      if (typeof v === "string") {
        const value = parseInt(v.replace(/\D/g, "")) || 0;
        return {
          code: `AUTO${i + 1}`, // auto-generated code
          type: "fixed",
          value,
          used: false,
          name: v,
        };
      }
      return v;
    });

    return Response.json({ vouchers }, { status: 200 });
  } catch (err) {
    console.error("Rewards fetch error:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
