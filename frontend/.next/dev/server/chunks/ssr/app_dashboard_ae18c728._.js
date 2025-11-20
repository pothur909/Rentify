module.exports = [
"[project]/app/dashboard/components/Sidebar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

// // "use client";
// // import React from "react";
// // import { useRouter, usePathname } from "next/navigation";
// // import { LayoutGrid, User, BookOpen, CreditCard, LogOut } from "lucide-react";
// // import { useAuthContext } from "@/app/context/AuthContext";
// // export default function Sidebar() {
// //   const router = useRouter();
// //   const pathname = usePathname();
// //   const { broker, logout } = useAuthContext();
// //   const menu = [
// //     { label: "Overview", href: "/dashboard", icon: LayoutGrid },
// //     { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
// //     { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
// //     { label: "Profile", href: "/dashboard/profile", icon: User },
// //     { label: "Logout", href: "/logout", icon: LogOut, action: logout },
// //   ];
// //   return (
// //     <aside className="w-64 h-screen fixed top-0 left-0 bg-white shadow-md p-4 flex flex-col text-black">
// //       <div className="mb-8 text-center">
// //         <h2 className="font-bold text-xl">{broker?.name || "Broker"}</h2>
// //         <p className="text-sm text-gray-500">{broker?.phoneNumber}</p>
// //       </div>
// //       <nav className="flex-1">
// //         <ul className="space-y-2">
// //           {menu.map((item) => {
// //             const isActive = pathname === item.href;
// //             return (
// //               <li key={item.label}>
// //                 <button
// //                   onClick={() => item.action ? item.action() : router.push(item.href)}
// //                   className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 transition ${
// //                     isActive ? "bg-blue-100 font-semibold" : ""
// //                   }`}
// //                 >
// //                   <item.icon className="w-5 h-5" />
// //                   {item.label}
// //                 </button>
// //               </li>
// //             );
// //           })}
// //         </ul>
// //       </nav>
// //     </aside>
// //   );
// // }
// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { LayoutGrid, User, BookOpen, CreditCard, LogOut } from "lucide-react";
// import { useAuthContext } from "@/app/context/AuthContext";
// export default function Sidebar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { broker, logout } = useAuthContext();
//   const menu = [
//     { label: "Overview", href: "/dashboard", icon: LayoutGrid },
//     { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
//     { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
//     { label: "Profile", href: "/dashboard/profile", icon: User },
//     { label: "Logout", href: "/logout", icon: LogOut, action: logout },
//   ];
//   return (
//     <aside className="w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-md p-4 flex flex-col text-black">
//       {/* top-16 pushes sidebar below navbar (h-16) */}
//       <div className="mb-8 text-center">
//         <h2 className="font-bold text-xl">{broker?.name || "Broker"}</h2>
//         <p className="text-sm text-gray-500">{broker?.phoneNumber}</p>
//       </div>
//       <nav className="flex-1 overflow-y-auto">
//         <ul className="space-y-2">
//           {menu.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <li key={item.label}>
//                 <button
//                   onClick={() => item.action ? item.action() : router.push(item.href)}
//                   className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100 transition ${
//                     isActive ? "bg-blue-100 font-semibold" : ""
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   {item.label}
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>
//     </aside>
//   );
// }
}),
"[project]/app/dashboard/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/components/Sidebar.tsx [app-rsc] (ecmascript)");
;
;
function DashboardLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/dashboard/layout.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "ml-64 flex-1 p-8 bg-gray-50 min-h-screen",
                children: children
            }, void 0, false, {
                fileName: "[project]/app/dashboard/layout.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/layout.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_dashboard_ae18c728._.js.map