module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/broker-signup/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // "use client";
// // import { useState } from "react";
// // import { useAuthContext } from "../context/AuthContext";
// // export default function Signup() {
// //   const [name, setName] = useState("");
// //   const [phoneNumber, setPhoneNumber] = useState("");
// //   const [otp, setOtp] = useState("");
// //   const [step, setStep] = useState<"signup" | "verify">("signup");
// //   const { login } = useAuthContext();
// //   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
// //   const handleSignup = async () => {
// //     const res = await fetch(`${baseUrl}/api/brokers/signup`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ name, phoneNumber }),
// //     });
// //     const data = await res.json();
// //     if (res.ok) setStep("verify");
// //     else alert(data.message);
// //   };
// //   const handleVerifyOtp = async () => {
// //     const res = await fetch(`${baseUrl}/api/brokers/verifyOtp`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ phoneNumber, otp }),
// //     });
// //     const data = await res.json();
// //     if (res.ok) {
// //       // Save token in context
// //       login("demo-token", { _id: "demo", name, phoneNumber }); // replace with real token & broker from API
// //     } else alert(data.message);
// //   };
// //   return (
// //     <div className="p-8 max-w-md mx-auto">
// //       {step === "signup" ? (
// //         <>
// //           <h2 className="text-2xl font-bold mb-4">Broker Signup</h2>
// //           <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-2"/>
// //           <input placeholder="Phone +91..." value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="border p-2 w-full mb-2"/>
// //           <button onClick={handleSignup} className="bg-blue-500 text-white p-2 w-full">Send OTP</button>
// //         </>
// //       ) : (
// //         <>
// //           <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
// //           <input placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} className="border p-2 w-full mb-2"/>
// //           <button onClick={handleVerifyOtp} className="bg-green-500 text-white p-2 w-full">Verify & Login</button>
// //         </>
// //       )}
// //     </div>
// //   );
// // }
// "use client";
// import { useState } from "react";
// export default function BrokerSignup() {
//   const [name, setName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState(""); // only 10 digits entered by user
//   const [serviceAreas, setServiceAreas] = useState<string[]>([""]);
//   const [availableFlatTypes, setAvailableFlatTypes] = useState<string[]>([""]);
//   const [address, setAddress] = useState("");
//   const [message, setMessage] = useState("");
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // Phone validation
//     const phone = phoneNumber.replace(/\D/g, ""); // remove non-digits
//     if (phone.length !== 10) {
//       setMessage("Phone number must be exactly 10 digits");
//       return;
//     }
//     const payload = {
//       name,
//       phoneNumber: "+91" + phone, // keep +91 fixed
//       serviceAreas: serviceAreas.filter(s => s.trim() !== ""),
//       availableFlatTypes: availableFlatTypes.filter(f => f.trim() !== ""),
//       address,
//     };
//     try {
//       const res = await fetch(`${baseUrl}/api/brokers/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage("Broker signed up successfully!");
//         setName("");
//         setPhoneNumber("");
//         setServiceAreas([""]);
//         setAvailableFlatTypes([""]);
//         setAddress("");
//       } else {
//         setMessage(data.message || "Signup failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Server error. Please try again.");
//     }
//   };
//   const handleServiceAreaChange = (index: number, value: string) => {
//     const updated = [...serviceAreas];
//     updated[index] = value;
//     setServiceAreas(updated);
//   };
//   const handleFlatTypeChange = (index: number, value: string) => {
//     const updated = [...availableFlatTypes];
//     updated[index] = value;
//     setAvailableFlatTypes(updated);
//   };
//   const addServiceArea = () => setServiceAreas([...serviceAreas, ""]);
//   const addFlatType = () => setAvailableFlatTypes([...availableFlatTypes, ""]);
//   return (
//     <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg text-black bg-background">
//       <h2 className="text-2xl font-bold mb-4">Broker Signup</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           placeholder="Name"
//           value={name}
//           onChange={e => setName(e.target.value)}
//           className="border p-2 w-full"
//           required
//         />
//         <div className="flex">
//           <span className="bg-gray-200 border p-2">+91</span>
//           <input
//             placeholder="Phone number (10 digits)"
//             value={phoneNumber}
//             onChange={e => setPhoneNumber(e.target.value)}
//             className="border p-2 w-full"
//             required
//             maxLength={10}
//           />
//         </div>
//         <div>
//           <label className="block mb-1 font-semibold">Service Areas</label>
//           {serviceAreas.map((area, i) => (
//             <input
//               key={i}
//               value={area}
//               onChange={e => handleServiceAreaChange(i, e.target.value)}
//               className="border p-2 w-full mb-1"
//               placeholder={`Service Area ${i + 1}`}
//             />
//           ))}
//           <button type="button" onClick={addServiceArea} className="text-blue-500 mt-1">
//             + Add Service Area
//           </button>
//         </div>
//         <div>
//           <label className="block mb-1 font-semibold">Available Flat Types</label>
//           {availableFlatTypes.map((flat, i) => (
//             <input
//               key={i}
//               value={flat}
//               onChange={e => handleFlatTypeChange(i, e.target.value)}
//               className="border p-2 w-full mb-1"
//               placeholder={`Flat Type ${i + 1}`}
//             />
//           ))}
//           <button type="button" onClick={addFlatType} className="text-blue-500 mt-1">
//             + Add Flat Type
//           </button>
//         </div>
//         <textarea
//           placeholder="Address"
//           value={address}
//           onChange={e => setAddress(e.target.value)}
//           className="border p-2 w-full"
//           rows={3}
//         />
//         <button type="submit" className="bg-green-500 text-white p-2 w-full">
//           Signup
//         </button>
//       </form>
//       {message && <p className="mt-2 text-red-500">{message}</p>}
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>BrokerAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/context/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key.js [app-ssr] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
"use client";
;
;
;
;
;
;
function BrokerAuth() {
    const { login, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Auth mode: 'login' or 'signup'
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("login");
    // Login states
    const [phoneNumber, setPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("phone");
    const [timer, setTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [canResend, setCanResend] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Signup states
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [signupPhone, setSignupPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [serviceAreas, setServiceAreas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        ""
    ]);
    const [availableFlatTypes, setAvailableFlatTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        ""
    ]);
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
    // Redirect if authenticated
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isAuthenticated) router.push("/dashboard");
    }, [
        isAuthenticated,
        router
    ]);
    // Timer for OTP
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (timer <= 0) return;
        const interval = setInterval(()=>setTimer((t)=>t - 1), 1000);
        return ()=>clearInterval(interval);
    }, [
        timer
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setCanResend(timer <= 0);
    }, [
        timer
    ]);
    // Login: Send OTP
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
    // Login: Verify OTP
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
                login(data.token, data.broker);
                router.push("/dashboard");
            } else setMessage(data.message);
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
    // Signup: Submit
    const handleSignup = async ()=>{
        const phone = signupPhone.replace(/\D/g, "");
        if (phone.length !== 10) {
            setMessage("Phone number must be exactly 10 digits");
            return;
        }
        const payload = {
            name,
            phoneNumber: "+91" + phone,
            serviceAreas: serviceAreas.filter((s)=>s.trim() !== ""),
            availableFlatTypes: availableFlatTypes.filter((f)=>f.trim() !== ""),
            address
        };
        try {
            const res = await fetch(`${baseUrl}/api/brokers/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Broker signed up successfully! Please login.");
                setTimeout(()=>{
                    setMode("login");
                    setMessage("");
                }, 2000);
            } else {
                setMessage(data.message || "Signup failed");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error. Please try again.");
        }
    };
    const handleServiceAreaChange = (index, value)=>{
        const updated = [
            ...serviceAreas
        ];
        updated[index] = value;
        setServiceAreas(updated);
    };
    const handleFlatTypeChange = (index, value)=>{
        const updated = [
            ...availableFlatTypes
        ];
        updated[index] = value;
        setAvailableFlatTypes(updated);
    };
    const addServiceArea = ()=>setServiceAreas([
            ...serviceAreas,
            ""
        ]);
    const addFlatType = ()=>setAvailableFlatTypes([
            ...availableFlatTypes,
            ""
        ]);
    // Animated background elements
    const FloatingElement = ({ delay = 0, duration = 3 })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute rounded-full bg-white/10 backdrop-blur-sm",
            style: {
                width: `${Math.random() * 150 + 50}px`,
                height: `${Math.random() * 150 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${duration}s ease-in-out ${delay}s infinite`
            }
        }, void 0, false, {
            fileName: "[project]/app/broker-signup/page.tsx",
            lineNumber: 357,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-d287df2d81f590a0" + " " + "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 pt-32",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "d287df2d81f590a0",
                children: "@keyframes float{0%,to{transform:translateY(0)translate(0)}25%{transform:translateY(-20px)translate(10px)}50%{transform:translateY(-10px)translate(-10px)}75%{transform:translateY(-30px)translate(5px)}}@keyframes slideInLeft{0%{opacity:0;transform:translate(-100%)}to{opacity:1;transform:translate(0)}}@keyframes slideInRight{0%{opacity:0;transform:translate(100%)}to{opacity:1;transform:translate(0)}}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-d287df2d81f590a0" + " " + "w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-d287df2d81f590a0" + " " + "grid md:grid-cols-2 min-h-[600px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                animation: mode === "signup" ? "slideInRight 0.7s ease-out" : "slideInLeft 0.7s ease-out"
                            },
                            className: "jsx-d287df2d81f590a0" + " " + `relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-12 flex flex-col justify-center items-center text-white overflow-hidden transition-all duration-700 ${mode === "signup" ? "order-2" : "order-1"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                                    delay: 0,
                                    duration: 4,
                                    className: "jsx-d287df2d81f590a0"
                                }, void 0, false, {
                                    fileName: "[project]/app/broker-signup/page.tsx",
                                    lineNumber: 399,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                                    delay: 1,
                                    duration: 5,
                                    className: "jsx-d287df2d81f590a0"
                                }, void 0, false, {
                                    fileName: "[project]/app/broker-signup/page.tsx",
                                    lineNumber: 400,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                                    delay: 2,
                                    duration: 3.5,
                                    className: "jsx-d287df2d81f590a0"
                                }, void 0, false, {
                                    fileName: "[project]/app/broker-signup/page.tsx",
                                    lineNumber: 401,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                                    delay: 0.5,
                                    duration: 4.5,
                                    className: "jsx-d287df2d81f590a0"
                                }, void 0, false, {
                                    fileName: "[project]/app/broker-signup/page.tsx",
                                    lineNumber: 402,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-d287df2d81f590a0" + " " + "relative z-10 text-center",
                                    children: mode === "login" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                className: "w-24 h-24 mx-auto mb-6 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 407,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-d287df2d81f590a0" + " " + "text-4xl font-bold mb-4",
                                                children: "Welcome Back!"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 408,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-d287df2d81f590a0" + " " + "text-blue-100 mb-8 text-lg",
                                                children: "Access your broker dashboard and manage your properties with ease"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0" + " " + "space-y-4 text-left max-w-sm mx-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                                className: "w-6 h-6 mt-1 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 414,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-d287df2d81f590a0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "font-semibold",
                                                                        children: "Manage Properties"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 416,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "text-sm text-blue-100",
                                                                        children: "List and track all your properties"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 417,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 413,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                                className: "w-6 h-6 mt-1 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 421,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-d287df2d81f590a0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "font-semibold",
                                                                        children: "Connect with Clients"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 423,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "text-sm text-blue-100",
                                                                        children: "Respond to inquiries instantly"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 424,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 422,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                className: "w-6 h-6 mt-1 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 428,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-d287df2d81f590a0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "font-semibold",
                                                                        children: "Grow Your Business"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 430,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "text-sm text-blue-100",
                                                                        children: "Reach more potential renters"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 431,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 429,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 412,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "w-24 h-24 mx-auto mb-6 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 438,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-d287df2d81f590a0" + " " + "text-4xl font-bold mb-4",
                                                children: "Join Our Platform"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 439,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-d287df2d81f590a0" + " " + "text-blue-100 mb-8 text-lg",
                                                children: "Start your journey as a broker and expand your reach"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 440,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0" + " " + "space-y-4 text-left max-w-sm mx-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                                className: "w-6 h-6 mt-1 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 445,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-d287df2d81f590a0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "font-semibold",
                                                                        children: "Free Registration"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 447,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "text-sm text-blue-100",
                                                                        children: "No hidden fees or charges"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 448,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 446,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                className: "w-6 h-6 mt-1 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 452,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-d287df2d81f590a0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "font-semibold",
                                                                        children: "Multiple Service Areas"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 454,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "text-sm text-blue-100",
                                                                        children: "Cover your entire territory"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 455,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 453,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 451,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                                className: "w-6 h-6 mt-1 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-d287df2d81f590a0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "font-semibold",
                                                                        children: "Diverse Property Types"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 461,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-d287df2d81f590a0" + " " + "text-sm text-blue-100",
                                                                        children: "List all types of properties"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                                        lineNumber: 462,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 460,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 458,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 443,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/app/broker-signup/page.tsx",
                                    lineNumber: 404,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/broker-signup/page.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-d287df2d81f590a0" + " " + `p-12 flex flex-col justify-center transition-all duration-700 ${mode === "signup" ? "order-1" : "order-2"}`,
                            children: mode === "login" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-d287df2d81f590a0" + " " + "max-w-md mx-auto w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-d287df2d81f590a0" + " " + "text-3xl font-bold text-gray-800 mb-2",
                                        children: "Broker Login"
                                    }, void 0, false, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 479,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-d287df2d81f590a0" + " " + "text-gray-600 mb-8",
                                        children: "Enter your credentials to access your account"
                                    }, void 0, false, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 480,
                                        columnNumber: 17
                                    }, this),
                                    step === "phone" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d287df2d81f590a0" + " " + "space-y-4 text-black ",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Phone Number"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 489,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "tel",
                                                                placeholder: "+91 XXXXX XXXXX",
                                                                value: phoneNumber,
                                                                onChange: (e)=>setPhoneNumber(e.target.value),
                                                                className: "jsx-d287df2d81f590a0" + " " + "w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 490,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 484,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: sendOtp,
                                                className: "jsx-d287df2d81f590a0" + " " + "w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl",
                                                children: "Send OTP"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 499,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 483,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d287df2d81f590a0" + " " + "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Enter OTP"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 509,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Enter 6-digit OTP",
                                                        value: otp,
                                                        onChange: (e)=>setOtp(e.target.value),
                                                        maxLength: 6,
                                                        className: "jsx-d287df2d81f590a0" + " " + "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center text-2xl tracking-widest"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 512,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 508,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: verifyOtp,
                                                className: "jsx-d287df2d81f590a0" + " " + "w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl",
                                                children: "Verify & Login"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 521,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: changePhoneNumber,
                                                className: "jsx-d287df2d81f590a0" + " " + "w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all",
                                                children: "Change Phone Number"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 527,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: sendOtp,
                                                disabled: !canResend,
                                                className: "jsx-d287df2d81f590a0" + " " + `w-full py-3 rounded-xl font-semibold transition-all ${canResend ? "bg-blue-100 text-blue-600 hover:bg-blue-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`,
                                                children: canResend ? "Resend OTP" : `Resend in ${timer}s`
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 533,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 507,
                                        columnNumber: 19
                                    }, this),
                                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d287df2d81f590a0" + " " + "mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm",
                                        children: message
                                    }, void 0, false, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 548,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d287df2d81f590a0" + " " + "mt-8 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-d287df2d81f590a0" + " " + "text-gray-600",
                                            children: [
                                                "Don't have an account?",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setMode("signup");
                                                        setMessage("");
                                                        setStep("phone");
                                                    },
                                                    className: "jsx-d287df2d81f590a0" + " " + "text-blue-600 font-semibold hover:text-blue-700 transition-colors",
                                                    children: "Sign Up"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/broker-signup/page.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/broker-signup/page.tsx",
                                            lineNumber: 554,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 553,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/broker-signup/page.tsx",
                                lineNumber: 478,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-d287df2d81f590a0" + " " + "max-w-md mx-auto w-full overflow-y-auto max-h-[600px] pr-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-d287df2d81f590a0" + " " + "text-3xl font-bold text-gray-800 mb-2",
                                        children: "Broker Signup"
                                    }, void 0, false, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 571,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-d287df2d81f590a0" + " " + "text-gray-600 mb-6",
                                        children: "Create your account and start listing properties"
                                    }, void 0, false, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 572,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d287df2d81f590a0" + " " + "space-y-4 text-black ",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 576,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Your full name",
                                                        value: name,
                                                        onChange: (e)=>setName(e.target.value),
                                                        required: true,
                                                        className: "jsx-d287df2d81f590a0" + " " + "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 577,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 575,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Phone Number"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "flex",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-d287df2d81f590a0" + " " + "inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium",
                                                                children: "+91"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 592,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "tel",
                                                                placeholder: "10 digit number",
                                                                value: signupPhone,
                                                                onChange: (e)=>setSignupPhone(e.target.value),
                                                                maxLength: 10,
                                                                required: true,
                                                                className: "jsx-d287df2d81f590a0" + " " + "flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                                lineNumber: 595,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 587,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Service Areas"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 608,
                                                        columnNumber: 21
                                                    }, this),
                                                    serviceAreas.map((area, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            value: area,
                                                            onChange: (e)=>handleServiceAreaChange(i, e.target.value),
                                                            placeholder: `Area ${i + 1} (e.g., Andheri, Bandra)`,
                                                            className: "jsx-d287df2d81f590a0" + " " + "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-2"
                                                        }, i, false, {
                                                            fileName: "[project]/app/broker-signup/page.tsx",
                                                            lineNumber: 612,
                                                            columnNumber: 23
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: addServiceArea,
                                                        className: "jsx-d287df2d81f590a0" + " " + "text-blue-600 text-sm font-semibold hover:text-blue-700",
                                                        children: "+ Add Another Area"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 620,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 607,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Available Flat Types"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 630,
                                                        columnNumber: 21
                                                    }, this),
                                                    availableFlatTypes.map((flat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            value: flat,
                                                            onChange: (e)=>handleFlatTypeChange(i, e.target.value),
                                                            placeholder: `Type ${i + 1} (e.g., 1BHK, 2BHK)`,
                                                            className: "jsx-d287df2d81f590a0" + " " + "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-2"
                                                        }, i, false, {
                                                            fileName: "[project]/app/broker-signup/page.tsx",
                                                            lineNumber: 634,
                                                            columnNumber: 23
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: addFlatType,
                                                        className: "jsx-d287df2d81f590a0" + " " + "text-blue-600 text-sm font-semibold hover:text-blue-700",
                                                        children: "+ Add Another Type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 642,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 629,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-d287df2d81f590a0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-d287df2d81f590a0" + " " + "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Office Address"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 652,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        placeholder: "Your office address",
                                                        value: address,
                                                        onChange: (e)=>setAddress(e.target.value),
                                                        rows: 3,
                                                        className: "jsx-d287df2d81f590a0" + " " + "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/broker-signup/page.tsx",
                                                        lineNumber: 655,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 651,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleSignup,
                                                className: "jsx-d287df2d81f590a0" + " " + "w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl",
                                                children: "Create Account"
                                            }, void 0, false, {
                                                fileName: "[project]/app/broker-signup/page.tsx",
                                                lineNumber: 664,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 574,
                                        columnNumber: 17
                                    }, this),
                                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d287df2d81f590a0" + " " + `mt-4 p-3 border rounded-xl text-sm ${message.includes("success") ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"}`,
                                        children: message
                                    }, void 0, false, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 673,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d287df2d81f590a0" + " " + "mt-6 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-d287df2d81f590a0" + " " + "text-gray-600",
                                            children: [
                                                "Already have an account?",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setMode("login");
                                                        setMessage("");
                                                    },
                                                    className: "jsx-d287df2d81f590a0" + " " + "text-blue-600 font-semibold hover:text-blue-700 transition-colors",
                                                    children: "Login"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/broker-signup/page.tsx",
                                                    lineNumber: 685,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/broker-signup/page.tsx",
                                            lineNumber: 683,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/broker-signup/page.tsx",
                                        lineNumber: 682,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/broker-signup/page.tsx",
                                lineNumber: 570,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/broker-signup/page.tsx",
                            lineNumber: 472,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/broker-signup/page.tsx",
                    lineNumber: 389,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/broker-signup/page.tsx",
                lineNumber: 388,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/broker-signup/page.tsx",
        lineNumber: 370,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ddc2db07._.js.map