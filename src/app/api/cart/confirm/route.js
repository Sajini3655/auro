import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { username, cart, total, paymentMethod } = await req.json();
    if (!username || !cart || !total || !paymentMethod) {
      return Response.json({ message: "Missing data" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("yourDBName");

    // Save the order
    const order = {
      username,
      cart,
      total,
      paymentMethod,
      status: "paid",
      createdAt: new Date(),
    };
    await db.collection("orders").insertOne(order);

    // Clear user's cart after order
    await db.collection("cart").updateOne(
      { username },
      { $set: { items: [] } }
    );

    return Response.json({ message: "Order placed", order }, { status: 200 });
  } catch (err) {
    console.error("Order confirmation error:", err);
    return Response.json({ message: "Failed to place order" }, { status: 500 });
  }
}
