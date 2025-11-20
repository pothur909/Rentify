module.exports = [
"[project]/app/broker-signup/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function BrokerSignup() {
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [phoneNumber, setPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(""); // only 10 digits entered by user
    const [serviceAreas, setServiceAreas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        ""
    ]);
    const [availableFlatTypes, setAvailableFlatTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        ""
    ]);
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Phone validation
        const phone = phoneNumber.replace(/\D/g, ""); // remove non-digits
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
                setMessage("Broker signed up successfully!");
                setName("");
                setPhoneNumber("");
                setServiceAreas([
                    ""
                ]);
                setAvailableFlatTypes([
                    ""
                ]);
                setAddress("");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-md mx-auto p-6 border rounded-lg shadow-lg text-black bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-4",
                children: "Broker Signup"
            }, void 0, false, {
                fileName: "[project]/app/broker-signup/page.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        placeholder: "Name",
                        value: name,
                        onChange: (e)=>setName(e.target.value),
                        className: "border p-2 w-full",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-gray-200 border p-2",
                                children: "+91"
                            }, void 0, false, {
                                fileName: "[project]/app/broker-signup/page.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                placeholder: "Phone number (10 digits)",
                                value: phoneNumber,
                                onChange: (e)=>setPhoneNumber(e.target.value),
                                className: "border p-2 w-full",
                                required: true,
                                maxLength: 10
                            }, void 0, false, {
                                fileName: "[project]/app/broker-signup/page.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block mb-1 font-semibold",
                                children: "Service Areas"
                            }, void 0, false, {
                                fileName: "[project]/app/broker-signup/page.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            serviceAreas.map((area, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: area,
                                    onChange: (e)=>handleServiceAreaChange(i, e.target.value),
                                    className: "border p-2 w-full mb-1",
                                    placeholder: `Service Area ${i + 1}`
                                }, i, false, {
                                    fileName: "[project]/app/broker-signup/page.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: addServiceArea,
                                className: "text-blue-500 mt-1",
                                children: "+ Add Service Area"
                            }, void 0, false, {
                                fileName: "[project]/app/broker-signup/page.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block mb-1 font-semibold",
                                children: "Available Flat Types"
                            }, void 0, false, {
                                fileName: "[project]/app/broker-signup/page.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            availableFlatTypes.map((flat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: flat,
                                    onChange: (e)=>handleFlatTypeChange(i, e.target.value),
                                    className: "border p-2 w-full mb-1",
                                    placeholder: `Flat Type ${i + 1}`
                                }, i, false, {
                                    fileName: "[project]/app/broker-signup/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: addFlatType,
                                className: "text-blue-500 mt-1",
                                children: "+ Add Flat Type"
                            }, void 0, false, {
                                fileName: "[project]/app/broker-signup/page.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        placeholder: "Address",
                        value: address,
                        onChange: (e)=>setAddress(e.target.value),
                        className: "border p-2 w-full",
                        rows: 3
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "bg-green-500 text-white p-2 w-full",
                        children: "Signup"
                    }, void 0, false, {
                        fileName: "[project]/app/broker-signup/page.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/broker-signup/page.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-red-500",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/broker-signup/page.tsx",
                lineNumber: 201,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/broker-signup/page.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_broker-signup_page_tsx_c7d80bff._.js.map