


// "use client";

// import {
//   TrendingUp,
//   Users,
//   CheckCircle,
//   Package,
//   Menu,
//   X,
//   LayoutGrid,
//   BookOpen,
//   CreditCard,
//   User as UserIcon,
//   LogOut,
//   HistoryIcon,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useAuthContext } from "@/app/context/AuthContext";
// import { useRouter, usePathname } from "next/navigation";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";


// export default function OverviewPage() {
//   const { broker, isAuthenticated, logout } = useAuthContext();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const [stats, setStats] = useState({
//     totalLeads: 0,
//     contactedLeads: 0,
//     upcomingLeads: 0,
//     closedLeads: 0,
//     totalPackages: 0,
//   });

//   useEffect(() => {
//     if (!broker?._id) return;

//     const loadStats = async () => {
//       try {
//         const res = await fetch(
//           `${baseUrl}/api/brokers/${broker._id}/dashboard-stats`
//         );
//         const json = await res.json();
//         if (!res.ok) {
//           console.error(json);
//           return;
//         }
//         const d = json.data;
// setStats({
//       totalLeads: d.package.leadLimit,          // package leadsCount
//       contactedLeads: d.leads.contacted,       // contacted leads from DB
//       upcomingLeads: d.package.remainingCapacity, // remaining capacity
//       closedLeads: d.leads.closed,
//       totalPackages: d.package.totalPurchased, // paid transactions count
//     });
//       } catch (err) {
//         console.error("Failed to fetch dashboard stats", err);
//       }
//     };

//     loadStats();
//   }, [broker?._id]);

//   // const cards = [
//   //   {
//   //     title: "Total Leads",
//   //     value: stats.totalLeads,
//   //     icon: Users,
//   //     gradient: "from-blue-500 to-blue-600",
//   //     bg: "bg-blue-50",
//   //     iconBg: "bg-blue-500",
//   //     change: "+12%",
//   //     changeType: "increase",
//   //   },
//   //   {
//   //     title: "Contacted Leads",
//   //     value: stats.contactedLeads,
//   //     icon: TrendingUp,
//   //     gradient: "from-purple-500 to-purple-600",
//   //     bg: "bg-purple-50",
//   //     iconBg: "bg-purple-500",
//   //     change: "+8%",
//   //     changeType: "increase",
//   //   },
//   //   // {
//   //   //   title: "Upcoming  Leads",
//   //   //   value: stats.upcomingLeads,
//   //   //   icon: CheckCircle,
//   //   //   gradient: "from-green-500 to-green-600",
//   //   //   bg: "bg-green-50",
//   //   //   iconBg: "bg-green-500",
//   //   //   change: "+15%",
//   //   //   changeType: "increase",
//   //   // },
//   //   {
//   //     title: "Total Packages",
//   //     value: stats.totalPackages,
//   //     icon: Package,
//   //     gradient: "from-orange-500 to-orange-600",
//   //     bg: "bg-orange-50",
//   //     iconBg: "bg-orange-500",
//   //     change: "+3",
//   //     changeType: "increase",
//   //   },
//   // ];


//    const cards = [
//   {
//     title: "Total Leads",
//     value: stats.totalLeads,
//     icon: Users,
//     gradient: "from-blue-500 to-blue-600",
//     bg: "bg-blue-50",
//     iconBg: "bg-blue-500",
//     change: "+12%",
//     changeType: "increase",
//     href: "/dashboard/leads",
//   },
//   {
//     title: "Contacted Leads",
//     value: stats.contactedLeads,
//     icon: TrendingUp,
//     gradient: "from-purple-500 to-purple-600",
//     bg: "bg-purple-50",
//     iconBg: "bg-purple-500",
//     change: "+8%",
//     changeType: "increase",
//     href: "/dashboard/leads",
//   },
//   {
//     title: "Total Packages",
//     value: stats.totalPackages,
//     icon: Package,
//     gradient: "from-orange-500 to-orange-600",
//     bg: "bg-orange-50",
//     iconBg: "bg-orange-500",
//     change: "+3",
//     changeType: "increase",
//     href: "/dashboard/packages",
//   },
// ];


//   const mobileMenu = [
//     { label: "Overview", href: "/dashboard", icon: LayoutGrid },
//     { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
//     { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
//     { label: "Transactions", href: "/dashboard/transactions", icon: HistoryIcon },
//     { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
//     { label: "Logout", href: "/logout", icon: LogOut, action: logout },
//   ];

//   if (!isAuthenticated || !broker) {
//     return (
//       <div className="p-6 text-gray-700">
//         Please login as broker to view dashboard.
//       </div>
//     );
//   }

//   return (
//     <div className="text-gray-800">
//       {/* Mobile header */}
//       <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 mb-4">
//         <div className="flex items-center justify-between px-4 py-3">
//           <div>
//             <p className="text-xs text-gray-500">Hello</p>
//             <p className="text-base font-semibold text-gray-900">
//               {broker.name || "Broker"}
//             </p>
//             <p className="text-xs text-gray-500">
//               Dashboard overview
//             </p>
//           </div>
//           <button
//             onClick={() => setIsMobileMenuOpen(true)}
//             className="p-2 rounded-xl border border-gray-200 shadow-sm bg-white flex items-center gap-2"
//           >
//             <Menu className="w-5 h-5 text-gray-700" />
//             <span className="text-sm font-medium text-gray-700">Menu</span>
//           </button>
//         </div>
//       </div>

//       {/* Desktop header */}
//       <div className="mb-8 hidden lg:block">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           Dashboard Overview
//         </h1>
//         <p className="text-gray-600">
//           Welcome back! Here's what's happening with your leads today.
//         </p>
//       </div>

//       {/* Mobile heading */}
//       <div className="mb-4 lg:hidden">
//         <h1 className="text-2xl font-bold text-gray-900 mb-1">
//           Dashboard Overview
//         </h1>
//         <p className="text-sm text-gray-600">
//           Quick snapshot of your performance.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
//         {cards.map((card) => (
//           <div
//             key={card.title}
//             onClick={() => router.push(card.href)}
//             className={`${card.bg} rounded-2xl p-4 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className={`p-3 rounded-xl ${card.iconBg} shadow-lg`}>
//                 <card.icon className="w-6 h-6 text-white" />
//               </div>
//               <span
//                 className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                   card.changeType === "increase"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//               >
//                 {card.change}
//               </span>
//             </div>
//             <h3 className="text-gray-600 text-sm font-medium mb-1">
//               {card.title}
//             </h3>
//             <p
//               className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
//             >
//               {card.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Recent Activity Section */}
//       {/* <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Quick Stats 
//         <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100">
//           <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">
//             Quick Stats
//           </h2>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//               <span className="text-gray-600 text-sm lg:text-base">
//                 Conversion Rate
//               </span>
//               <span className="font-semibold text-green-600 text-sm lg:text-base">
//                 33.3%
//               </span>
//             </div>
//             <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//               <span className="text-gray-600 text-sm lg:text-base">
//                 Response Rate
//               </span>
//               <span className="font-semibold text-blue-600 text-sm lg:text-base">
//                 66.7%
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600 text-sm lg:text-base">
//                 Active Packages
//               </span>
//               <span className="font-semibold text-purple-600 text-sm lg:text-base">
//                 {stats.totalPackages}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Performance *
//         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 lg:p-6 shadow-md text-white">
//           <h2 className="text-lg lg:text-xl font-bold mb-4">
//             Performance
//           </h2>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-xs lg:text-sm text-indigo-100">
//                   Lead Goal
//                 </span>
//                 <span className="text-xs lg:text-sm font-semibold">
//                   75%
//                 </span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-2">
//                 <div
//                   className="bg-white h-2 rounded-full"
//                   style={{ width: "75%" }}
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-xs lg:text-sm text-indigo-100">
//                   Conversion Goal
//                 </span>
//                 <span className="text-xs lg:text-sm font-semibold">
//                   50%
//                 </span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-2">
//                 <div
//                   className="bg-white h-2 rounded-full"
//                   style={{ width: "50%" }}
//                 />
//               </div>
//             </div>
//             <p className="text-xs lg:text-sm text-indigo-100 mt-4">
//               You're doing great. Keep up the momentum.
//             </p>
//           </div>
//         </div>
//       </div> */}

//       {/* Mobile slide in menu */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
//           <div className="absolute top-0 right-0 h-full w-72 bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl p-5 flex flex-col">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <p className="text-xs text-blue-100">Broker</p>
//                 <p className="text-base font-semibold">
//                   {broker.name || "Broker"}
//                 </p>
//                 <p className="text-xs text-blue-100">
//                   {broker.phoneNumber}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 rounded-full hover:bg-white/10"
//               >
//                 <X className="w-5 h-5 text-white" />
//               </button>
//             </div>

//             <div className="mt-2 mb-4 h-px bg-white/20" />

//             <nav className="flex-1 space-y-1 overflow-y-auto">
//               {mobileMenu.map((item) => {
//                 const isActive = pathname === item.href;
//                 const isLogout = item.label === "Logout";

//                 const handleClick = () => {
//                   setIsMobileMenuOpen(false);
//                   if (item.action) {
//                     item.action();
//                     return;
//                   }
//                   router.push(item.href);
//                 };

//                 return (
//                   <button
//                     key={item.label}
//                     onClick={handleClick}
//                     className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-all ${
//                       isActive
//                         ? "bg-white text-blue-700 font-semibold"
//                         : isLogout
//                         ? "text-red-100 hover:bg-red-500/20"
//                         : "text-white/90 hover:bg-white/10"
//                     }`}
//                   >
//                     <item.icon
//                       className={`w-5 h-5 ${
//                         isActive ? "text-blue-700" : "text-white"
//                       }`}
//                     />
//                     <span>{item.label}</span>
//                   </button>
//                 );
//               })}
//             </nav>

//             <div className="mt-4 pt-3 border-t border-white/20 text-xs text-blue-100 text-center">
//               Powered by <span className="font-semibold text-white">Rentify</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import {
  TrendingUp,
  Users,
  Package,
  Menu,
  X,
  LayoutGrid,
  BookOpen,
  CreditCard,
  User as UserIcon,
  LogOut,
  HistoryIcon,
  CalendarDays,
  BadgeCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";

type SubscriptionDetails = {
  razorpaySubscriptionId: string;
  status: string;
  subscriptionCreatedAt?: string | null;
  currentCycleStart?: string | null;
  currentCycleEnd?: string | null;
  nextCycleOn?: string | null;
  package?: {
    _id: string;
    name: string;
    key: string;
    leadsCount: number;
    price: number;
    durationLabel: string;
  } | null;
} | null;

type LatestOneTime = {
  status: string;
  paidAt?: string | null;
  createdAt?: string | null;
  amount?: number;
  currency?: string;
  package?: {
    _id: string;
    name: string;
    key: string;
    leadsCount: number;
    price: number;
    durationLabel: string;
  } | null;
} | null;

function formatDate(d?: string | null) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function normalizeSubStatus(status?: string) {
  const s = String(status || "").toLowerCase();
  if (["cancelled", "expired", "completed"].includes(s)) return "none";
  if (["active", "authenticated"].includes(s)) return "active";
  if (["created", "pending"].includes(s)) return "pending";
  return "none";
}

export default function OverviewPage() {
  const { broker, isAuthenticated, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    totalLeads: 0,
    contactedLeads: 0,
    upcomingLeads: 0,
    closedLeads: 0,
    totalPackages: 0,
  });

  const [subDetails, setSubDetails] = useState<SubscriptionDetails>(null);
  const [latestOneTime, setLatestOneTime] = useState<LatestOneTime>(null);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    if (!broker?._id) return;

    const loadStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/brokers/${broker._id}/dashboard-stats`, {
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok) {
          console.error(json);
          return;
        }
        const d = json.data;

        setStats({
          totalLeads: d.package.leadLimit,
          contactedLeads: d.leads.contacted,
          upcomingLeads: d.package.remainingCapacity,
          closedLeads: d.leads.closed,
          totalPackages: d.package.totalPurchased,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    loadStats();
  }, [broker?._id]);

  // Load subscription details (and latest one-time fallback)
  useEffect(() => {
    if (!broker?._id) return;

    const loadPaymentSummary = async () => {
      setPlanLoading(true);
      try {
        // 1) subscription details
        const subRes = await fetch(
          `${baseUrl}/api/payments/my-subscription-details/${broker._id}`,
          { credentials: "include" }
        );
        const subJson = await subRes.json().catch(() => ({}));

        if (subRes.ok && subJson?.success) {
          const data = subJson.data as SubscriptionDetails;
          const subState = normalizeSubStatus(data?.status);

          if (subState === "active" || subState === "pending") {
            setSubDetails(data);
            setLatestOneTime(null);
            return;
          }
          setSubDetails(null);
        } else {
          setSubDetails(null);
        }

        // 2) one-time fallback endpoint (optional)
        const oneRes = await fetch(
          `${baseUrl}/api/payments/latest-one-time/${broker._id}`,
          { credentials: "include" }
        );

        if (!oneRes.ok) {
          setLatestOneTime(null);
          return;
        }

        const oneJson = await oneRes.json().catch(() => ({}));
        if (oneJson?.success) setLatestOneTime(oneJson.data || null);
        else setLatestOneTime(null);
      } catch (e) {
        setSubDetails(null);
        setLatestOneTime(null);
      } finally {
        setPlanLoading(false);
      }
    };

    loadPaymentSummary();
  }, [broker?._id]);

  const cards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
      change: "+12%",
      changeType: "increase",
      href: "/dashboard/leads",
    },
    {
      title: "Contacted Leads",
      value: stats.contactedLeads,
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-500",
      change: "+8%",
      changeType: "increase",
      href: "/dashboard/leads",
    },
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: Package,
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      iconBg: "bg-orange-500",
      change: "+3",
      changeType: "increase",
      href: "/dashboard/packages",
    },
  ];

  const mobileMenu = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
    { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
    { label: "Transactions", href: "/dashboard/transactions", icon: HistoryIcon },
    { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
    { label: "Logout", href: "/logout", icon: LogOut, action: logout },
  ];

  const planCard = useMemo(() => {
    const subState = normalizeSubStatus(subDetails?.status);

    if (subState === "active" || subState === "pending") {
      const pkg = subDetails?.package;
      return {
        mode: "subscription" as const,
        title: pkg?.name || "Monthly Subscription",
        status: subState === "active" ? "Active" : "Activating",
        leads: pkg?.leadsCount ?? "-",
        start: formatDate(subDetails?.currentCycleStart || subDetails?.subscriptionCreatedAt),
        end: formatDate(subDetails?.currentCycleEnd),
        next: formatDate(subDetails?.nextCycleOn),
      };
    }

    if (latestOneTime?.package) {
      const pkg = latestOneTime.package;
      const paidOn = latestOneTime.paidAt || latestOneTime.createdAt;

      return {
        mode: "one_time" as const,
        title: pkg.name || "One time package",
        status: String(latestOneTime.status || "paid").toUpperCase(),
        leads: pkg.leadsCount ?? "-",
        paidOn: formatDate(paidOn || null),
        duration: pkg.durationLabel || "-",
      };
    }

    return null;
  }, [subDetails, latestOneTime]);

  if (!isAuthenticated || !broker) {
    return <div className="p-6 text-gray-700">Please login as broker to view dashboard.</div>;
  }

  return (
    <div className="text-gray-800">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 mb-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Hello</p>
            <p className="text-base font-semibold text-gray-900">{broker.name || "Broker"}</p>
            <p className="text-xs text-gray-500">Dashboard overview</p>
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
      <div className="mb-8 hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your leads today.</p>
      </div>

      {/* Mobile heading */}
      <div className="mb-4 lg:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-sm text-gray-600">Quick snapshot of your performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => router.push(card.href)}
            className={`${card.bg} cursor-pointer rounded-2xl p-4 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.iconBg} shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  card.changeType === "increase"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {card.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p
              className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Current Plan Card BELOW */}
      <div className="mt-6 lg:mt-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-100 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-600 shadow-lg">
                <BadgeCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-base lg:text-lg font-bold text-gray-900">Current Plan</p>
                <p className="text-xs lg:text-sm text-gray-500">
                  Subscription info or latest one time package
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard/packages")}
              className="text-sm font-semibold text-indigo-700 hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 lg:p-6">
            {planLoading ? (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
                Loading your plan...
              </div>
            ) : !planCard ? (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900">No active plan found</p>
                <p className="text-xs text-gray-600 mt-1">
                  Buy a package to start receiving leads.
                </p>
              </div>
            ) : planCard.mode === "subscription" ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-bold text-gray-900 truncate">
                        {planCard.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Leads per cycle:{" "}
                        <span className="font-semibold text-gray-900">{planCard.leads}</span>
                      </p>
                    </div>

                    <span
                      className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                        planCard.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {planCard.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Start date
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-900">{planCard.start}</div>
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      End date
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-900">{planCard.end}</div>
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Next auto renew
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-900">{planCard.next}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm lg:text-base font-bold text-gray-900 truncate">
                        {planCard.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Leads purchased:{" "}
                        <span className="font-semibold text-gray-900">{planCard.leads}</span>
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      {planCard.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Paid on
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-900">{planCard.paidOn}</div>
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Validity
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-900">{planCard.duration}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile slide in menu */}
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
                <p className="text-base font-semibold">{broker.name || "Broker"}</p>
                <p className="text-xs text-blue-100">{broker.phoneNumber}</p>
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
                    <item.icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-white"}`} />
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
