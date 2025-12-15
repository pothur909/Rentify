
    
"use client";

import { useEffect, useState } from "react";
import { loadRazorpayScript } from "../utils/razorpay";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  brokerId: string;
  packageKey: string;
  packageName: string;
  amount: number;
  supportsSubscription: boolean;
};

type SubInfo = {
  razorpaySubscriptionId: string;
  status: string;
  packageId?: any;
};

export default function PurchaseLeadPackage({
  brokerId,
  packageKey,
  packageName,
  amount,
  supportsSubscription,
}: Props) {
  const [loadingMode, setLoadingMode] = useState<null | "one_time" | "subscription" | "cancel">(null);
  const [sub, setSub] = useState<SubInfo | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
  const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const loadMySubscription = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payments/my-subscription/${brokerId}`);
      const json = await res.json();
      if (res.ok && json.success) {
        const s = json.data;
        // treat these as "has subscription"
        if (s?.razorpaySubscriptionId && ["created", "pending", "active", "authenticated"].includes(s.status)) {
          setSub({
            razorpaySubscriptionId: s.razorpaySubscriptionId,
            status: s.status,
            packageId: s.packageId,
          });
        } else {
          setSub(null);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (supportsSubscription && brokerId) loadMySubscription();
  }, [supportsSubscription, brokerId]);

  const startCheckout = async (autoRenew: boolean) => {
    if (!RZP_KEY) {
      alert("Razorpay key missing in frontend env");
      return;
    }

    setLoadingMode(autoRenew ? "subscription" : "one_time");

    const ok = await loadRazorpayScript();
    if (!ok) {
      setLoadingMode(null);
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/payments/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brokerId, packageKey, autoRenew }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Checkout failed");

      // One time
      if (data.mode === "one_time") {
        const order = data.order;

        const rzp = new window.Razorpay({
          key: RZP_KEY,
          amount: order.amount,
          currency: "INR",
          name: process.env.NEXT_PUBLIC_APP_NAME || "Rentify Leads",
          description: `One time package: ${packageName}`,
          order_id: order.id,
          handler: () => {
            alert("Payment successful. Package will activate shortly.");
            setLoadingMode(null);
          },
          modal: { ondismiss: () => setLoadingMode(null) },
        });

        rzp.on("payment.failed", (resp: any) => {
          alert(resp?.error?.description || "Payment failed");
          setLoadingMode(null);
        });

        rzp.open();
        return;
      }

      // Subscription
      if (data.mode === "subscription") {
        const rzp = new window.Razorpay({
          key: RZP_KEY,
          name: process.env.NEXT_PUBLIC_APP_NAME || "Rentify Leads",
          description: `Monthly subscription: ${packageName}`,
          subscription_id: data.subscriptionId,
          handler: async () => {
            alert("Subscription started. Auto renew is enabled. You can cancel anytime.");
            setLoadingMode(null);
            await loadMySubscription();
          },
          modal: { ondismiss: () => setLoadingMode(null) },
        });

        rzp.on("payment.failed", (resp: any) => {
          alert(resp?.error?.description || "Subscription auth failed");
          setLoadingMode(null);
        });

        rzp.open();
        return;
      }

      throw new Error("Unknown checkout mode from backend");
    } catch (e: any) {
      alert(e.message || "Something went wrong");
      setLoadingMode(null);
    }
  };

  const cancelSubscription = async () => {
    if (!sub?.razorpaySubscriptionId) return;

    const ok = confirm("Cancel subscription? Future auto payments will stop.");
    if (!ok) return;

    setLoadingMode("cancel");
    try {
      const res = await fetch(`${API_URL}/api/payments/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brokerId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Cancel failed");

      alert("Subscription cancelled successfully.");
      setSub(null);
    } catch (e: any) {
      alert(e.message || "Cancel failed");
    } finally {
      setLoadingMode(null);
    }
  };

  const hasActiveSubscription = !!sub;

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={loadingMode !== null}
        onClick={() => startCheckout(false)}
        className="w-full bg-[#004F91] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#003b6c] disabled:opacity-50"
      >
        {loadingMode === "one_time" ? "Opening..." : `One time: Pay ₹${amount.toLocaleString("en-IN")}`}
      </button>

      {supportsSubscription ? (
        <>
          <button
            type="button"
            disabled={loadingMode !== null || hasActiveSubscription}
            onClick={() => startCheckout(true)}
            className="w-full bg-white border border-[#004F91] text-[#004F91] font-semibold py-2 px-4 rounded-lg hover:bg-[#eaf3ff] disabled:opacity-50"
          >
            {loadingMode === "subscription" ? "Opening..." : hasActiveSubscription ? "Subscription active" : "Monthly subscription (auto renew)"}
          </button>

          {hasActiveSubscription && (
            <button
              type="button"
              disabled={loadingMode !== null}
              onClick={cancelSubscription}
              className="w-full bg-red-50 border border-red-300 text-red-700 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              {loadingMode === "cancel" ? "Cancelling..." : "Cancel subscription"}
            </button>
          )}

          <div className="text-xs text-gray-600 text-center">
            Auto-renew is handled by Razorpay. We assign package each billing cycle using webhook events.
          </div>
        </>
      ) : (
        <div className="text-xs text-gray-500 text-center">Subscription not available for this package</div>
      )}
    </div>
  );
}
