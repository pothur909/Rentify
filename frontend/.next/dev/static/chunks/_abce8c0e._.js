(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/broker-login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client";
// import { useState, useEffect } from "react";
// import { useAuthContext } from "../context/AuthContext";
// import { useRouter } from "next/navigation";
// export default function BrokerLogin() {
//   const { login, isAuthenticated } = useAuthContext();
//   const router = useRouter();
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState<"phone" | "otp">("phone");
//   const [timer, setTimer] = useState(0);
//   const [canResend, setCanResend] = useState(true);
//   const [message, setMessage] = useState("");
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
//   // Redirect if already logged in
//   useEffect(() => {
//     if (isAuthenticated) {
//       router.replace("/dashboard"); // redirect to dashboard
//     }
//   }, [isAuthenticated, router]);
//   // Countdown timer
//   useEffect(() => {
//     if (timer <= 0) return;
//     const interval = setInterval(() => setTimer(t => t - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timer]);
//   useEffect(() => {
//     setCanResend(timer <= 0);
//   }, [timer]);
//   // Send OTP
//   const sendOtp = async () => {
//     if (!phoneNumber) return;
//     if (!/^\+91\d{10}$/.test(phoneNumber)) {
//       setMessage("Phone number must be +91 followed by 10 digits");
//       return;
//     }
//     try {
//       const res = await fetch(`${baseUrl}/api/brokers/login/request-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phoneNumber }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setStep("otp");
//         setTimer(30);
//         setMessage("OTP sent to your phone");
//       } else setMessage(data.message);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to send OTP");
//     }
//   };
//   // Verify OTP
//   const verifyOtp = async () => {
//     try {
//       const res = await fetch(`${baseUrl}/api/brokers/login/verify`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phoneNumber, otp }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         login("demo-token", data.data); // login in context
//         router.replace("/dashboard"); // redirect to dashboard after login
//       } else setMessage(data.message);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to verify OTP");
//     }
//   };
//   // Change phone number
//   const changePhoneNumber = () => {
//     setStep("phone");
//     setOtp("");
//     setMessage("");
//     setTimer(0);
//   };
//   return (
//     <div className="p-8 max-w-md mx-auto text-black bg-white rounded">
//       {step === "phone" ? (
//         <>
//           <h2 className="text-2xl font-bold mb-4">Broker Login</h2>
//           <input
//             placeholder="Phone +91..."
//             value={phoneNumber}
//             onChange={e => setPhoneNumber(e.target.value)}
//             className="border p-2 w-full mb-2"
//           />
//           <button
//             onClick={sendOtp}
//             className="bg-blue-500 text-white p-2 w-full"
//           >
//             Send OTP
//           </button>
//         </>
//       ) : (
//         <>
//           <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
//           <input
//             placeholder="OTP"
//             value={otp}
//             onChange={e => setOtp(e.target.value)}
//             className="border p-2 w-full mb-2"
//           />
//           <button
//             onClick={verifyOtp}
//             className="bg-green-500 text-white p-2 w-full mb-2"
//           >
//             Verify OTP & Login
//           </button>
//           <button
//             onClick={changePhoneNumber}
//             className="bg-gray-300 p-2 w-full mb-2"
//           >
//             Change Phone Number
//           </button>
//           <button
//             onClick={sendOtp}
//             className={`p-2 w-full ${canResend ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
//             disabled={!canResend}
//           >
//             {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
//           </button>
//         </>
//       )}
//       {message && <p className="mt-2 text-red-500">{message}</p>}
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>BrokerLogin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function BrokerLogin() {
    _s();
    const { login, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [phoneNumber, setPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("phone");
    const [timer, setTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [canResend, setCanResend] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
    // Redirect if already logged in
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerLogin.useEffect": ()=>{
            if (isAuthenticated) router.push("/dashboard");
        }
    }["BrokerLogin.useEffect"], [
        isAuthenticated,
        router
    ]);
    // Countdown timer
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerLogin.useEffect": ()=>{
            if (timer <= 0) return;
            const interval = setInterval({
                "BrokerLogin.useEffect.interval": ()=>setTimer({
                        "BrokerLogin.useEffect.interval": (t)=>t - 1
                    }["BrokerLogin.useEffect.interval"])
            }["BrokerLogin.useEffect.interval"], 1000);
            return ({
                "BrokerLogin.useEffect": ()=>clearInterval(interval)
            })["BrokerLogin.useEffect"];
        }
    }["BrokerLogin.useEffect"], [
        timer
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerLogin.useEffect": ()=>{
            setCanResend(timer <= 0);
        }
    }["BrokerLogin.useEffect"], [
        timer
    ]);
    // Send OTP
    const sendOtp = async ()=>{
        if (!phoneNumber) return;
        try {
            const res = await fetch(`${baseUrl}/api/brokers/login/request-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phoneNumber
                })
            });
            const data = await res.json();
            if (res.ok) {
                setStep("otp");
                setTimer(30);
                setMessage("OTP sent to your phone");
            } else setMessage(data.message);
        } catch (err) {
            console.error(err);
            setMessage("Failed to send OTP");
        }
    };
    // Verify OTP
    const verifyOtp = async ()=>{
        try {
            const res = await fetch(`${baseUrl}/api/brokers/login/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phoneNumber,
                    otp
                })
            });
            const data = await res.json();
            if (res.ok) {
                login(data.token, data.broker); // Save token and broker to context/localStorage
                router.push("/dashboard"); // Redirect to dashboard immediately
            }
            setMessage(data.message);
        } catch (err) {
            console.error(err);
            setMessage("Failed to verify OTP");
        }
    };
    const changePhoneNumber = ()=>{
        setStep("phone");
        setOtp("");
        setMessage("");
        setTimer(0);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 max-w-md mx-auto text-black bg-white rounded",
        children: [
            step === "phone" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-4",
                        children: "Broker Login"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-login/page.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "Phone +91...",
                        value: phoneNumber,
                        onChange: (e)=>setPhoneNumber(e.target.value),
                        className: "border p-2 w-full mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-login/page.tsx",
                        lineNumber: 235,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: sendOtp,
                        className: "bg-blue-500 text-white p-2 w-full",
                        children: "Send OTP"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-login/page.tsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-4",
                        children: "Enter OTP"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-login/page.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "OTP",
                        value: otp,
                        onChange: (e)=>setOtp(e.target.value),
                        className: "border p-2 w-full mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-login/page.tsx",
                        lineNumber: 248,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: verifyOtp,
                        className: "bg-green-500 text-white p-2 w-full mb-2",
                        children: "Verify OTP & Login"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-login/page.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: changePhoneNumber,
                        className: "bg-gray-300 p-2 w-full mb-2",
                        children: "Change Phone Number"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-login/page.tsx",
                        lineNumber: 261,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: sendOtp,
                        className: `p-2 w-full ${canResend ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`,
                        disabled: !canResend,
                        children: canResend ? "Resend OTP" : `Resend OTP in ${timer}s`
                    }, void 0, false, {
                        fileName: "[project]/app/broker-login/page.tsx",
                        lineNumber: 265,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-red-500",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/broker-login/page.tsx",
                lineNumber: 276,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/broker-login/page.tsx",
        lineNumber: 231,
        columnNumber: 5
    }, this);
}
_s(BrokerLogin, "c5qajwBYBF/4auHW81l8CM3YWf0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BrokerLogin;
var _c;
__turbopack_context__.k.register(_c, "BrokerLogin");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_abce8c0e._.js.map