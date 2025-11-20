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
"[project]/app/broker-login/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

// "use client";
// import { useState, useEffect } from "react";
// import { useAuthContext } from "../context/AuthContext";
// export default function BrokerLogin() {
//   const { login } = useAuthContext();
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState<"phone" | "otp">("phone");
//   const [timer, setTimer] = useState(0);
//   const [canResend, setCanResend] = useState(true);
//   const [message, setMessage] = useState("");
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";
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
//     try {
//       const res = await fetch(`${baseUrl}/api/brokers/login/request-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phoneNumber }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setStep("otp");
//         setTimer(30); // start 30 sec countdown
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
//         // Login in context
//         login("demo-token", data.data); // replace "demo-token" with actual token from API
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
}),
"[project]/app/broker-login/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/broker-login/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__90bda7ed._.js.map