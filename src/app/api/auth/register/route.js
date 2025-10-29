import clientPromise from "../../../../lib/mongodb"; // adjust path
import bcrypt from "bcryptjs";
import { generateToken } from "../../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("auro-clothing");

    // Check if username exists
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Generate JWT token
    const token = generateToken({ username });

    return NextResponse.json({
      message: "Registration successful",
      user: { username },
      token,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
