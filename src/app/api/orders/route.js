import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// Replace this with your MongoDB URI
const uri = "mongodb+srv://sajinitharushika3655:sajinitharushika3655@auro-clothing.eqgbfb0.mongodb.net/auro-clothing?retryWrites=true&w=majority";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function POST(req) {
  try {
    const body = await req.json();
    const { cartItems, user } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("auro-clothing");

    const ordersCollection = db.collection("orders");

    const order = {
      user: user || "Guest",
      items: cartItems,
      total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);

    return NextResponse.json({ message: "Order placed!", orderId: result.insertedId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
