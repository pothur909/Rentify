
// "use client";

// import { useState, useEffect } from "react";
// import { useAuthContext } from "@/app/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { Building2, Home, Key, Phone, User, Mail, MapPin, CheckCircle } from "lucide-react";

// export default function BrokerAuth() {
//   const { login, isAuthenticated } = useAuthContext();
//   const router = useRouter();

//   // Auth mode: 'login' or 'signup'
//   const [mode, setMode] = useState<"login" | "signup">("login");
  
//   // Login states
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState<"phone" | "otp">("phone");
//   const [timer, setTimer] = useState(0);
//   const [canResend, setCanResend] = useState(true);
  
//   // Signup states
//   const [name, setName] = useState("");
//   const [signupPhone, setSignupPhone] = useState("");
//   const [serviceAreas, setServiceAreas] = useState<string[]>([""]);
//   const [availableFlatTypes, setAvailableFlatTypes] = useState<string[]>([""]);
//   const [address, setAddress] = useState("");

// const [monthlyFlatsAvailable, setMonthlyFlatsAvailable] = useState("");
// const [customerExpectations, setCustomerExpectations] = useState("");
  
//   const [message, setMessage] = useState("");
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";

//   // Redirect if authenticated
//   useEffect(() => {
//     if (isAuthenticated) router.push("/dashboard");
//   }, [isAuthenticated, router]);

//   // Timer for OTP
//   useEffect(() => {
//     if (timer <= 0) return;
//     const interval = setInterval(() => setTimer(t => t - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timer]);

//   useEffect(() => {
//     setCanResend(timer <= 0);
//   }, [timer]);

//   // Login: Send OTP
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
//         setTimer(30);
//         setMessage("OTP sent to your phone");
//       } else setMessage(data.message);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to send OTP");
//     }
//   };

//   // Login: Verify OTP
//   const verifyOtp = async () => {
//     try {
//       const res = await fetch(`${baseUrl}/api/brokers/login/verify`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phoneNumber, otp }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         login(data.token, data.broker);
//         router.push("/dashboard");
//       } else setMessage(data.message);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to verify OTP");
//     }
//   };

//   const changePhoneNumber = () => {
//     setStep("phone");
//     setOtp("");
//     setMessage("");
//     setTimer(0);
//   };

//   // Signup: Submit
//   const handleSignup = async () => {
//     const phone = signupPhone.replace(/\D/g, "");
//     if (phone.length !== 10) {
//       setMessage("Phone number must be exactly 10 digits");
//       return;
//     }

//     const payload = {
//       name,
//       phoneNumber: "+91" + phone,
//       serviceAreas: serviceAreas.filter(s => s.trim() !== ""),
//       availableFlatTypes: availableFlatTypes.filter(f => f.trim() !== ""),
//       address,
//        monthlyFlatsAvailable: monthlyFlatsAvailable
//       ? Number(monthlyFlatsAvailable)
//       : undefined,
//     customerExpectations: customerExpectations || undefined,
//     };

//     try {
//       const res = await fetch(`${baseUrl}/api/brokers/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setMessage("Broker signed up successfully! Please login.");
//         setTimeout(() => {
//           setMode("login");
//           setMessage("");
//         }, 2000);
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

//   // Animated background elements
//   const FloatingElement = ({ delay = 0, duration = 3 }) => (
//     <div
//       className="absolute rounded-full bg-white/10 backdrop-blur-sm"
//       style={{
//         width: `${Math.random() * 150 + 50}px`,
//         height: `${Math.random() * 150 + 50}px`,
//         top: `${Math.random() * 100}%`,
//         left: `${Math.random() * 100}%`,
//         animation: `float ${duration}s ease-in-out ${delay}s infinite`,
//       }}
//     />
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 pt-32">
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) translateX(0px); }
//           25% { transform: translateY(-20px) translateX(10px); }
//           50% { transform: translateY(-10px) translateX(-10px); }
//           75% { transform: translateY(-30px) translateX(5px); }
//         }
//         @keyframes slideInLeft {
//           from { transform: translateX(-100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         @keyframes slideInRight {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//       `}</style>

//       <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
//         <div className="grid md:grid-cols-2 min-h-[600px]">
//           {/* Animated Side */}
//           <div
//             className={`relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-12 flex flex-col justify-center items-center text-white overflow-hidden transition-all duration-700 ${
//               mode === "signup" ? "order-2" : "order-1"
//             }`}
//             style={{
//               animation: mode === "signup" ? "slideInRight 0.7s ease-out" : "slideInLeft 0.7s ease-out",
//             }}
//           >
//             <FloatingElement delay={0} duration={4} />
//             <FloatingElement delay={1} duration={5} />
//             <FloatingElement delay={2} duration={3.5} />
//             <FloatingElement delay={0.5} duration={4.5} />

//             <div className="relative z-10 text-center">
//               {mode === "login" ? (
//                 <>
//                   <Building2 className="w-24 h-24 mx-auto mb-6 animate-pulse" />
//                   <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
//                   <p className="text-blue-100 mb-8 text-lg">
//                     Access your broker dashboard and manage your properties with ease
//                   </p>
//                   <div className="space-y-4 text-left max-w-sm mx-auto">
//                     <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                       <Home className="w-6 h-6 mt-1 flex-shrink-0" />
//                       <div>
//                         <h4 className="font-semibold">Manage Properties</h4>
//                         <p className="text-sm text-blue-100">List and track all your properties</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                       <Key className="w-6 h-6 mt-1 flex-shrink-0" />
//                       <div>
//                         <h4 className="font-semibold">Connect with Clients</h4>
//                         <p className="text-sm text-blue-100">Respond to inquiries instantly</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                       <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
//                       <div>
//                         <h4 className="font-semibold">Grow Your Business</h4>
//                         <p className="text-sm text-blue-100">Reach more potential renters</p>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <User className="w-24 h-24 mx-auto mb-6 animate-pulse" />
//                   <h2 className="text-4xl font-bold mb-4">Join Our Platform</h2>
//                   <p className="text-blue-100 mb-8 text-lg">
//                     Start your journey as a broker and expand your reach
//                   </p>
//                   <div className="space-y-4 text-left max-w-sm mx-auto">
//                     <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                       <Building2 className="w-6 h-6 mt-1 flex-shrink-0" />
//                       <div>
//                         <h4 className="font-semibold">Free Registration</h4>
//                         <p className="text-sm text-blue-100">No hidden fees or charges</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                       <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
//                       <div>
//                         <h4 className="font-semibold">Multiple Service Areas</h4>
//                         <p className="text-sm text-blue-100">Cover your entire territory</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                       <Home className="w-6 h-6 mt-1 flex-shrink-0" />
//                       <div>
//                         <h4 className="font-semibold">Diverse Property Types</h4>
//                         <p className="text-sm text-blue-100">List all types of properties</p>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Form Side */}
//           <div
//             className={`p-12 flex flex-col justify-center transition-all duration-700 ${
//               mode === "signup" ? "order-1" : "order-2"
//             }`}
//           >
//             {mode === "login" ? (
//               <div className="max-w-md mx-auto w-full">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-2">Broker Login</h2>
//                 <p className="text-gray-600 mb-8">Enter your credentials to access your account</p>

//                 {step === "phone" ? (
//                   <div className="space-y-4 text-black ">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Phone Number
//                       </label>
//                       <div className="relative">
//                         <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                           type="tel"
//                           placeholder="+91 XXXXX XXXXX"
//                           value={phoneNumber}
//                           onChange={e => setPhoneNumber(e.target.value)}
//                           className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                         />
//                       </div>
//                     </div>
//                     <button
//                       onClick={sendOtp}
//                       className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
//                     >
//                       Send OTP
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Enter OTP
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="Enter 6-digit OTP"
//                         value={otp}
//                         onChange={e => setOtp(e.target.value)}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center text-2xl tracking-widest"
//                         maxLength={6}
//                       />
//                     </div>
//                     <button
//                       onClick={verifyOtp}
//                       className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
//                     >
//                       Verify & Login
//                     </button>
//                     <button
//                       onClick={changePhoneNumber}
//                       className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
//                     >
//                       Change Phone Number
//                     </button>
//                     <button
//                       onClick={sendOtp}
//                       disabled={!canResend}
//                       className={`w-full py-3 rounded-xl font-semibold transition-all ${
//                         canResend
//                           ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
//                           : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       }`}
//                     >
//                       {canResend ? "Resend OTP" : `Resend in ${timer}s`}
//                     </button>
//                   </div>
//                 )}

//                 {message && (
//                   <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
//                     {message}
//                   </div>
//                 )}

//                 <div className="mt-8 text-center">
//                   <p className="text-gray-600">
//                     Don't have an account?{" "}
//                     <button
//                       onClick={() => {
//                         setMode("signup");
//                         setMessage("");
//                         setStep("phone");
//                       }}
//                       className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
//                     >
//                       Sign Up
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="max-w-md mx-auto w-full overflow-y-auto max-h-[600px] pr-2">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-2">Broker Signup</h2>
//                 <p className="text-gray-600 mb-6">Create your account and start listing properties</p>

//                 <div className="space-y-4 text-black ">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                     <input
//                       type="text"
//                       placeholder="Your full name"
//                       value={name}
//                       onChange={e => setName(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone Number
//                     </label>
//                     <div className="flex">
//                       <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
//                         +91
//                       </span>
//                       <input
//                         type="tel"
//                         placeholder="10 digit number"
//                         value={signupPhone}
//                         onChange={e => setSignupPhone(e.target.value)}
//                         className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors"
//                         maxLength={10}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Service Areas
//                     </label>
//                     {serviceAreas.map((area, i) => (
//                       <input
//                         key={i}
//                         value={area}
//                         onChange={e => handleServiceAreaChange(i, e.target.value)}
//                         placeholder={`Area ${i + 1} (e.g., HSR Layout, BTM)`}
//                         className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-2"
//                       />
//                     ))}
//                     <button
//                       type="button"
//                       onClick={addServiceArea}
//                       className="text-blue-600 text-sm font-semibold hover:text-blue-700"
//                     >
//                       + Add Another Area
//                     </button>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Available Flat Types
//                     </label>
//                     {availableFlatTypes.map((flat, i) => (
//                       <input
//                         key={i}
//                         value={flat}
//                         onChange={e => handleFlatTypeChange(i, e.target.value)}
//                         placeholder={`Type ${i + 1} (e.g., 1BHK, 2BHK)`}
//                         className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-2"
//                       />
//                     ))}
//                     <button
//                       type="button"
//                       onClick={addFlatType}
//                       className="text-blue-600 text-sm font-semibold hover:text-blue-700"
//                     >
//                       + Add Another Type
//                     </button>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Office Address
//                     </label>
//                     <textarea
//                       placeholder="Your office address"
//                       value={address}
//                       onChange={e => setAddress(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                       rows={3}
//                     />
//                   </div>

//                   <div>
//   <label className="block text-sm font-medium text-gray-700 mb-2">
//     No. of flats available per month (optional)
//   </label>
//   <input
//     type="number"
//     min={0}
//     value={monthlyFlatsAvailable}
//     onChange={e => setMonthlyFlatsAvailable(e.target.value)}
//     placeholder="e.g., 10"
//     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//   />
// </div>

// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-2">
//     Expectations from customers (optional)
//   </label>
//   <textarea
//     value={customerExpectations}
//     onChange={e => setCustomerExpectations(e.target.value)}
//     placeholder="Any notes or conditions you expect from tenants"
//     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//     rows={3}
//   />
// </div>


//                   <button
//                     onClick={handleSignup}
//                     className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
//                   >
//                     Create Account
//                   </button>
//                 </div>

//                 {message && (
//                   <div className={`mt-4 p-3 border rounded-xl text-sm ${
//                     message.includes("success") 
//                       ? "bg-green-50 border-green-200 text-green-600" 
//                       : "bg-red-50 border-red-200 text-red-600"
//                   }`}>
//                     {message}
//                   </div>
//                 )}

//                 <div className="mt-6 text-center">
//                   <p className="text-gray-600">
//                     Already have an account?{" "}
//                     <button
//                       onClick={() => {
//                         setMode("login");
//                         setMessage("");
//                       }}
//                       className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
//                     >
//                       Login
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Building2,
  Home,
  Key,
  Phone,
  User,
  MapPin,
  CheckCircle,
} from "lucide-react";

const SERVICE_AREAS = [
  "Whitefield",
  "Indiranagar",
  "Koramangala",
  "Bengaluru",
  "Jayanagar",
  "Banashankari",
  "HSR Layout",
  "BTM Layout",
  "Marathahalli",
  "Electronic City",
  "Hebbal",
  "JP Nagar",
];

const FLAT_TYPES = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "Villa"];

export default function BrokerAuth() {
  const { login, isAuthenticated } = useAuthContext();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");

  // login
  const [phoneNumber, setPhoneNumber] = useState(""); // 10 digits only
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // signup
  const [name, setName] = useState("");
  const [signupPhone, setSignupPhone] = useState(""); // 10 digits only
  const [serviceAreas, setServiceAreas] = useState<string[]>([""]);
  const [availableFlatTypes, setAvailableFlatTypes] = useState<string[]>([""]);
  const [address, setAddress] = useState("");
  const [monthlyFlatsAvailable, setMonthlyFlatsAvailable] = useState("");
  const [customerExpectations, setCustomerExpectations] = useState("");

  const [message, setMessage] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setCanResend(timer <= 0);
  }, [timer]);

  const handleLoginPhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length > 10) digits = digits.slice(0, 10);
    setPhoneNumber(digits);
  };

  const handleSignupPhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length > 10) digits = digits.slice(0, 10);
    setSignupPhone(digits);
  };

  // login: send otp
  const sendOtp = async () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length !== 10) {
      setMessage("Phone number must be exactly 10 digits");
      return;
    }
    const fullPhone = "+91" + digits;

    try {
      const res = await fetch(`${baseUrl}/api/brokers/login/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        setTimer(30);
        setMessage("OTP sent to your phone");
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP");
    }
  };

  // login: verify otp
  const verifyOtp = async () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length !== 10) {
      setMessage("Phone number must be exactly 10 digits");
      return;
    }
    const fullPhone = "+91" + digits;

    try {
      const res = await fetch(`${baseUrl}/api/brokers/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhone, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.broker);
        router.push("/dashboard");
      } else {
        setMessage(data.message || "Failed to verify OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to verify OTP");
    }
  };

  const changePhoneNumber = () => {
    setStep("phone");
    setOtp("");
    setMessage("");
    setTimer(0);
  };

  // signup
  const handleSignup = async () => {
    const digits = signupPhone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setMessage("Phone number must be exactly 10 digits");
      return;
    }

    const payload = {
      name,
      phoneNumber: "+91" + digits,
      serviceAreas: serviceAreas.filter((s) => s.trim() !== ""),
      availableFlatTypes: availableFlatTypes.filter((f) => f.trim() !== ""),
      address,
      monthlyFlatsAvailable: monthlyFlatsAvailable
        ? Number(monthlyFlatsAvailable)
        : undefined,
      customerExpectations: customerExpectations || undefined,
    };

    try {
      const res = await fetch(`${baseUrl}/api/brokers/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Broker signed up successfully. Please login.");
        setTimeout(() => {
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

  const handleServiceAreaChange = (index: number, value: string) => {
    const updated = [...serviceAreas];
    updated[index] = value;
    setServiceAreas(updated);
  };

  const handleFlatTypeChange = (index: number, value: string) => {
    const updated = [...availableFlatTypes];
    updated[index] = value;
    setAvailableFlatTypes(updated);
  };

  const addServiceArea = () => setServiceAreas((prev) => [...prev, ""]);
  const addFlatType = () => setAvailableFlatTypes((prev) => [...prev, ""]);

  const FloatingElement = ({ delay = 0, duration = 3 }) => (
    <div
      className="absolute rounded-full bg-white/10 backdrop-blur-sm"
      style={{
        width: `${Math.random() * 120 + 40}px`,
        height: `${Math.random() * 120 + 40}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-start md:items-center justify-center px-4 py-8 pt-24 md:pt-32 overflow-x-hidden">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[560px]">
          {/* Animation side: always on top in mobile */}
          <div
            className={`relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 md:p-12 flex flex-col justify-center items-center text-white overflow-hidden transition-all duration-700 order-1 md:order-1`}
            style={{
              animation:
                mode === "signup"
                  ? "slideInRight 0.7s ease-out"
                  : "slideInLeft 0.7s ease-out",
            }}
          >
            <FloatingElement delay={0} duration={4} />
            <FloatingElement delay={1} duration={5} />
            <FloatingElement delay={2} duration={3.5} />
            <FloatingElement delay={0.5} duration={4.5} />

            <div className="relative z-10 text-center max-w-md mx-auto">
              {mode === "login" ? (
                <>
                  <Building2 className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 animate-pulse" />
                  <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                    Welcome Back
                  </h2>
                  <p className="text-sm md:text-lg text-blue-100 mb-6 md:mb-8">
                    Access your broker dashboard and manage your properties.
                  </p>
                  <div className="space-y-3 md:space-y-4 text-left">
                    <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                      <Home className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm md:text-base">
                          Manage Properties
                        </h4>
                        <p className="text-xs md:text-sm text-blue-100">
                          List and track all your properties.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                      <Key className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm md:text-base">
                          Connect with Clients
                        </h4>
                        <p className="text-xs md:text-sm text-blue-100">
                          Respond to enquiries quickly.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm md:text-base">
                          Grow Your Business
                        </h4>
                        <p className="text-xs md:text-sm text-blue-100">
                          Reach more serious renters.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <User className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 animate-pulse" />
                  <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                    Join As Broker
                  </h2>
                  <p className="text-sm md:text-lg text-blue-100 mb-6 md:mb-8">
                    Create your account and start getting verified leads.
                  </p>
                  <div className="space-y-3 md:space-y-4 text-left">
                    <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                      <Building2 className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm md:text-base">
                          Free Registration
                        </h4>
                        <p className="text-xs md:text-sm text-blue-100">
                          No charges to get started.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm md:text-base">
                          Multiple Locations
                        </h4>
                        <p className="text-xs md:text-sm text-blue-100">
                          Cover all your active areas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                      <Home className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm md:text-base">
                          All Property Types
                        </h4>
                        <p className="text-xs md:text-sm text-blue-100">
                          From 1RK to villas and more.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form side: always below animation in mobile */}
          <div
            className={`p-6 md:p-12 flex flex-col justify-center transition-all duration-700 order-2 md:order-2`}
          >
            {mode === "login" ? (
              <div className="max-w-md mx-auto w-full text-gray-800">
                <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                  Broker Login
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8">
                  Enter your mobile number to receive an OTP.
                </p>

                {step === "phone" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 md:px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium text-xs md:text-sm">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="10 digit number"
                          value={phoneNumber}
                          onChange={(e) =>
                            handleLoginPhoneChange(e.target.value)
                          }
                          maxLength={10}
                          className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                        />
                      </div>
                    </div>
                    <button
                      onClick={sendOtp}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                    >
                      Send OTP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        placeholder="6 digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="w-full px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center text-xl tracking-[0.4em]"
                      />
                    </div>
                    <button
                      onClick={verifyOtp}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                    >
                      Verify & Login
                    </button>
                    <button
                      onClick={changePhoneNumber}
                      className="w-full bg-gray-100 text-gray-700 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:bg-gray-200 transition-all"
                    >
                      Change Phone Number
                    </button>
                    <button
                      onClick={sendOtp}
                      disabled={!canResend}
                      className={`w-full py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${
                        canResend
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                    </button>
                  </div>
                )}

                {message && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs md:text-sm">
                    {message}
                  </div>
                )}

                <div className="mt-6 md:mt-8 text-center text-xs md:text-sm">
                  <p className="text-gray-600">
                    Do not have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("signup");
                        setMessage("");
                        setStep("phone");
                      }}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto w-full text-gray-800 pr-1 md:pr-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                  Broker Signup
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mb-5 md:mb-6">
                  Fill your details to start receiving leads.
                </p>

                {/* no overflow-y here, full form scrolls with page */}
                <div className="space-y-4 text-sm md:text-base">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 md:px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium text-xs md:text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        placeholder="10 digit number"
                        value={signupPhone}
                        onChange={(e) =>
                          handleSignupPhoneChange(e.target.value)
                        }
                        maxLength={10}
                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                      />
                    </div>
                  </div>

                  {/* Service areas with dropdowns */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Service Areas
                    </label>
                    {serviceAreas.map((area, i) => (
                      <div key={i} className="mb-2">
                        <select
                          value={area}
                          onChange={(e) =>
                            handleServiceAreaChange(i, e.target.value)
                          }
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base bg-white"
                        >
                          <option value="">Select area</option>
                          {SERVICE_AREAS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addServiceArea}
                      className="text-blue-600 text-xs md:text-sm font-semibold hover:text-blue-700 mt-1"
                    >
                      + Add another area
                    </button>
                  </div>

                  {/* Flat types with dropdowns */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Available Flat Types
                    </label>
                    {availableFlatTypes.map((flat, i) => (
                      <div key={i} className="mb-2">
                        <select
                          value={flat}
                          onChange={(e) =>
                            handleFlatTypeChange(i, e.target.value)
                          }
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base bg-white"
                        >
                          <option value="">Select flat type</option>
                          {FLAT_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFlatType}
                      className="text-blue-600 text-xs md:text-sm font-semibold hover:text-blue-700 mt-1"
                    >
                      + Add another type
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Office Address
                    </label>
                    <textarea
                      placeholder="Your office address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      No. of flats available per month (optional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={monthlyFlatsAvailable}
                      onChange={(e) =>
                        setMonthlyFlatsAvailable(e.target.value)
                      }
                      placeholder="e.g., 10"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Expectations from customers (optional)
                    </label>
                    <textarea
                      value={customerExpectations}
                      onChange={(e) =>
                        setCustomerExpectations(e.target.value)
                      }
                      placeholder="Any notes or conditions you expect from tenants"
                      rows={3}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                    />
                  </div>

                  <button
                    onClick={handleSignup}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    Create Account
                  </button>
                </div>

                {message && (
                  <div
                    className={`mt-4 p-3 border rounded-xl text-xs md:text-sm ${
                      message.toLowerCase().includes("success")
                        ? "bg-green-50 border-green-200 text-green-600"
                        : "bg-red-50 border-red-200 text-red-600"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="mt-4 md:mt-6 text-center text-xs md:text-sm">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("login");
                        setMessage("");
                      }}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
