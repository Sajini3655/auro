import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your_super_secret_key";

export function generateToken(user) {
  return jwt.sign(user, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
