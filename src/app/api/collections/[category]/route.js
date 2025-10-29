import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing");

    // Fetch all gift items
    const giftItems = await db.collection("giftitems").find({}).toArray();

    return NextResponse.json(giftItems);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch gift items" }, { status: 500 });
  }
}
