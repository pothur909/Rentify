// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useAuthContext } from "@/app/context/AuthContext";

// export default function Navbar() {
//   const { broker, logout, isAuthenticated } = useAuthContext();
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo */}
//           <div className="flex-shrink-0 flex items-center">
//             <Link href="/">
//               <img
//                 className="h-10 w-auto"
//                 src="/logo.png"
//                 alt="Logo"
//               />
//             </Link>
//           </div>

//           {/* Desktop Links */}
//           <div className="hidden md:flex space-x-4 items-center">
//             {isAuthenticated ? (
//               <>
//                 <Link
//                   href="/dashboard"
//                   className="text-gray-800 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Dashboard
//                 </Link>
//                 <button
//                   onClick={logout}
//                   className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Logout
//                 </button>
//                 <span className="ml-4 text-gray-600 font-medium">
//                   {broker?.name}
//                 </span>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/broker-login"
//                   className="text-gray-800 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/broker-signup"
//                   className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Signup
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Hamburger */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="text-gray-800 hover:text-blue-500 focus:outline-none"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 {menuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200">
//           <div className="px-2 pt-2 pb-3 space-y-1">
//             {isAuthenticated ? (
//               <>
//                 <Link
//                   href="/dashboard"
//                   className="block text-gray-800 hover:text-blue-500 px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Dashboard
//                 </Link>
//                 <button
//                   onClick={logout}
//                   className="block w-full text-left bg-red-500 text-white px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Logout
//                 </button>
//                 <span className="block text-gray-600 px-3 py-2">
//                   {broker?.name}
//                 </span>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/broker-login"
//                   className="block text-gray-800 hover:text-blue-500 px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/broker-signup"
//                   className="block bg-blue-500 text-white px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   Signup
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { broker, logout, isAuthenticated } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-6 my-2 mb-8">
        <div className="py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 backdrop-blur-xl shadow-2xl rounded-2xl border border-blue-400/20">
          <div className="max-w-full mx-auto px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-start">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <img
                      className="h-12 w-auto rounded-xl"
                      src="/logo.jpg"
                      alt="Logo"
                    />
                  </div>
                  {/* <span className="font-bold text-xl text-white">
                    Rentify
                  </span> */}
                </Link>
              </div>

              {/* Desktop Links */}
              <div className="hidden md:flex space-x-2 items-center">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-white/90 hover:text-white hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          {broker?.name}
                        </p>
                        <p className="text-xs text-blue-100">
                          {broker?.phoneNumber}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white/30">
                        {broker?.name?.charAt(0).toUpperCase() || "B"}
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 ml-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                                      <Link
                      href="/enquiry-form"
                      className="text-white/90 hover:text-white hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      Enquiry Form
                    </Link>
                    <Link
                      href="/broker-login"
                      className="text-white/90 hover:text-white hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/broker-signup"
                      className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Hamburger */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-white hover:bg-white/20 focus:outline-none p-2 rounded-xl transition-all duration-200"
                >
                  {menuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-white/20">
              <div className="px-6 pt-4 pb-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 pb-4 mb-3 border-b border-white/20">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white/30">
                        {broker?.name?.charAt(0).toUpperCase() || "B"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {broker?.name}
                        </p>
                        <p className="text-xs text-blue-100">
                          {broker?.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block text-white/90 hover:text-white hover:bg-white/20 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left bg-red-500/90 hover:bg-red-600 text-white px-4 py-3 rounded-xl text-base font-medium shadow-lg transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/enquiry-form"
                      className="block bg-white text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-semibold shadow-lg text-center transition-all duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Enquiry Form
                    </Link>
                    <Link
                      href="/broker-login"
                      className="block text-white/90 hover:text-white hover:bg-white/20 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/broker-signup"
                      className="block bg-white text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl text-base font-semibold shadow-lg text-center transition-all duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}