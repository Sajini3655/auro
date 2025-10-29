import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("auro-clothing");

    const user = await db.collection("users").findOne({ username });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = generateToken({ username: user.username });

    return NextResponse.json({
      message: "Login successful",
      user: { username: user.username },
      token,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
