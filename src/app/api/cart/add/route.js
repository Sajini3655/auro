import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userEmail, item, quantity } = await req.json();

  if (!userEmail || !item || !quantity)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing");

    await db.collection("carts").updateOne(
      { userEmail },
      { $push: { items: { ...item, quantity } } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}
