// "use client";

// import { loadRazorpayScript } from "../utils/razorpay";

// interface RazorpayResponse {
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   razorpay_signature: string;
// }

// interface RazorpayError {
//   error: {
//     code: string;
//     description: string;
//     source: string;
//     step: string;
//     reason: string;
//     metadata?: {
//       order_id: string;
//     };
//   };
// }

// interface RazorpayPackageButtonProps {
//   brokerId: string;          // logged in broker
//   packageKey: string;        // "basic", "pro", etc
//   packageName: string;       // for display
//   amount: number;            // display only, backend uses packageKey for real price
//   disabled?: boolean;
//   onSuccess?: (response: RazorpayResponse) => void;
//   onClose?: () => void;
// }

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// export default function RazorpayPackageButton({
//   brokerId,
//   packageKey,
//   packageName,
//   amount,
//   disabled = false,
//   onSuccess,
//   onClose,
// }: RazorpayPackageButtonProps) {
//   const handlePayment = async () => {
//     if (disabled) return;

//     const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
//     const apiUrl =
//       process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

//     if (!razorpayKey) {
//       alert("Razorpay key not configured");
//       console.error("NEXT_PUBLIC_RAZORPAY_KEY_ID missing");
//       return;
//     }

//     const isLoaded = await loadRazorpayScript();
//     if (!isLoaded) {
//       alert("Razorpay SDK failed to load");
//       return;
//     }

//     try {
//       // Call backend to create order using brokerId + packageKey
//       const res = await fetch(`${apiUrl}/payments/create-order`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           brokerId,
//           packageKey,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         console.error("Order creation failed", res.status, errorData);
//         throw new Error(errorData.message || "Failed to create order");
//       }

//       const data = await res.json();

//       if (!data.success || !data.order || !data.order.id) {
//         console.error("Invalid order response", data);
//         throw new Error("Invalid order response from server");
//       }

//       const order = data.order;

//       const handler = async (response: RazorpayResponse) => {
//         try {
//           console.log("Payment success:", response);
//           if (onSuccess) onSuccess(response);

//           // For now keep it simple, webhook will mark status as paid
//           alert("Payment successful. We will activate your package soon.");
//         } catch (err: any) {
//           console.error("Payment handler error:", err);
//           alert("Payment processing error: " + err.message);
//         }
//       };

//       const options = {
//         key: razorpayKey,
//         amount: order.amount,          // from server, already in paise
//         currency: "INR",
//         name: process.env.NEXT_PUBLIC_APP_NAME || "Rentify Leads",
//         description: `Lead package: ${packageName}`,
//         order_id: order.id,
//         handler,
//         prefill: {
//           // If you have broker contact details in future, fill here
//         },
//         theme: {
//           color: "#0d9488",
//         },
//         modal: {
//           ondismiss: function () {
//             console.log("Payment modal closed by user");
//             if (onClose) onClose();
//           },
//         },
//       };

//       const razorpay = new window.Razorpay(options);

//       razorpay.on("payment.failed", function (response: RazorpayError) {
//         console.error("Payment failed:", response.error);
//         alert(`Payment failed: ${response.error.description}`);
//       });

//       razorpay.open();
//     } catch (err: any) {
//       console.error("Payment error:", err);
//       alert(`Something went wrong: ${err.message}`);
//     }
//   };

//   return (
//     <button
//       type="button"
//       onClick={handlePayment}
//       disabled={disabled}
//       className="w-full bg-[#004F91] text-white cursor-pointer font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#003b6c] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//     >
//       Pay ₹{amount.toLocaleString("en-IN")}
//     </button>
//   );
// }


"use client";

import { loadRazorpayScript } from "../utils/razorpay";

interface RazorpayResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
}

interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata?: {
      order_id?: string;
      subscription_id?: string;
      payment_id?: string;
    };
  };
}

interface RazorpayPackageButtonProps {
  brokerId: string;
  packageKey: string;
  packageName: string;
  amount: number;

  packageId: string;
  purchaseMode: "one_time" | "subscription";

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
  packageId,
  purchaseMode,
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
      const endpoint =
        purchaseMode === "subscription"
          ? "/payments/create-subscription"
          : "/payments/create-order";

      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brokerId,
          packageKey,
          packageId,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        console.error("Payment init failed", res.status, data);
        throw new Error(data.message || "Failed to start payment");
      }

      const handler = async (response: RazorpayResponse) => {
        try {
          onSuccess?.(response);

          if (purchaseMode === "subscription") {
            alert(
              "Subscription started. Monthly auto payment is ON. You can cancel anytime from your dashboard."
            );
          } else {
            alert("Payment successful. We will activate your package soon.");
          }
        } catch (err: any) {
          console.error("Payment handler error:", err);
          alert("Payment processing error: " + (err?.message || "Unknown"));
        }
      };

      const options: any = {
        key: razorpayKey,
        name: process.env.NEXT_PUBLIC_APP_NAME || "Rentify Leads",
        description:
          purchaseMode === "subscription"
            ? `Monthly subscription: ${packageName}`
            : `Lead package: ${packageName}`,
        handler,
        theme: { color: "#0d9488" },
        modal: {
          ondismiss: function () {
            onClose?.();
          },
        },
      };

      if (purchaseMode === "one_time") {
        if (!data.order?.id) throw new Error("Invalid order response");
        options.order_id = data.order.id;
        options.amount = data.order.amount;
        options.currency = "INR";
      }

      if (purchaseMode === "subscription") {
        if (!data.subscription?.id)
          throw new Error("Invalid subscription response");
        options.subscription_id = data.subscription.id;
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: RazorpayError) {
        alert(`Payment failed: ${response?.error?.description || "Unknown"}`);
      });

      razorpay.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      alert(`Something went wrong: ${err?.message || "Unknown"}`);
    }
  };

  const buttonText =
    purchaseMode === "subscription"
      ? `Subscribe ₹${amount.toLocaleString("en-IN")}/month`
      : `Pay ₹${amount.toLocaleString("en-IN")}`;

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={disabled}
      className="w-full bg-[#004F91] text-white cursor-pointer font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#003b6c] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {buttonText}
    </button>
  );
}
