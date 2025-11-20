(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/broker-signup/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client";
// import { useState } from "react";
// import { useAuthContext } from "../context/AuthContext";
// export default function Signup() {
//   const [name, setName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState<"signup" | "verify">("signup");
//   const { login } = useAuthContext();
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
//   const handleSignup = async () => {
//     const res = await fetch(`${baseUrl}/api/brokers/signup`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, phoneNumber }),
//     });
//     const data = await res.json();
//     if (res.ok) setStep("verify");
//     else alert(data.message);
//   };
//   const handleVerifyOtp = async () => {
//     const res = await fetch(`${baseUrl}/api/brokers/verifyOtp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ phoneNumber, otp }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       // Save token in context
//       login("demo-token", { _id: "demo", name, phoneNumber }); // replace with real token & broker from API
//     } else alert(data.message);
//   };
//   return (
//     <div className="p-8 max-w-md mx-auto">
//       {step === "signup" ? (
//         <>
//           <h2 className="text-2xl font-bold mb-4">Broker Signup</h2>
//           <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-2"/>
//           <input placeholder="Phone +91..." value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="border p-2 w-full mb-2"/>
//           <button onClick={handleSignup} className="bg-blue-500 text-white p-2 w-full">Send OTP</button>
//         </>
//       ) : (
//         <>
//           <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
//           <input placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} className="border p-2 w-full mb-2"/>
//           <button onClick={handleVerifyOtp} className="bg-green-500 text-white p-2 w-full">Verify & Login</button>
//         </>
//       )}
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>BrokerSignup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function BrokerSignup() {
    _s();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("phone");
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [phoneNumber, setPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [serviceAreas, setServiceAreas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [availableFlatTypes, setAvailableFlatTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [timer, setTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [canResend, setCanResend] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
    // Countdown timer for resend
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerSignup.useEffect": ()=>{
            if (timer <= 0) return;
            const interval = setInterval({
                "BrokerSignup.useEffect.interval": ()=>setTimer({
                        "BrokerSignup.useEffect.interval": (t)=>t - 1
                    }["BrokerSignup.useEffect.interval"])
            }["BrokerSignup.useEffect.interval"], 1000);
            return ({
                "BrokerSignup.useEffect": ()=>clearInterval(interval)
            })["BrokerSignup.useEffect"];
        }
    }["BrokerSignup.useEffect"], [
        timer
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerSignup.useEffect": ()=>{
            setCanResend(timer <= 0);
        }
    }["BrokerSignup.useEffect"], [
        timer
    ]);
    // Send OTP for signup
    const sendOtp = async ()=>{
        if (!name || !phoneNumber) return setMessage("Name and phone number required");
        try {
            const res = await fetch(`${baseUrl}/signup/request-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    phoneNumber,
                    serviceAreas,
                    availableFlatTypes,
                    address
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
    // Verify OTP and create broker
    const verifyOtp = async ()=>{
        try {
            const res = await fetch(`${baseUrl}/signup/verify`, {
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
                setMessage("Signup successful! You can now login.");
                setTimeout(()=>router.push("/login"), 1500);
            } else setMessage(data.message);
        } catch (err) {
            console.error(err);
            setMessage("Failed to verify OTP");
        }
    };
    // Change phone/number input
    const changePhoneNumber = ()=>{
        setStep("phone");
        setOtp("");
        setMessage("");
        setTimer(0);
    };
    // Handle comma-separated input for arrays
    const handleServiceAreasChange = (e)=>{
        setServiceAreas(e.target.value.split(",").map((s)=>s.trim()));
    };
    const handleFlatTypesChange = (e)=>{
        setAvailableFlatTypes(e.target.value.split(",").map((s)=>s.trim()));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 max-w-md mx-auto text-black bg-background",
        children: [
            step === "phone" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-4",
                        children: "Broker Signup"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "Name",
                        value: name,
                        onChange: (e)=>setName(e.target.value),
                        className: "border p-2 w-full mb-2 text-black bg-background"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 157,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "Phone +91...",
                        value: phoneNumber,
                        onChange: (e)=>setPhoneNumber(e.target.value),
                        className: "border p-2 w-full mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "Service Areas (comma separated)",
                        value: serviceAreas.join(", "),
                        onChange: handleServiceAreasChange,
                        className: "border p-2 w-full mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "Available Flat Types (comma separated)",
                        value: availableFlatTypes.join(", "),
                        onChange: handleFlatTypesChange,
                        className: "border p-2 w-full mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "Address",
                        value: address,
                        onChange: (e)=>setAddress(e.target.value),
                        className: "border p-2 w-full mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: sendOtp,
                        className: "bg-blue-500 text-white p-2 w-full",
                        children: "Send OTP"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 187,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-4",
                        children: "Enter OTP"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "OTP",
                        value: otp,
                        onChange: (e)=>setOtp(e.target.value),
                        className: "border p-2 w-full mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 197,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: verifyOtp,
                        className: "bg-green-500 text-white p-2 w-full mb-2",
                        children: "Verify & Signup"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: changePhoneNumber,
                        className: "bg-gray-300 p-2 w-full mb-2",
                        children: "Change Info"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: sendOtp,
                        className: `p-2 w-full ${canResend ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`,
                        disabled: !canResend,
                        children: canResend ? "Resend OTP" : `Resend OTP in ${timer}s`
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-red-500",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/broker-signup/page.tsx",
                lineNumber: 228,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/broker-signup/page.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
_s(BrokerSignup, "5EJBkkqdobG+OrsuJyJ+7WTE0/Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BrokerSignup;
var _c;
__turbopack_context__.k.register(_c, "BrokerSignup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_ffa37235._.js.map