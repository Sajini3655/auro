import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

async function seed() {
  const client = await clientPromise;
  const db = client.db("auro-clothing");


  await db.collection("users").deleteMany({});
  await db.collection("products").deleteMany({});
  await db.collection("vouchers").deleteMany({});
  await db.collection("cart").deleteMany({});


  const hashedPassword = await bcrypt.hash("password123", 10);
  await db.collection("users").insertOne({
    username: "demoUser",
    email: "demo@auro.com",
    password: hashedPassword,
  });


  await db.collection("products").insertMany([
    { name: "Men's T-Shirt", price: 1500, category: "men" },
    { name: "Men's Jeans", price: 3000, category: "men" },
    { name: "Women's Dress", price: 3500, category: "women" },
    { name: "Women's Skirt", price: 2500, category: "women" },
    { name: "Sale Item 1", price: 1000, category: "sale" },
  ]);


  await db.collection("vouchers").insertMany([
    { name: "Rs.500 Gift Voucher", price: 500 },
    { name: "Rs.1000 Gift Voucher", price: 1000 },
    { name: "Rs.2000 Gift Voucher", price: 2000 },
  ]);

  console.log("Database seeded successfully!");
  process.exit();
}

seed();
