import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("auro-clothing");
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ collections });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
