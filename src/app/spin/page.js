"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Confetti from "react-confetti";

export default function SpinPage() {
  const { user } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [message, setMessage] = useState("");
  const [rewards, setRewards] = useState({ points: 0, vouchers: [], history: [] });
  const [loading, setLoading] = useState(true);

  const prizes = [
    { type: "points", value: 50 },
    { type: "points", value: 100 },
    { type: "voucher", value: "Rs.500 Gift" },
    { type: "voucher", value: "Rs.1000 Gift" },
  ];

  useEffect(() => {
    if (!user?.username) {
      setLoading(false);
      return;
    }

    const fetchRewards = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/rewards/get?username=${encodeURIComponent(user.username)}`);
        let data = {};
        try {
          data = await res.json();
        } catch {
          data = { points: 0, vouchers: [], history: [] };
        }

        if (!res.ok) {
          console.error("Failed to fetch rewards", res.status, res.statusText, data);
          setMessage("⚠️ Could not load rewards.");
          setRewards({ points: 0, vouchers: [], history: [] });
        } else {
          setRewards(data || { points: 0, vouchers: [], history: [] });
        }
      } catch (err) {
        console.error("Fetch rewards error:", err);
        setMessage("⚠️ Could not load rewards.");
        setRewards({ points: 0, vouchers: [], history: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [user]);

  const spinWheel = async () => {
    if (!user?.username) {
      setMessage("❌ Please log in to spin the wheel!");
      return;
    }

    setSpinning(true);
    setMessage("");
    setPrize(null);

    const wheel = document.getElementById("wheel");
    if (wheel) {
      wheel.style.transition = "transform 2s ease-out";
      const rotation = 360 * 6 + Math.random() * 360;
      wheel.style.transform = `rotate(${rotation}deg)`;
    }

    const result = prizes[Math.floor(Math.random() * prizes.length)];

    setTimeout(async () => {
      setPrize(result);

      try {
        const res = await fetch("/api/rewards/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username, prize: result }),
        });

        let data = {};
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok || !data?.updatedRewards) {
          console.error("rewards/add error:", res.status, res.statusText, data);
          setMessage("Something went wrong while saving your prize.");
        } else {
          setRewards(data.updatedRewards);
          setMessage(
            result.type === "points"
              ? `✅ You won ${result.value} points!`
              : `🎁 You won a voucher: ${result.value}!`
          );
        }
      } catch (err) {
        console.error("Network/server error:", err);
        setMessage("Something went wrong while saving your prize.");
      } finally {
        setSpinning(false);
      }
    }, 2200);
  };

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-pink-800 text-white text-center p-6">
        <h2 className="text-3xl font-bold mb-4">🎡 Welcome to Spin & Win!</h2>
        <p className="text-lg opacity-90 mb-6">Please log in to spin the wheel and earn rewards.</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-pink-800 text-white p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-400 mb-4"></div>
        <p>Loading rewards...</p>
      </div>
    );

  const safeRewards = rewards || { points: 0, vouchers: [], history: [] };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-900 to-pink-700 p-6 text-white">
      <h1 className="text-5xl font-bold mb-8 text-center drop-shadow-lg">🎯 Spin the Wheel & Win Big!</h1>

      <div
        id="wheel"
        className="w-72 h-72 rounded-full border-[10px] border-pink-400 bg-gradient-to-tr from-purple-700 to-pink-700 flex items-center justify-center shadow-2xl relative"
        aria-hidden
      >
        <span className="text-white text-4xl font-bold">🎁</span>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`mt-8 px-12 py-5 text-2xl rounded-full font-bold transition-all duration-300 shadow-lg ${
          spinning ? "bg-gray-700 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
        }`}
      >
        {spinning ? "Spinning..." : "🎡 Spin Now"}
      </button>

      {prize && (
        <p className="mt-6 text-2xl font-bold text-green-400 animate-pulse">
          {prize.type === "points" ? `Points Won: ${prize.value}` : `Voucher Won: ${prize.value}`}
        </p>
      )}

      {message && (
        <p className="mt-4 text-center font-medium text-lg text-yellow-200 max-w-xl">{message}</p>
      )}

      <div className="mt-12 max-w-4xl w-full space-y-6">
        <div className="flex justify-between gap-6 flex-wrap">
          <div className="flex-1 bg-gray-800/60 p-6 rounded-2xl shadow-xl backdrop-blur-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">Points</h2>
            <p className="text-pink-400 text-3xl font-bold">{safeRewards.points ?? 0}</p>
          </div>

          <div className="flex-1 bg-gray-800/60 p-6 rounded-2xl shadow-xl backdrop-blur-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">Vouchers</h2>
            {safeRewards.vouchers?.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {safeRewards.vouchers.map((v, i) => (
                  <li key={i} className="bg-purple-700 p-3 rounded-xl shadow-md flex items-center justify-center font-semibold">
                    🎁 {v}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-300">No vouchers yet</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800/60 p-6 rounded-2xl shadow-xl backdrop-blur-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Spin History</h2>
          {safeRewards.history?.length > 0 ? (
            <ul className="relative border-l border-pink-500 ml-6 space-y-4">
              {safeRewards.history.map((h, i) => (
                <li key={i} className="pl-4">
                  <span className="absolute -left-3 top-1 w-3 h-3 bg-pink-500 rounded-full" />
                  <span className="font-medium">{new Date(h.date).toLocaleString()}:</span> {h.prize}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-300">No spins yet.</p>
          )}
        </div>
      </div>

      {prize && <Confetti numberOfPieces={250} recycle={false} />}
    </div>
  );
}
