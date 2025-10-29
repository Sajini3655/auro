"use client";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";


export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    voucherInput: "",
  });

  const [availableVouchers, setAvailableVouchers] = useState([]); // standardized voucher objects
  const [appliedVoucher, setAppliedVoucher] = useState(null); // selected voucher object
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [message, setMessage] = useState("");

  const normalizeVouchers = (rawVouchers = []) => {
    return (rawVouchers || []).map((v, i) => {
      if (!v) return null;
      if (typeof v === "object" && (v.code || v.value || v.name)) {
        return {
          code: v.code ?? `V${i}`,
          name: v.name ?? v.code ?? `Voucher ${v.value ?? ""}`,
          value: Number(v.value || 0),
          type: v.type || "fixed", // assume fixed if not provided
          used: !!v.used,
        };
      }

      if (typeof v === "string") {
        const digits = v.match(/(\d+(?:\.\d+)?)/);
        const value = digits ? Number(digits[0]) : 0;
        const code = v.replace(/\s+/g, "-").replace(/[^A-Za-z0-9\-]/g, "");
        return {
          code,
          name: v,
          value,
          type: "fixed",
          used: false,
        };
      }

      
      return {
        code: `V${i}`,
        name: String(v),
        value: 0,
        type: "fixed",
        used: false,
      };
    }).filter(Boolean);
  };

  useEffect(() => {
    if (!user?.username) {
      setLoadingVouchers(false);
      return;
    }

    const fetchVouchers = async () => {
      setLoadingVouchers(true);
      setMessage("");
      try {
        const res = await fetch(`/api/rewards/get?username=${encodeURIComponent(user.username)}`);
        const text = await res.text();
        if (!res.ok) {
          console.error("Failed to fetch rewards:", res.status, res.statusText, text);
          setAvailableVouchers([]);
          setMessage("Could not load vouchers.");
          setLoadingVouchers(false);
          return;
        }
        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch (err) {
          console.error("Failed to parse rewards JSON:", err, "raw:", text);
          setAvailableVouchers([]);
          setMessage("Could not load vouchers.");
          setLoadingVouchers(false);
          return;
        }

        const rawVouchers = data.vouchers || [];
        const parsed = normalizeVouchers(rawVouchers).filter(v => !v.used);
        setAvailableVouchers(parsed);

        if (parsed.length > 0) {
          const best = parsed.slice().sort((a, b) => b.value - a.value)[0];
          setAppliedVoucher(best);
          setMessage(`🎁 Auto-applied best voucher: ${best.name}`);
        }
      } catch (err) {
        console.error("Fetch vouchers error:", err);
        setAvailableVouchers([]);
        setMessage("Could not load vouchers.");
      } finally {
        setLoadingVouchers(false);
      }
    };

    fetchVouchers();
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyVoucherLocally = () => {
    const codeOrText = (formData.voucherInput || "").trim();
    if (!codeOrText) {
      setMessage("Please enter a voucher code or select one.");
      return;
    }
    const matched = availableVouchers.find(v =>
      v.code.toLowerCase() === codeOrText.toLowerCase() ||
      v.name.toLowerCase() === codeOrText.toLowerCase()
    );

    if (!matched) {
      setMessage("Voucher not found or already used.");
      setAppliedVoucher(null);
      return;
    }

    setAppliedVoucher(matched);
    setMessage(`✅ Voucher applied locally: ${matched.name} (Rs.${matched.value})`);
  };

  const handleCheckout = async (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  setIsPlacing(true);
  setMessage("Processing order...");

  try {
    if (appliedVoucher && user?.username) {
      try {
        const res = await fetch("/api/rewards/use", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            voucher: appliedVoucher.code || appliedVoucher.name,
          }),
        });

        const text = await res.text();
        let json = {};
        try { json = text ? JSON.parse(text) : {}; } catch {}

        if (!res.ok) {
          console.warn(
            "Voucher reservation failed, proceeding without voucher:",
            res.status,
            res.statusText,
            json
          );
          setMessage("⚠️ Voucher could not be reserved. Continuing checkout without it.");
          setAppliedVoucher(null);
          setFormData(prev => ({ ...prev, voucherInput: "" }));
        } else {
          setAvailableVouchers(prev =>
            prev.filter(v => v.code !== appliedVoucher.code)
          );
          setMessage("Voucher reserved and applied. Completing order...");
        }
      } catch (err) {
        console.warn("Voucher API error, continuing checkout:", err);
        setMessage("⚠️ Voucher validation failed. Continuing checkout without it.");
        setAppliedVoucher(null);
        setFormData(prev => ({ ...prev, voucherInput: "" }));
      }
    }

    const orderPayload = {
      username: user?.username || "guest",
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
      },
      items: cart,
      voucherApplied: appliedVoucher
        ? { code: appliedVoucher.code, value: appliedVoucher.value, type: appliedVoucher.type }
        : null,
      subtotal,
      discount,
      total,
      createdAt: new Date().toISOString(),
    };

    await new Promise(r => setTimeout(r, 1200));

    clearCart();
    setMessage("✅ Payment successful — order placed!");
    setTimeout(() => router.push("/order-success"), 900);
  } catch (err) {
    console.error("Checkout error:", err);
    setMessage("❌ Checkout failed. Please try again.");
  } finally {
    setIsPlacing(false);
  }
};


  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === "percent") {
      discount = subtotal * (appliedVoucher.value / 100);
    } else {
      discount = appliedVoucher.value || 0;
    }
  }
  const total = Math.max(subtotal - discount, 0);

  
  const fmt = (v) => `Rs.${Number(v || 0).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-8 text-white flex justify-center">
      <motion.div
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* LEFT: form */}
        <motion.div className="bg-gray-800/60 p-8 rounded-2xl shadow-xl backdrop-blur-md border border-gray-700/50">
          <h2 className="text-3xl font-bold mb-4">Checkout Details</h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="p-3 rounded-lg bg-gray-900 border border-gray-700"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="p-3 rounded-lg bg-gray-900 border border-gray-700"
              />
            </div>

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Shipping address"
              required
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
            />

            <div className="grid grid-cols-2 gap-3">
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required className="p-3 rounded-lg bg-gray-900 border border-gray-700" />
              <input name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP / Postal" required className="p-3 rounded-lg bg-gray-900 border border-gray-700" />
            </div>

            <h3 className="mt-2 text-lg font-medium">Payment</h3>
            <div className="grid gap-3">
              <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="Card number" required className="p-3 rounded-lg bg-gray-900 border border-gray-700" />
              <div className="grid grid-cols-2 gap-3">
                <input name="expiry" value={formData.expiry} onChange={handleChange} placeholder="MM/YY" required className="p-3 rounded-lg bg-gray-900 border border-gray-700" />
                <input name="cvv" value={formData.cvv} onChange={handleChange} placeholder="CVV" required className="p-3 rounded-lg bg-gray-900 border border-gray-700" />
              </div>
            </div>

            {/* Voucher area: either select from available or enter code */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Voucher</label>

              {loadingVouchers ? (
                <div className="p-3 bg-gray-900 rounded">Loading vouchers...</div>
              ) : availableVouchers.length > 0 ? (
                <div className="flex gap-2">
                  <select
                    value={appliedVoucher?.code || ""}
                    onChange={(e) => {
                      const sel = availableVouchers.find(v => v.code === e.target.value) || null;
                      setAppliedVoucher(sel);
                      setMessage(sel ? `Selected voucher: ${sel.name} (${fmt(sel.value)})` : "");
                      setFormData(prev => ({ ...prev, voucherInput: "" }));
                    }}
                    className="p-3 bg-gray-900 rounded-lg border border-gray-700 flex-1"
                  >
                    <option value="">— select voucher —</option>
                    {availableVouchers.map((v, i) => (
 <option key={`${v.code}-${i}`} value={v.code}>
    {v.name} — {fmt(v.value)}
  </option>
))}

                  </select>

                  <input
                    name="voucherInput"
                    value={formData.voucherInput}
                    onChange={handleChange}
                    placeholder="Or paste code"
                    className="p-3 bg-gray-900 rounded-lg border border-gray-700 w-48"
                  />
                  <button type="button" onClick={applyVoucherLocally} className="px-4 py-2 bg-pink-600 rounded-lg">Apply</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input name="voucherInput" value={formData.voucherInput} onChange={handleChange} placeholder="Enter voucher code" className="p-3 bg-gray-900 rounded-lg border border-gray-700 flex-1" />
                  <button type="button" onClick={applyVoucherLocally} className="px-4 py-2 bg-pink-600 rounded-lg">Apply</button>
                </div>
              )}

              {appliedVoucher && (
                <p className="mt-2 text-green-400">Applied: {appliedVoucher.name} — {fmt(appliedVoucher.value)}</p>
              )}
            </div>

            <button type="submit" disabled={isPlacing} className={`w-full mt-3 py-3 rounded-lg font-semibold ${isPlacing ? "bg-gray-700" : "bg-gradient-to-r from-pink-600 to-purple-500"}`}>
              {isPlacing ? "Processing..." : "Place Order"}
            </button>

            {message && <p className="mt-2 text-yellow-200">{message}</p>}
          </form>
        </motion.div>

        {/* RIGHT: summary */}
        <motion.div className="bg-gray-800/60 p-8 rounded-2xl shadow-xl border border-gray-700/50">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="text-gray-400 mb-4">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((it, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-700 pb-2">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-400">Qty: {it.quantity}</div>
                    </div>
                    <div className="font-semibold text-pink-400">{fmt((it.price || 0) * (it.quantity || 1))}</div>
                  </div>
                ))}

                {/* If applied voucher is a gift-like voucher we show it as negative line */}
                {appliedVoucher && appliedVoucher.type === "fixed" && (
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2 mt-2">
                    <div>
                      <div className="font-medium text-green-400">🎁 Gift / Voucher: {appliedVoucher.name}</div>
                      <div className="text-sm text-gray-400">Reward applied</div>
                    </div>
                    <div className="font-semibold text-green-400">- {fmt(appliedVoucher.value)}</div>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-gray-700 pt-4 text-right space-y-2">
                <div>
                  <span className="text-gray-300">Subtotal: </span>
                  <span className="font-semibold">{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="text-green-400">
                    Discount: <span className="font-semibold">- {fmt(discount)}</span>
                  </div>
                )}
                <div className="text-xl font-bold border-t border-gray-700 pt-3 text-pink-400">
                  Total: {fmt(total)}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
