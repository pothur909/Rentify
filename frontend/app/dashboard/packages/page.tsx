
// "use client";

// import {
//   Package,
//   CheckCircle,
//   Users,
//   Clock,
//   Star,
//   Zap,
//   Crown,
//   TrendingUp,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import RazorpayPackageButton from "../../components/RazorpayPackageButton";
// import { useAuthContext } from "../../context/AuthContext";

// // match your backend model
// type LeadPackageApi = {
//   _id: string;
//   key: string;
//   name: string;
//   leadsCount: number;
//   price: number;
//   currency: string;
//   durationLabel: string;
//   features: string[];
//   gradientClass: string;
//   bgClass: string;
//   iconBgClass: string;
//   iconKey: string;
//   popular: boolean;
//   sortOrder: number;
//   isActive: boolean;
// };

// type LeadPackageUI = {
//   id: string;
//   key: string;
//   name: string;
//   leads: number;
//   price: number;
//   duration: string;
//   icon: typeof Package;
//   gradient: string;
//   bg: string;
//   iconBg: string;
//   features: string[];
//   popular: boolean;
// };

// // map iconKey from backend to actual icon component
// const iconMap: Record<string, typeof Package> = {
//   package: Package,
//   zap: Zap,
//   crown: Crown,
//   "trending-up": TrendingUp,
// };

// export default function PackagesPage() {
//   const { broker, isAuthenticated } = useAuthContext();

//   const [packages, setPackages] = useState<LeadPackageUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // if you use a separate API domain, swap this to NEXT_PUBLIC_API_BASE_URL
//   const API_BASE =
//     process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000"; // "" means same origin

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API_BASE}/api/lead-packages`, {
//           credentials: "include",
//         });

//         if (!res.ok) {
//           throw new Error(`Failed to fetch packages: ${res.status}`);
//         }

//         const json = await res.json();

//         if (!json.success || !Array.isArray(json.data)) {
//           throw new Error("Unexpected response shape from /api/lead-packages");
//         }

//         const mapped: LeadPackageUI[] = json.data
//           .filter((p: LeadPackageApi) => p.isActive)
//           .sort(
//             (a: LeadPackageApi, b: LeadPackageApi) =>
//               (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
//           )
//           .map((p: LeadPackageApi) => {
//             const IconComp =
//               iconMap[p.iconKey] || iconMap[p.key] || Package;

//             return {
//               id: p._id,
//               key: p.key,
//               name: p.name,
//               leads: p.leadsCount,
//               price: p.price,
//               duration: p.durationLabel,
//               icon: IconComp,
//               gradient:
//                 p.gradientClass || "from-gray-700 to-gray-900",
//               bg: p.bgClass || "bg-gray-50",
//               iconBg: p.iconBgClass || "bg-gray-700",
//               features: p.features || [],
//               popular: !!p.popular,
//             };
//           });

//         setPackages(mapped);
//       } catch (err: any) {
//         console.error("Error fetching lead packages", err);
//         setError(err?.message || "Failed to load packages");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPackages();
//   }, [API_BASE]);

//   const stats = [
//     {
//       label: "Active Packages",
//       value: packages.length.toString(),
//       icon: Package,
//       color: "text-blue-600",
//       bg: "bg-blue-100",
//     },
//     {
//       label: "Total Leads Purchased",
//       // placeholder: you can later replace with real backend value
//       value: "90",
//       icon: Users,
//       color: "text-purple-600",
//       bg: "bg-purple-100",
//     },
//     {
//       label: "Leads Remaining",
//       // placeholder as well
//       value: "45",
//       icon: TrendingUp,
//       color: "text-green-600",
//       bg: "bg-green-100",
//     },
//   ];

//   return (
//     <div className="text-gray-800">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           Lead Packages
//         </h1>
//         <p className="text-gray-600">
//           Choose the perfect package to grow your real estate business.
//         </p>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {stats.map((stat) => (
//           <div
//             key={stat.label}
//             className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-4 rounded-xl ${stat.bg}`}>
//                 <stat.icon className={`w-6 h-6 ${stat.color}`} />
//               </div>
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">
//                   {stat.label}
//                 </p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {stat.value}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Loading / Error states */}
//       {loading && (
//         <div className="py-10 text-center text-gray-500">
//           Loading packages...
//         </div>
//       )}

//       {error && !loading && (
//         <div className="py-4 mb-6 rounded-lg bg-red-50 text-red-700 text-sm text-center border border-red-200">
//           {error}
//         </div>
//       )}

//       {/* Packages Grid */}
//       {!loading && !error && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {packages.map((pkg) => (
//             <div
//               key={pkg.id}
//               className={`relative rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${
//                 pkg.popular
//                   ? "border-purple-300 ring-2 ring-purple-200"
//                   : "border-gray-100"
//               }`}
//               style={{ backgroundColor: "white" }}
//             >
//               {/* Popular Badge */}
//               {pkg.popular && (
//                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                   <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
//                     <Star className="w-3 h-3 fill-current" />
//                     POPULAR
//                   </span>
//                 </div>
//               )}

//               {/* Package Icon */}
//               <div
//                 className={`${pkg.bg} w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto`}
//               >
//                 <div className={`p-3 rounded-lg ${pkg.iconBg} shadow-lg`}>
//                   <pkg.icon className="w-6 h-6 text-white" />
//                 </div>
//               </div>

//               {/* Package Name */}
//               <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
//                 {pkg.name}
//               </h3>

//               {/* Price */}
//               <div className="text-center mb-4">
//                 <p
//                   className={`text-4xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}
//                 >
//                   ₹{pkg.price.toLocaleString("en-IN")}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
//                   <Clock className="w-4 h-4" />
//                   Valid for {pkg.duration}
//                 </p>
//               </div>

//               {/* Leads Count Badge */}
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 text-center border border-gray-200">
//                 <div className="flex items-center justify-center gap-2 mb-1">
//                   <Users className="w-5 h-5 text-gray-600" />
//                   <span className="text-2xl font-bold text-gray-900">
//                     {pkg.leads}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-600 font-medium">
//                   Verified Leads
//                 </p>
//               </div>

//               {/* Features List */}
//               <ul className="space-y-3 mb-6">
//                 {pkg.features.map((feature, index) => (
//                   <li
//                     key={index}
//                     className="flex items-start gap-2 text-sm text-gray-700"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
//                     <span>{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               {/* CTA Button -> Razorpay */}
//               {isAuthenticated && broker ? (
//                 <RazorpayPackageButton
//                   brokerId={broker._id}
//                   packageKey={pkg.key}
//                   packageName={pkg.name}
//                   amount={pkg.price}
//                 />
//               ) : (
//                 <button
//                   type="button"
//                   className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg"
//                   onClick={() => {
//                     alert("Please log in as broker to purchase a package.");
//                   }}
//                 >
//                   Login to purchase
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Contact Section */}
//       <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-md text-white">
//         <div className="text-center max-w-2xl mx-auto">
//           <h2 className="text-2xl font-bold mb-2">Need a Custom Package?</h2>
//           <p className="text-indigo-100 mb-6">
//             Looking for something specific? We can create a tailored package
//             that fits your exact requirements.
//           </p>
//           <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
//             Contact Sales Team
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import {
  Package,
  CheckCircle,
  Users,
  Clock,
  Star,
  Zap,
  Crown,
  TrendingUp,
  Menu,
  X,
  LayoutGrid,
  User as UserIcon,
  BookOpen,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import RazorpayPackageButton from "../../components/RazorpayPackageButton";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

// match your backend model
type LeadPackageApi = {
  _id: string;
  key: string;
  name: string;
  leadsCount: number;
  price: number;
  currency: string;
  durationLabel: string;
  features: string[];
  gradientClass: string;
  bgClass: string;
  iconBgClass: string;
  iconKey: string;
  popular: boolean;
  sortOrder: number;
  isActive: boolean;
};

type LeadPackageUI = {
  id: string;
  key: string;
  name: string;
  leads: number;
  price: number;
  duration: string;
  icon: typeof Package;
  gradient: string;
  bg: string;
  iconBg: string;
  features: string[];
  popular: boolean;
};

// map iconKey from backend to actual icon component
const iconMap: Record<string, typeof Package> = {
  package: Package,
  zap: Zap,
  crown: Crown,
  "trending-up": TrendingUp,
};

export default function PackagesPage() {
  const { broker, isAuthenticated, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const [packages, setPackages] = useState<LeadPackageUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/lead-packages`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch packages: ${res.status}`);
        }

        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error("Unexpected response shape from /api/lead-packages");
        }

        const mapped: LeadPackageUI[] = json.data
          .filter((p: LeadPackageApi) => p.isActive)
          .sort(
            (a: LeadPackageApi, b: LeadPackageApi) =>
              (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
          )
          .map((p: LeadPackageApi) => {
            const IconComp =
              iconMap[p.iconKey] || iconMap[p.key] || Package;

            return {
              id: p._id,
              key: p.key,
              name: p.name,
              leads: p.leadsCount,
              price: p.price,
              duration: p.durationLabel,
              icon: IconComp,
              gradient: p.gradientClass || "from-gray-700 to-gray-900",
              bg: p.bgClass || "bg-gray-50",
              iconBg: p.iconBgClass || "bg-gray-700",
              features: p.features || [],
              popular: !!p.popular,
            };
          });

        setPackages(mapped);
      } catch (err: any) {
        console.error("Error fetching lead packages", err);
        setError(err?.message || "Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [API_BASE]);

  const stats = [
    {
      label: "Active Packages",
      value: packages.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Leads Purchased",
      value: "90",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Leads Remaining",
      value: "45",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  const mobileMenu = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
    { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
    { label: "Logout", href: "/logout", icon: LogOut, action: logout },
  ];

  return (
    <div className="text-gray-800 w-full max-w-full overflow-x-hidden">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 mb-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Hello</p>
            <p className="text-base font-semibold text-gray-900">
              {broker?.name || "Broker"}
            </p>
            <p className="text-xs text-gray-500">
              Lead packages
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
          Lead Packages
        </h1>
        <p className="text-gray-600">
          Choose the perfect package to grow your real estate business.
        </p>
      </div>

      {/* Mobile heading under header */}
      <div className="mb-4 lg:hidden px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Lead Packages
        </h1>
        <p className="text-sm text-gray-600">
          Choose a package and start getting leads.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 px-4 lg:px-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 lg:p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-600 text-xs lg:text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading / Error states */}
      {loading && (
        <div className="py-10 text-center text-gray-500 px-4 lg:px-0">
          Loading packages...
        </div>
      )}

      {error && !loading && (
        <div className="py-4 mb-6 rounded-lg bg-red-50 text-red-700 text-sm text-center border border-red-200 px-4 lg:px-0">
          {error}
        </div>
      )}

      {/* Packages Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 px-4 lg:px-0">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${
                pkg.popular
                  ? "border-purple-300 ring-2 ring-purple-200"
                  : "border-gray-100"
              }`}
              style={{ backgroundColor: "white" }}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    POPULAR
                  </span>
                </div>
              )}

              {/* Package Icon */}
              <div
                className={`${pkg.bg} w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto`}
              >
                <div className={`p-3 rounded-lg ${pkg.iconBg} shadow-lg`}>
                  <pkg.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Package Name */}
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 text-center mb-2">
                {pkg.name}
              </h3>

              {/* Price */}
              <div className="text-center mb-4">
                <p
                  className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}
                >
                  ₹{pkg.price.toLocaleString("en-IN")}
                </p>
                <p className="text-xs lg:text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Valid for {pkg.duration}
                </p>
              </div>

              {/* Leads Count Badge */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 lg:p-4 mb-4 text-center border border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                  <span className="text-xl lg:text-2xl font-bold text-gray-900">
                    {pkg.leads}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Verified Leads
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 lg:space-y-3 mb-5 lg:mb-6">
                {pkg.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs lg:text-sm text-gray-700"
                  >
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button -> Razorpay */}
              {isAuthenticated && broker ? (
                <RazorpayPackageButton
                  brokerId={broker._id}
                  packageKey={pkg.key}
                  packageName={pkg.name}
                  amount={pkg.price}
                />
              ) : (
                <button
                  type="button"
                  className="w-full bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg text-sm"
                  onClick={() => {
                    alert("Please log in as broker to purchase a package.");
                  }}
                >
                  Login to purchase
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Section */}
      <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 lg:p-8 shadow-md text-white mx-4 lg:mx-0">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">
            Need a Custom Package?
          </h2>
          <p className="text-xs lg:text-sm text-indigo-100 mb-6">
            Looking for something specific? We can create a tailored package
            that fits your exact requirements.
          </p>
          <button className="bg-white text-purple-600 px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm lg:text-base">
            Contact Sales Team
          </button>
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
                  {broker?.name || "Broker"}
                </p>
                <p className="text-xs text-blue-100">
                  {broker?.phoneNumber}
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
                        : "text-white/90 hover:bg:white/10"
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
