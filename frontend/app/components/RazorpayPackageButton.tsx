"use client";

import { loadRazorpayScript } from "../utils/razorpay";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata?: {
      order_id: string;
    };
  };
}

interface RazorpayPackageButtonProps {
  brokerId: string;          // logged in broker
  packageKey: string;        // "basic", "pro", etc
  packageName: string;       // for display
  amount: number;            // display only, backend uses packageKey for real price
  disabled?: boolean;
  onSuccess?: (response: RazorpayResponse) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayPackageButton({
  brokerId,
  packageKey,
  packageName,
  amount,
  disabled = false,
  onSuccess,
  onClose,
}: RazorpayPackageButtonProps) {
  const handlePayment = async () => {
    if (disabled) return;

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

    if (!razorpayKey) {
      alert("Razorpay key not configured");
      console.error("NEXT_PUBLIC_RAZORPAY_KEY_ID missing");
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // Call backend to create order using brokerId + packageKey
      const res = await fetch(`${apiUrl}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brokerId,
          packageKey,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Order creation failed", res.status, errorData);
        throw new Error(errorData.message || "Failed to create order");
      }

      const data = await res.json();

      if (!data.success || !data.order || !data.order.id) {
        console.error("Invalid order response", data);
        throw new Error("Invalid order response from server");
      }

      const order = data.order;

      const handler = async (response: RazorpayResponse) => {
        try {
          console.log("Payment success:", response);
          if (onSuccess) onSuccess(response);

          // For now keep it simple, webhook will mark status as paid
          alert("Payment successful. We will activate your package soon.");
        } catch (err: any) {
          console.error("Payment handler error:", err);
          alert("Payment processing error: " + err.message);
        }
      };

      const options = {
        key: razorpayKey,
        amount: order.amount,          // from server, already in paise
        currency: "INR",
        name: process.env.NEXT_PUBLIC_APP_NAME || "Rentify Leads",
        description: `Lead package: ${packageName}`,
        order_id: order.id,
        handler,
        prefill: {
          // If you have broker contact details in future, fill here
        },
        theme: {
          color: "#0d9488",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by user");
            if (onClose) onClose();
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: RazorpayError) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      razorpay.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      alert(`Something went wrong: ${err.message}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={disabled}
      className="w-full bg-[#004F91] text-white cursor-pointer font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#003b6c] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Pay ₹{amount.toLocaleString("en-IN")}
    </button>
  );
}
