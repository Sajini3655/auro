import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// Add item to cart
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing");

    const data = await req.json();

    if (!data.username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    await db.collection("cart").insertOne(data);
    return NextResponse.json({ message: "✅ Item added to cart" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// Get cart items for a user
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing");

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) return NextResponse.json([], { status: 200 });

    const cartItems = await db.collection("cart").find({ username }).toArray();
    return NextResponse.json(cartItems);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// Update quantity
export async function PATCH(req) {
  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing");

    const { _id, quantity } = await req.json();
    await db.collection("cart").updateOne(
      { _id: new ObjectId(_id) },
      { $set: { quantity } }
    );

    return NextResponse.json({ message: "Quantity updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update quantity" }, { status: 500 });
  }
}

// Remove item
export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing");

    const { _id } = await req.json();
    await db.collection("cart").deleteOne({ _id: new ObjectId(_id) });

    return NextResponse.json({ message: "Item removed" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
