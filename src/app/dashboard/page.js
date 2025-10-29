"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetch(`/api/dashboard?username=${user.username}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setPoints(data.points || 0);
      })
      .catch((err) => console.error(err));
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-purple-400">Dashboard</h1>

      <div className="bg-gray-800 p-6 rounded-2xl mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Rewards Points</h2>
        <p className="text-purple-400 text-lg">{points} Points</p>
        <button
          onClick={() => router.push("/spin")}
          className="mt-4 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Spin the Wheel
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order, index) => (
              <li
                key={index}
                className="bg-gray-700 p-4 rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-semibold">Order #{order._id}</p>
                  <p className="text-gray-300">Items: {order.items.length}</p>
                </div>
                <p className="font-bold text-purple-400">
                  Rs.{order.total.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
