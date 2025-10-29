import { NextResponse } from "next/server";
import cookie from "cookie";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

  response.headers.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "strict",
    })
  );

  return response;
}
