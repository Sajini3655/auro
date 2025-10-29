"use client";
import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function OrderSuccess() {
  useEffect(() => {

    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center px-6">
      <div className="bg-gray-800/70 backdrop-blur-lg shadow-2xl rounded-2xl p-10 max-w-lg">
        <div className="text-green-400 text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold mb-3 text-pink-400">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-300 mb-6">
          Thank you for your purchase! A confirmation email will be sent shortly.
        </p>

        <div className="border-t border-gray-700 my-6"></div>

        <p className="text-sm text-gray-400 mb-8">
          Estimated delivery: <span className="text-pink-400 font-semibold">3–5 business days</span>
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold text-white shadow-lg hover:shadow-pink-600/50 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>

      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} FitnessFirst Store. All rights reserved.
      </footer>
    </div>
  );
}
