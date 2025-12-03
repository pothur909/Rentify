

// // OverviewPage.tsx
// import { TrendingUp, Users, CheckCircle, Package } from "lucide-react";

// export default function OverviewPage() {
//   const stats = {
//     totalLeads: 30,
//     contactedLeads: 20,
//     convertedLeads: 10,
//     totalPackages: 5,
//   };

//   const cards = [
//     {
//       title: "Total Leads",
//       value: stats.totalLeads,
//       icon: Users,
//       gradient: "from-blue-500 to-blue-600",
//       bg: "bg-blue-50",
//       iconBg: "bg-blue-500",
//       change: "+12%",
//       changeType: "increase"
//     },
//     {
//       title: "Contacted Leads",
//       value: stats.contactedLeads,
//       icon: TrendingUp,
//       gradient: "from-purple-500 to-purple-600",
//       bg: "bg-purple-50",
//       iconBg: "bg-purple-500",
//       change: "+8%",
//       changeType: "increase"
//     },
//     {
//       title: "Converted Leads",
//       value: stats.convertedLeads,
//       icon: CheckCircle,
//       gradient: "from-green-500 to-green-600",
//       bg: "bg-green-50",
//       iconBg: "bg-green-500",
//       change: "+15%",
//       changeType: "increase"
//     },
//     {
//       title: "Total Packages",
//       value: stats.totalPackages,
//       icon: Package,
//       gradient: "from-orange-500 to-orange-600",
//       bg: "bg-orange-50",
//       iconBg: "bg-orange-500",
//       change: "+3",
//       changeType: "increase"
//     },
//   ];

//   return (
//     <div className="text-gray-800">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
//         <p className="text-gray-600">Welcome back! Here's what's happening with your leads today.</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {cards.map((card) => (
//           <div
//             key={card.title}
//             className={`${card.bg} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className={`p-3 rounded-xl ${card.iconBg} shadow-lg`}>
//                 <card.icon className="w-6 h-6 text-white" />
//               </div>
//               <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                 card.changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//               }`}>
//                 {card.change}
//               </span>
//             </div>
//             <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
//             <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
//               {card.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Recent Activity Section */}
//       <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Quick Stats */}
//         <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//               <span className="text-gray-600">Conversion Rate</span>
//               <span className="font-semibold text-green-600">33.3%</span>
//             </div>
//             <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//               <span className="text-gray-600">Response Rate</span>
//               <span className="font-semibold text-blue-600">66.7%</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Active Packages</span>
//               <span className="font-semibold text-purple-600">{stats.totalPackages}</span>
//             </div>
//           </div>
//         </div>

//         {/* Performance */}
//         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-md text-white">
//           <h2 className="text-xl font-bold mb-4">Performance</h2>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-sm text-indigo-100">Lead Goal</span>
//                 <span className="text-sm font-semibold">75%</span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-2">
//                 <div className="bg-white h-2 rounded-full" style={{ width: "75%" }}></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-sm text-indigo-100">Conversion Goal</span>
//                 <span className="text-sm font-semibold">50%</span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-2">
//                 <div className="bg-white h-2 rounded-full" style={{ width: "50%" }}></div>
//               </div>
//             </div>
//             <p className="text-sm text-indigo-100 mt-4">
//               You're doing great! Keep up the momentum.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import {
  TrendingUp,
  Users,
  CheckCircle,
  Package,
  Menu,
  X,
  LayoutGrid,
  BookOpen,
  CreditCard,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";


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

  useEffect(() => {
    if (!broker?._id) return;

    const loadStats = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/brokers/${broker._id}/dashboard-stats`
        );
        const json = await res.json();
        if (!res.ok) {
          console.error(json);
          return;
        }
        const d = json.data;
setStats({
      totalLeads: d.package.leadLimit,          // package leadsCount
      contactedLeads: d.leads.contacted,       // contacted leads from DB
      upcomingLeads: d.package.remainingCapacity, // remaining capacity
      closedLeads: d.leads.closed,
      totalPackages: d.package.totalPurchased, // paid transactions count
    });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    loadStats();
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
    },
    // {
    //   title: "Upcoming  Leads",
    //   value: stats.upcomingLeads,
    //   icon: CheckCircle,
    //   gradient: "from-green-500 to-green-600",
    //   bg: "bg-green-50",
    //   iconBg: "bg-green-500",
    //   change: "+15%",
    //   changeType: "increase",
    // },
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: Package,
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      iconBg: "bg-orange-500",
      change: "+3",
      changeType: "increase",
    },
  ];

  const mobileMenu = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
    { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
    { label: "Logout", href: "/logout", icon: LogOut, action: logout },
  ];

  if (!isAuthenticated || !broker) {
    return (
      <div className="p-6 text-gray-700">
        Please login as broker to view dashboard.
      </div>
    );
  }

  return (
    <div className="text-gray-800">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 mb-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Hello</p>
            <p className="text-base font-semibold text-gray-900">
              {broker.name || "Broker"}
            </p>
            <p className="text-xs text-gray-500">
              Dashboard overview
            </p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your leads today.
        </p>
      </div>

      {/* Mobile heading */}
      <div className="mb-4 lg:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-600">
          Quick snapshot of your performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} rounded-2xl p-4 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
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
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {card.title}
            </h3>
            <p
              className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm lg:text-base">
                Conversion Rate
              </span>
              <span className="font-semibold text-green-600 text-sm lg:text-base">
                33.3%
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm lg:text-base">
                Response Rate
              </span>
              <span className="font-semibold text-blue-600 text-sm lg:text-base">
                66.7%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm lg:text-base">
                Active Packages
              </span>
              <span className="font-semibold text-purple-600 text-sm lg:text-base">
                {stats.totalPackages}
              </span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 lg:p-6 shadow-md text-white">
          <h2 className="text-lg lg:text-xl font-bold mb-4">
            Performance
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs lg:text-sm text-indigo-100">
                  Lead Goal
                </span>
                <span className="text-xs lg:text-sm font-semibold">
                  75%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs lg:text-sm text-indigo-100">
                  Conversion Goal
                </span>
                <span className="text-xs lg:text-sm font-semibold">
                  50%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: "50%" }}
                />
              </div>
            </div>
            <p className="text-xs lg:text-sm text-indigo-100 mt-4">
              You're doing great. Keep up the momentum.
            </p>
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
                <p className="text-base font-semibold">
                  {broker.name || "Broker"}
                </p>
                <p className="text-xs text-blue-100">
                  {broker.phoneNumber}
                </p>
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
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-700" : "text-white"
                      }`}
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
