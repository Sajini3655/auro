"use client";

import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎉 Registration Successful!</h1>
      <p>Welcome to Aura Clothing!</p>
      <button
        onClick={() => router.push("/register")}
        style={{ marginTop: "20px", padding: "10px 20px", background: "green", color: "white" }}
      >
        Go Back
      </button>
    </div>
  );
}
