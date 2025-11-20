
"use client";

import { useRouter, usePathname } from "next/navigation";
import { LayoutGrid, User, BookOpen, CreditCard, LogOut } from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { broker, logout } = useAuthContext();

  const menu = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
    { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Logout", href: "/logout", icon: LogOut, action: logout },
  ];

  return (
    <aside className="w-72 sticky top-20 left-0 h-[calc(100vh-7rem)] ml-6 my-6 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-xl rounded-2xl p-6 flex flex-col text-white">
      {/* Broker Info Card */}
      <div className="mb-6 pb-5 border-b border-white/20">
        <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center ring-2 ring-white/30">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-bold text-lg text-center text-white">
          {broker?.name || "Broker"}
        </h2>
        <p className="text-sm text-blue-50 text-center mt-1 opacity-80">
          {broker?.phoneNumber}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1  scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <ul className="space-y-1.5">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            const isLogout = item.label === "Logout";
            
            return (
              <li key={item.label}>
                <button
                  onClick={() => item.action ? item.action() : router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-lg font-semibold transform scale-105"
                      : isLogout
                      ? "hover:bg-red-500/30 text-white/90 hover:text-white"
                      : "hover:bg-white/15 text-white/90 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                  <span className="text-[15px]">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Badge */}
      <div className="mt-5 pt-4 border-t border-white/20">
        <div className="text-center">
          <p className="text-xs text-blue-50 opacity-70">Powered by</p>
          <p className="text-sm font-semibold text-white">Rentify</p>
        </div>
      </div>
    </aside>
  );
}