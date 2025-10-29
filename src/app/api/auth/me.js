import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("yourDBName");

    // Example: fetch first user as logged-in
    const user = await db.collection("users").findOne({ username: "web" });

    if (!user) return res.status(404).json({ user: null });

    res.status(200).json({ user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}
