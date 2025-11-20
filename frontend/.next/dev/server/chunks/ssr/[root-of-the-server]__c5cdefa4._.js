module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/broker-signup/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
}),
"[project]/app/broker-signup/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/broker-signup/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c5cdefa4._.js.map