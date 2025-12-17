
    
// "use client";

// import { useEffect, useState } from "react";
// import { loadRazorpayScript } from "../utils/razorpay";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// type Props = {
//   brokerId: string;
//   packageKey: string;
//   packageId: string;
//   packageName: string;
//   amount: number;
//   supportsSubscription: boolean;
// };

// type SubInfo = {
//   razorpaySubscriptionId: string;
//   status: string;
//   packageId?: any;
// };

// export default function PurchaseLeadPackage({
//   brokerId,
// packageId,
//   packageKey,
//   packageName,
//   amount,
//   supportsSubscription,
// }: Props) {
//   const [loadingMode, setLoadingMode] = useState<null | "one_time" | "subscription" | "cancel">(null);
//   const [sub, setSub] = useState<SubInfo | null>(null);

//   const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
//   const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

//   const loadMySubscription = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/payments/my-subscription/${brokerId}`);
//       const json = await res.json();
//       if (res.ok && json.success) {
//         const s = json.data;
//         // treat these as "has subscription"
//         if (s?.razorpaySubscriptionId && ["created", "pending", "active", "authenticated"].includes(s.status)) {
//           setSub({
//             razorpaySubscriptionId: s.razorpaySubscriptionId,
//             status: s.status,
//             packageId: s.packageId,
//           });
//         } else {
//           setSub(null);
//         }
//       }
//     } catch {
//       // ignore
//     }
//   };

//   useEffect(() => {
//     if (supportsSubscription && brokerId) loadMySubscription();
//   }, [supportsSubscription, brokerId]);

//   const startCheckout = async (autoRenew: boolean) => {
//     if (!RZP_KEY) {
//       alert("Razorpay key missing in frontend env");
//       return;
//     }

//     setLoadingMode(autoRenew ? "subscription" : "one_time");

//     const ok = await loadRazorpayScript();
//     if (!ok) {
//       setLoadingMode(null);
//       alert("Razorpay SDK failed to load");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/api/payments/create-checkout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ brokerId, packageKey, autoRenew }),
//       });

//       const data = await res.json();
//       if (!res.ok || !data.success) throw new Error(data.message || "Checkout failed");

//       // One time
//       if (data.mode === "one_time") {
//         const order = data.order;

//         const rzp = new window.Razorpay({
//           key: RZP_KEY,
//           amount: order.amount,
//           currency: "INR",
//           name: process.env.NEXT_PUBLIC_APP_NAME || "Rentify Leads",
//           description: `One time package: ${packageName}`,
//           order_id: order.id,
//           handler: () => {
//             alert("Payment successful. Package will activate shortly.");
//             setLoadingMode(null);
//           },
//           modal: { ondismiss: () => setLoadingMode(null) },
//         });

//         rzp.on("payment.failed", (resp: any) => {
//           alert(resp?.error?.description || "Payment failed");
//           setLoadingMode(null);
//         });

//         rzp.open();
//         return;
//       }

//       // Subscription
//       if (data.mode === "subscription") {
//         const rzp = new window.Razorpay({
//           key: RZP_KEY,
//           name: process.env.NEXT_PUBLIC_APP_NAME || "Rentify Leads",
//           description: `Monthly subscription: ${packageName}`,
//           subscription_id: data.subscriptionId,
//           handler: async () => {
//             alert("Subscription started. Auto renew is enabled. You can cancel anytime.");
//             setLoadingMode(null);
//             await loadMySubscription();
//           },
//           modal: { ondismiss: () => setLoadingMode(null) },
//         });

//         rzp.on("payment.failed", (resp: any) => {
//           alert(resp?.error?.description || "Subscription auth failed");
//           setLoadingMode(null);
//         });

//         rzp.open();
//         return;
//       }

//       throw new Error("Unknown checkout mode from backend");
//     } catch (e: any) {
//       alert(e.message || "Something went wrong");
//       setLoadingMode(null);
//     }
//   };

//   const cancelSubscription = async () => {
//     if (!sub?.razorpaySubscriptionId) return;

//     const ok = confirm("Cancel subscription? Future auto payments will stop.");
//     if (!ok) return;

//     setLoadingMode("cancel");
//     try {
//       const res = await fetch(`${API_URL}/api/payments/cancel-subscription`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ brokerId }),
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.message || "Cancel failed");

//       alert("Subscription cancelled successfully.");
//       setSub(null);
//     } catch (e: any) {
//       alert(e.message || "Cancel failed");
//     } finally {
//       setLoadingMode(null);
//     }
//   };

// //   const hasActiveSubscription = !!sub;
// const hasActiveSubscription =
//   !!sub && String(sub.packageId?._id || sub.packageId) === String(packageId);


//   return (
//     <div className="space-y-2">
//       <button
//         type="button"
//         disabled={loadingMode !== null}
//         onClick={() => startCheckout(false)}
//         className="w-full bg-[#004F91] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#003b6c] disabled:opacity-50"
//       >
//         {loadingMode === "one_time" ? "Opening..." : `One time: Pay ₹${amount.toLocaleString("en-IN")}`}
//       </button>

//       {supportsSubscription ? (
//         <>
//           <button
//             type="button"
//             disabled={loadingMode !== null || hasActiveSubscription}
//             onClick={() => startCheckout(true)}
//             className="w-full bg-white border border-[#004F91] text-[#004F91] font-semibold py-2 px-4 rounded-lg hover:bg-[#eaf3ff] disabled:opacity-50"
//           >
//             {loadingMode === "subscription" ? "Opening..." : hasActiveSubscription ? "Subscription active" : "Monthly subscription (auto renew)"}
//           </button>

//           {hasActiveSubscription && (
//             <button
//               type="button"
//               disabled={loadingMode !== null}
//               onClick={cancelSubscription}
//               className="w-full bg-red-50 border border-red-300 text-red-700 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 disabled:opacity-50"
//             >
//               {loadingMode === "cancel" ? "Cancelling..." : "Cancel subscription"}
//             </button>
//           )}

//           <div className="text-xs text-gray-600 text-center">
//             Auto-renew is handled by Razorpay. We assign package each billing cycle using webhook events.
//           </div>
//         </>
//       ) : (
//         <div className="text-xs text-gray-500 text-center">Subscription not available for this package</div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadRazorpayScript } from "../utils/razorpay";
import { CheckCircle2, Loader2, XCircle, Clock3 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  brokerId: string;
  packageKey: string;
  packageId: string;
  packageName: string;
  amount: number;
  supportsSubscription: boolean;
};

type SubInfo = {
  razorpaySubscriptionId: string;
  status: string;
  packageId?: any;
  currentCycleStart?: string | null;
  currentCycleEnd?: string | null;
  nextCycleOn?: string | null;
};

type ToastKind = "success" | "info" | "error";

function AutoToast({
  open,
  kind,
  title,
  desc,
}: {
  open: boolean;
  kind: ToastKind;
  title: string;
  desc?: string;
}) {
  if (!open) return null;

  const Icon =
    kind === "success" ? CheckCircle2 : kind === "error" ? XCircle : Clock3;

  const ring =
    kind === "success"
      ? "ring-green-200"
      : kind === "error"
      ? "ring-red-200"
      : "ring-blue-200";

  const bg =
    kind === "success"
      ? "bg-green-50"
      : kind === "error"
      ? "bg-red-50"
      : "bg-blue-50";

  const text =
    kind === "success"
      ? "text-green-700"
      : kind === "error"
      ? "text-red-700"
      : "text-blue-700";

  return (
    <div className="fixed inset-x-0 top-3 z-[9999] flex justify-center px-3">
      <div className={`w-full max-w-md rounded-2xl ${bg} ${text} shadow-lg ring-1 ${ring} p-4`}>
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold">{title}</div>
            {desc ? <div className="text-xs mt-0.5 opacity-90">{desc}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseLeadPackage({
  brokerId,
  packageId,
  packageKey,
  packageName,
  amount,
  supportsSubscription,
}: Props) {
  const [loadingMode, setLoadingMode] = useState<null | "one_time" | "subscription" | "cancel">(null);
  const [sub, setSub] = useState<SubInfo | null>(null);

  // toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastKind, setToastKind] = useState<ToastKind>("info");
  const [toastTitle, setToastTitle] = useState("");
  const [toastDesc, setToastDesc] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
  const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const toastTimerRef = useRef<any>(null);
  const pollingRef = useRef<any>(null);

  const showToast = (kind: ToastKind, title: string, desc?: string, ms = 2800) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastKind(kind);
    setToastTitle(title);
    setToastDesc(desc || "");
    setToastOpen(true);
    toastTimerRef.current = setTimeout(() => setToastOpen(false), ms);
  };

  const clearPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = null;
  };

  const samePackage = (subPkgId: any) => String(subPkgId?._id || subPkgId || "") === String(packageId);

  const loadMySubscriptionDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payments/my-subscription-details/${brokerId}`, {
        credentials: "include",
      });
      const json = await res.json();

      if (!res.ok || !json?.success) return null;
      return json.data as any;
    } catch {
      return null;
    }
  };

  const loadMySubscription = async () => {
    try {
      // Prefer details endpoint (has cycle info)
      const details = await loadMySubscriptionDetails();
      if (details?.razorpaySubscriptionId && details?.package?._id) {
        const status = String(details.status || "").toLowerCase();

        // cancelled should behave like "no subscription" for UI
        if (status === "cancelled" || status === "expired" || status === "completed") {
          setSub(null);
          return;
        }

        setSub({
          razorpaySubscriptionId: details.razorpaySubscriptionId,
          status,
          packageId: details.package?._id,
          currentCycleStart: details.currentCycleStart || null,
          currentCycleEnd: details.currentCycleEnd || null,
          nextCycleOn: details.nextCycleOn || null,
        });
        return;
      }

      setSub(null);
    } catch {
      setSub(null);
    }
  };

  useEffect(() => {
    if (supportsSubscription && brokerId) loadMySubscription();
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      clearPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportsSubscription, brokerId]);

  const statusLabel = useMemo(() => {
    if (!sub) return "none";
    const s = String(sub.status || "").toLowerCase();
    if (s === "active") return "active";
    if (s === "authenticated") return "active";
    if (s === "pending" || s === "created") return "pending";
    // treat everything else as none for UI
    return "none";
  }, [sub]);

  const hasActiveSubscriptionForThisPackage =
    statusLabel === "active" && sub && samePackage(sub.packageId);

  const hasPendingSubscriptionForThisPackage =
    statusLabel === "pending" && sub && samePackage(sub.packageId);

  const subscriptionBtnText =
    loadingMode === "subscription"
      ? "Opening..."
      : hasActiveSubscriptionForThisPackage
      ? "Subscription active"
      : hasPendingSubscriptionForThisPackage
      ? "Activating..."
      : "Monthly subscription (auto renew)";

  const disableSubscriptionBtn =
    loadingMode !== null || hasActiveSubscriptionForThisPackage || hasPendingSubscriptionForThisPackage;

  const startPollingUntilActive = async () => {
    clearPolling();

    // quick first fetch
    await loadMySubscription();

    pollingRef.current = setInterval(async () => {
      const details = await loadMySubscriptionDetails();
      const status = String(details?.status || "").toLowerCase();
      const pkgId = details?.package?._id;

      // cancelled should behave like none
      if (status === "cancelled" || status === "expired" || status === "completed") {
        setSub(null);
        clearPolling();
        return;
      }

      if (details?.razorpaySubscriptionId && pkgId) {
        setSub({
          razorpaySubscriptionId: details.razorpaySubscriptionId,
          status,
          packageId: pkgId,
          currentCycleStart: details.currentCycleStart || null,
          currentCycleEnd: details.currentCycleEnd || null,
          nextCycleOn: details.nextCycleOn || null,
        });

        const isThisPkg = String(pkgId) === String(packageId);
        const isActive = status === "active" || status === "authenticated";

        if (isThisPkg && isActive) {
          showToast("success", "Subscription activated", "You are all set. Auto renew is enabled.");
          clearPolling();
        }
      }
    }, 1500);
  };

  const startCheckout = async (autoRenew: boolean) => {
    if (!RZP_KEY) {
      showToast("error", "Razorpay key missing", "Add NEXT_PUBLIC_RAZORPAY_KEY_ID in frontend env.");
      return;
    }

    setLoadingMode(autoRenew ? "subscription" : "one_time");

    const ok = await loadRazorpayScript();
    if (!ok) {
      setLoadingMode(null);
      showToast("error", "Razorpay failed to load", "Please refresh and try again.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/payments/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

          // IMPORTANT: handler runs when payment succeeds, but webhook may take time
          handler: async () => {
            setLoadingMode(null); // never keep loading stuck
            showToast("success", "Payment received", "Activating your package. This may take a few seconds.");
          },

          modal: {
            ondismiss: () => {
              // user closed Razorpay modal, always reset loading
              setLoadingMode(null);
            },
          },
        });

        rzp.on("payment.failed", (resp: any) => {
          setLoadingMode(null);
          showToast("error", "Payment failed", resp?.error?.description || "Please try again.");
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
            // Do NOT show "active" immediately.
            // We show a success toast + poll until backend webhook updates status.
            setLoadingMode(null);
            showToast("info", "Payment authorized", "Waiting for confirmation. Hold on a moment.");
            await startPollingUntilActive();
          },

          modal: {
            ondismiss: () => {
              // Always clear loading even if user closes the modal
              setLoadingMode(null);

              // If user completed auth and closed quickly, polling still updates UI
              // so do not stop polling here.
            },
          },
        });

        rzp.on("payment.failed", (resp: any) => {
          setLoadingMode(null);
          showToast("error", "Subscription failed", resp?.error?.description || "Please try again.");
        });

        rzp.open();
        return;
      }

      throw new Error("Unknown checkout mode from backend");
    } catch (e: any) {
      setLoadingMode(null);
      showToast("error", "Something went wrong", e?.message || "Please try again.");
    }
  };

  const cancelSubscription = async () => {
    if (!sub?.razorpaySubscriptionId) return;

    setLoadingMode("cancel");
    try {
      const res = await fetch(`${API_URL}/api/payments/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ brokerId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Cancel failed");

      // UI requirement: after cancel, show monthly subscription button again (no cancelled label)
      setSub(null);
      showToast("success", "Subscription cancelled", "You can subscribe again anytime.");
    } catch (e: any) {
      showToast("error", "Cancel failed", e?.message || "Please try again.");
    } finally {
      setLoadingMode(null);
    }
  };

  // Hide one-time if subscription is active for THIS package
  const showOneTimeButton = !hasActiveSubscriptionForThisPackage;

  return (
    <div className="space-y-2">
      <AutoToast open={toastOpen} kind={toastKind} title={toastTitle} desc={toastDesc} />

      {showOneTimeButton && (
        <button
          type="button"
          disabled={loadingMode !== null}
          onClick={() => startCheckout(false)}
          className="w-full bg-[#004F91] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#003b6c] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loadingMode === "one_time" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Opening...</span>
            </>
          ) : (
            <span>One time: Pay ₹{amount.toLocaleString("en-IN")}</span>
          )}
        </button>
      )}

      {supportsSubscription ? (
        <>
          <button
            type="button"
            disabled={disableSubscriptionBtn}
            onClick={() => startCheckout(true)}
            className="w-full bg-white border border-[#004F91] text-[#004F91] font-semibold py-2 px-4 rounded-lg hover:bg-[#eaf3ff] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loadingMode === "subscription" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Opening...</span>
              </>
            ) : (
              <span>{subscriptionBtnText}</span>
            )}
          </button>

          {(hasActiveSubscriptionForThisPackage || hasPendingSubscriptionForThisPackage) && (
            <button
              type="button"
              disabled={loadingMode !== null}
              onClick={cancelSubscription}
              className="w-full bg-red-50 border border-red-300 text-red-700 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingMode === "cancel" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Cancel subscription</span>
              )}
            </button>
          )}

          <div className="text-xs text-gray-600 text-center">
            Auto renew is managed by Razorpay. Your status updates after webhook confirmation.
          </div>
        </>
      ) : (
        <div className="text-xs text-gray-500 text-center">Subscription not available for this package</div>
      )}
    </div>
  );
}
