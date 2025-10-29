import clientPromise from "../../../../lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("auro");

    const cart = await db.collection("carts").findOne({ userId });
    return new Response(JSON.stringify({ items: cart?.items || [] }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
