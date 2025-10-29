import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing");
    const items = await db.collection("giftitems").find({}).toArray();
    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch gift items" }, { status: 500 });
  }
}
