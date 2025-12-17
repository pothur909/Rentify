"use client";

import {
  LayoutGrid,
  BookOpen,
  CreditCard,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  RefreshCw,
  IndianRupee,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

type TxItem = {
  _id: string;
  mode: "one_time" | "subscription";
  status: string;
  amount: number;
  currency: string;
  orderId: string | null;
  paymentId: string | null;
  invoiceId: string | null;
  subscriptionId: string | null;
  package: null | {
    _id: string;
    name: string;
    key: string;
    leadsCount: number;
    price: number;
    durationLabel: string;
  };
  createdAt: string;
  paidAt: string | null;
};

type SubDetails = null | {
  _id: string;
  razorpaySubscriptionId: string;
  status: string;
  totalCount: number | null;
  remainingCount: number | null;
  subscriptionCreatedAt: string;
  currentCycleStart: string | null;
  currentCycleEnd: string | null;
  nextCycleOn: string | null;
  package: null | {
    _id: string;
    name: string;
    key: string;
    leadsCount: number;
    price: number;
    durationLabel: string;
  };
};

function fmtDate(v?: string | null) {
  if (!v) return "NA";
  const d = new Date(v);
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function fmtMoney(n?: number, currency?: string) {
  const cur = currency || "INR";
  if (typeof n !== "number") return "NA";
  return `${cur} ${n.toLocaleString("en-IN")}`;
}

export default function PaymentsPage() {
  const { broker, isAuthenticated, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";

  const [tab, setTab] = useState<"subscription" | "one_time">("subscription");
  const [loading, setLoading] = useState(true);
  const [loadingSub, setLoadingSub] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sub, setSub] = useState<SubDetails>(null);
  const [oneTimeTx, setOneTimeTx] = useState<TxItem[]>([]);
  const [subTx, setSubTx] = useState<TxItem[]>([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenu = useMemo(
    () => [
      { label: "Overview", href: "/dashboard", icon: LayoutGrid },
      { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
      { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
      { label: "Payments", href: "/dashboard/payments", icon: IndianRupee },
      { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
      { label: "Logout", href: "/logout", icon: LogOut, action: logout },
    ],
    [logout]
  );

  const loadAll = async () => {
    if (!broker?._id) return;

    setLoading(true);
    setError(null);

    try {
      const [oneTimeRes, subRes] = await Promise.all([
        fetch(`${API_BASE}/api/payments/my-transactions/${broker._id}?type=one_time`, {
          credentials: "include",
        }),
        fetch(`${API_BASE}/api/payments/my-transactions/${broker._id}?type=subscription`, {
          credentials: "include",
        }),
      ]);

      const oneTimeJson = await oneTimeRes.json();
      const subTxJson = await subRes.json();

      if (!oneTimeRes.ok || !oneTimeJson.success) {
        throw new Error(oneTimeJson.message || "Failed to load one time transactions");
      }
      if (!subRes.ok || !subTxJson.success) {
        throw new Error(subTxJson.message || "Failed to load subscription transactions");
      }

      setOneTimeTx(oneTimeJson.data || []);
      setSubTx(subTxJson.data || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptionDetails = async () => {
    if (!broker?._id) return;

    setLoadingSub(true);
    try {
      const res = await fetch(`${API_BASE}/api/payments/my-subscription-details/${broker._id}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to load subscription");
      setSub(json.data || null);
    } catch {
      setSub(null);
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !broker?._id) return;
    loadSubscriptionDetails();
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, broker?._id]);

  const refresh = async () => {
    await Promise.all([loadSubscriptionDetails(), loadAll()]);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center text-gray-600">
        Please login to view payments.
      </div>
    );
  }

  return (
    <div className="text-gray-800 w-full max-w-full overflow-x-hidden">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Hello</p>
            <p className="text-base font-semibold text-gray-900">
              {broker?.name || "Broker"}
            </p>
            <p className="text-xs text-gray-500">Payments</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl border border-gray-200 shadow-sm bg-white flex items-center gap-2"
          >
            <Menu className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Menu</span>
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Track subscription and one time payments.</p>
        </div>

        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 lg:px-0 mb-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-2 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("subscription")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
              tab === "subscription" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Subscription
          </button>
          <button
            type="button"
            onClick={() => setTab("one_time")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
              tab === "one_time" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            One time
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 lg:px-0 mb-4">
          <div className="py-3 rounded-xl bg-red-50 text-red-700 text-sm text-center border border-red-200">
            {error}
          </div>
        </div>
      )}

      {/* Subscription tab */}
      {tab === "subscription" && (
        <div className="px-4 lg:px-0 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-green-600" />
                  Subscription details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Shows your current subscription and billing cycle info.
                </p>
              </div>

              <button
                type="button"
                onClick={refresh}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {loadingSub ? (
              <div className="py-6 text-sm text-gray-500">Loading subscription...</div>
            ) : !sub ? (
              <div className="py-6 text-sm text-gray-600">
                No subscription found for this broker.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs text-gray-500">Package</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {sub.package?.name || "NA"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {sub.package ? `₹${sub.package.price.toLocaleString("en-IN")} per ${sub.package.durationLabel}` : "NA"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{sub.status}</p>
                  <p className="text-xs text-gray-500 mt-2">Subscription ID</p>
                  <p className="text-sm text-gray-700 break-all">{sub.razorpaySubscriptionId}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Current cycle start
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{fmtDate(sub.currentCycleStart)}</p>

                  <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Current cycle end
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{fmtDate(sub.currentCycleEnd)}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs text-gray-500">Next cycle on</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{fmtDate(sub.nextCycleOn)}</p>

                  <p className="text-xs text-gray-500 mt-3">Created at</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{fmtDate(sub.subscriptionCreatedAt)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-gray-900">Subscription payments</h3>
            <p className="text-sm text-gray-600 mt-1">
              Each successful recurring payment will show here when your webhook stores it.
            </p>

            {loading ? (
              <div className="py-6 text-sm text-gray-500">Loading transactions...</div>
            ) : subTx.length === 0 ? (
              <div className="py-6 text-sm text-gray-600">No subscription transactions yet.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {subTx.map((t) => (
                  <div key={t._id} className="border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {t.package?.name || "Subscription payment"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Paid at: {fmtDate(t.paidAt || t.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Invoice: {t.invoiceId || "NA"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{fmtMoney(t.amount, t.currency)}</p>
                        <p className="text-xs text-gray-500 mt-1">{t.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* One time tab */}
      {tab === "one_time" && (
        <div className="px-4 lg:px-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-gray-900">One time payments</h3>
            <p className="text-sm text-gray-600 mt-1">
              These are your direct orders.
            </p>

            {loading ? (
              <div className="py-6 text-sm text-gray-500">Loading transactions...</div>
            ) : oneTimeTx.length === 0 ? (
              <div className="py-6 text-sm text-gray-600">No one time transactions found.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {oneTimeTx.map((t) => (
                  <div key={t._id} className="border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {t.package?.name || "One time payment"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Order: {t.orderId || "NA"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Paid at: {fmtDate(t.paidAt || t.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{fmtMoney(t.amount, t.currency)}</p>
                        <p className="text-xs text-gray-500 mt-1">{t.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-blue-100">Broker</p>
                <p className="text-base font-semibold">
                  {broker?.name || "Broker"}
                </p>
                <p className="text-xs text-blue-100">{broker?.phoneNumber}</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="mt-2 mb-4 h-px bg-white/20" />

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {mobileMenu.map((item) => {
                const isActive = pathname === item.href;
                const isLogout = item.label === "Logout";

                const handleClick = () => {
                  setIsMobileMenuOpen(false);
                  if (item.action) {
                    item.action();
                    return;
                  }
                  router.push(item.href);
                };

                return (
                  <button
                    key={item.label}
                    onClick={handleClick}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-all ${
                      isActive
                        ? "bg-white text-blue-700 font-semibold"
                        : isLogout
                        ? "text-red-100 hover:bg-red-500/20"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-white"}`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-white/20 text-xs text-blue-100 text-center">
              Powered by <span className="font-semibold text-white">Rentify</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
