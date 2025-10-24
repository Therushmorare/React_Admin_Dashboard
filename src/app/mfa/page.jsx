"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MFAPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Load sessionStorage only in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("user_id");
      if (!storedUserId) {
        router.push("/login");
      } else {
        setUserId(storedUserId);
      }
    }
  }, [router]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!userId || !token) {
      setError("Please enter the MFA code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://jellyfish-app-z83s2.ondigitalocean.app/api/admin/adminAuth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin_id: userId, token: token }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      sessionStorage.setItem("admin_email", data.email);
      router.push("/pages/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId) return;

    setResendLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/admin/resendMFA/${userId}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to resend code");

      alert("MFA code resent to your email!");
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
      <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/bma_logo.png"
            alt="BMA Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-2">
          MFA Verification
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Enter the MFA code sent to your email
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3 bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              MFA Code
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow shadow-sm hover:shadow-md"
              placeholder="Enter code"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="w-full mt-4 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center justify-center gap-2"
        >
          {resendLoading ? "Resending..." : "Resend Code"}
        </button>
      </div>
    </div>
  );
}