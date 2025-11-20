module.exports = [
"[project]/app/enquiry-form/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // // // File: app/lead-form/page.tsx
// // // 'use client';
// // // import { useState } from 'react';
// // // export default function LeadFormPage() {
// // //   const [formData, setFormData] = useState({
// // //     name: '',
// // //     phoneNumber: '',
// // //     address: '',
// // //     budget: '',
// // //     flatType: '',
// // //   });
// // //   const [loading, setLoading] = useState(false);
// // //   const [message, setMessage] = useState('');
// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// // //     setFormData({ ...formData, [e.target.name]: e.target.value });
// // //   };
// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setMessage('');
// // //     try {
// // //       const response = await fetch('/api/leads', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({
// // //           ...formData,
// // //           budget: formData.budget ? Number(formData.budget) : undefined,
// // //         }),
// // //       });
// // //       const data = await response.json();
// // //       if (response.ok) {
// // //         setMessage('Lead created successfully!');
// // //         setFormData({ name: '', phoneNumber: '', address: '', budget: '', flatType: '' });
// // //       } else {
// // //         setMessage(data.message || 'Something went wrong.');
// // //       }
// // //     } catch (err) {
// // //       console.error(err);
// // //       setMessage('Network error.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
// // //   return (
// // //     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white text-black">
// // //       <h1 className="text-2xl font-bold mb-6">Create Lead</h1>
// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <div>
// // //           <label className="block mb-1 font-medium">Name*</label>
// // //           <input
// // //             type="text"
// // //             name="name"
// // //             value={formData.name}
// // //             onChange={handleChange}
// // //             required
// // //             className="w-full border p-2 rounded"
// // //           />
// // //         </div>
// // //         <div>
// // //           <label className="block mb-1 font-medium">Phone Number*</label>
// // //           <input
// // //             type="tel"
// // //             name="phoneNumber"
// // //             value={formData.phoneNumber}
// // //             onChange={handleChange}
// // //             required
// // //             className="w-full border p-2 rounded"
// // //           />
// // //         </div>
// // //         <div>
// // //           <label className="block mb-1 font-medium">Address</label>
// // //           <textarea
// // //             name="address"
// // //             value={formData.address}
// // //             onChange={handleChange}
// // //             className="w-full border p-2 rounded"
// // //           />
// // //         </div>
// // //         <div>
// // //           <label className="block mb-1 font-medium">Budget</label>
// // //           <input
// // //             type="number"
// // //             name="budget"
// // //             value={formData.budget}
// // //             onChange={handleChange}
// // //             className="w-full border p-2 rounded"
// // //           />
// // //         </div>
// // //         <div>
// // //           <label className="block mb-1 font-medium">Flat Type</label>
// // //           <input
// // //             type="text"
// // //             name="flatType"
// // //             value={formData.flatType}
// // //             onChange={handleChange}
// // //             className="w-full border p-2 rounded"
// // //           />
// // //         </div>
// // //         <button
// // //           type="submit"
// // //           disabled={loading}
// // //           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// // //         >
// // //           {loading ? 'Submitting...' : 'Create Lead'}
// // //         </button>
// // //       </form>
// // //       {message && <p className="mt-4 text-center">{message}</p>}
// // //     </div>
// // //   );
// // // }
// // 'use client';
// // import { useState } from 'react';
// // const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';
// // export default function LeadFormPage() {
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     phoneNumber: '+91',
// //     address: '',
// //     budget: '',
// //     flatType: '',
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState('');
// //   // Ensure phone number starts with +91 and only 10 digits after
// //   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     let value = e.target.value;
// //     // Auto-add +91 if missing
// //     if (!value.startsWith('+91')) {
// //       value = '+91' + value.replace(/^\+?/, '');
// //     }
// //     // Remove non-digit characters except '+'
// //     value = '+91' + value.slice(3).replace(/\D/g, '');
// //     // Limit to 10 digits after +91
// //     if (value.length > 13) {
// //       value = value.slice(0, 13);
// //     }
// //     setFormData({ ...formData, phoneNumber: value });
// //   };
// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //     if (e.target.name === 'phoneNumber') return handlePhoneChange(e);
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setMessage('');
// //     // Validate phone number
// //     const phoneRegex = /^\+91\d{10}$/;
// //     if (!phoneRegex.test(formData.phoneNumber)) {
// //       setMessage('Phone number must be 10 digits after +91.');
// //       setLoading(false);
// //       return;
// //     }
// //     try {
// //       const response = await fetch(`${baseurl}/api/leads`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           ...formData,
// //           budget: formData.budget ? Number(formData.budget) : undefined,
// //         }),
// //       });
// //       const data = await response.json();
// //       if (response.ok) {
// //         setMessage('Lead created successfully!');
// //         setFormData({ name: '', phoneNumber: '+91', address: '', budget: '', flatType: '' });
// //       } else {
// //         setMessage(data.message || 'Something went wrong.');
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setMessage('Network error.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   return (
// //     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg text-black bg-background">
// //       <h1 className="text-2xl font-bold mb-6">Create Lead</h1>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <div>
// //           <label className="block mb-1 font-medium">Name*</label>
// //           <input
// //             type="text"
// //             name="name"
// //             value={formData.name}
// //             onChange={handleChange}
// //             required
// //             className="w-full border p-2 rounded"
// //           />
// //         </div>
// //         <div>
// //           <label className="block mb-1 font-medium">Phone Number*</label>
// //           <input
// //             type="tel"
// //             name="phoneNumber"
// //             value={formData.phoneNumber}
// //             onChange={handleChange}
// //             required
// //             className="w-full border p-2 rounded"
// //             maxLength={13} // +91 + 10 digits
// //           />
// //           <p className="text-sm text-gray-500 mt-1">Format: +911234567890</p>
// //         </div>
// //         <div>
// //           <label className="block mb-1 font-medium">Address</label>
// //           <textarea
// //             name="address"
// //             value={formData.address}
// //             onChange={handleChange}
// //             className="w-full border p-2 rounded"
// //           />
// //         </div>
// //         <div>
// //           <label className="block mb-1 font-medium">Budget</label>
// //           <input
// //             type="number"
// //             name="budget"
// //             value={formData.budget}
// //             onChange={handleChange}
// //             className="w-full border p-2 rounded"
// //           />
// //         </div>
// //         <div>
// //           <label className="block mb-1 font-medium">Flat Type</label>
// //           <input
// //             type="text"
// //             name="flatType"
// //             value={formData.flatType}
// //             onChange={handleChange}
// //             className="w-full border p-2 rounded"
// //           />
// //         </div>
// //         <button
// //           type="submit"
// //           disabled={loading}
// //           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //         >
// //           {loading ? 'Submitting...' : 'Create Lead'}
// //         </button>
// //       </form>
// //       {message && <p className="mt-4 text-center">{message}</p>}
// //     </div>
// //   );
// // }
// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { Search, Home, DollarSign, MapPin, Phone, User, CheckCircle, X } from 'lucide-react';
// const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';
// // Common service areas in Mumbai
// const SERVICE_AREAS = [
//   'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Goregaon', 'Juhu', 'Kandivali',
//   'Kurla', 'Malad', 'Mira Road', 'Mulund', 'Powai', 'Santacruz', 'Thane',
//   'Vashi', 'Vikhroli', 'Worli', 'Lower Parel', 'Chembur', 'Ghatkopar'
// ];
// const FLAT_TYPES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse'];
// const BUDGET_RANGES = [
//   { label: 'Under ₹10,000', value: '0-10000' },
//   { label: '₹10,000 - ₹20,000', value: '10000-20000' },
//   { label: '₹20,000 - ₹30,000', value: '20000-30000' },
//   { label: '₹30,000 - ₹50,000', value: '30000-50000' },
//   { label: '₹50,000 - ₹75,000', value: '50000-75000' },
//   { label: '₹75,000 - ₹1,00,000', value: '75000-100000' },
//   { label: 'Above ₹1,00,000', value: '100000-above' },
// ];
// export default function EnquiryForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     phoneNumber: '',
//     address: '',
//     budget: '',
//     flatType: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   // Autocomplete states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
//   const autocompleteRef = useRef<HTMLDivElement>(null);
//   // Filter service areas based on search
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = SERVICE_AREAS.filter(area =>
//         area.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredAreas(filtered);
//     } else {
//       setFilteredAreas(SERVICE_AREAS);
//     }
//   }, [searchTerm]);
//   // Close suggestions when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);
//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value.replace(/\D/g, '');
//     if (value.length > 10) value = value.slice(0, 10);
//     setFormData({ ...formData, phoneNumber: value });
//   };
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     if (e.target.name === 'phoneNumber') return handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const handleAreaSelect = (area: string) => {
//     setFormData({ ...formData, address: area });
//     setSearchTerm(area);
//     setShowSuggestions(false);
//   };
//   const handleSubmit = async () => {
//     setLoading(true);
//     setMessage(null);
//     // Validate phone number
//     if (formData.phoneNumber.length !== 10) {
//       setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
//       setLoading(false);
//       return;
//     }
//     // Parse budget range
//     let budgetValue: number | undefined;
//     if (formData.budget) {
//       const [min] = formData.budget.split('-');
//       budgetValue = parseInt(min);
//     }
//     try {
//       const response = await fetch(`${baseurl}/api/leads`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           phoneNumber: '+91' + formData.phoneNumber,
//           address: formData.address,
//           budget: budgetValue,
//           flatType: formData.flatType,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessage({ type: 'success', text: 'Enquiry submitted successfully! We will contact you soon.' });
//         setFormData({ name: '', phoneNumber: '', address: '', budget: '', flatType: '' });
//         setSearchTerm('');
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage({ type: 'error', text: 'Network error. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 pt-32">
//       <div className="w-full max-w-2xl">
//         {/* Header Card */}
//         <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl p-8 mb-6 text-white">
//           <div className="flex items-center space-x-4 mb-4">
//             <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
//               <Home className="w-8 h-8" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold">Find Your Dream Home</h1>
//               <p className="text-blue-100 mt-1">Tell us what you're looking for</p>
//             </div>
//           </div>
//           <div className="grid grid-cols-3 gap-4 mt-6">
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
//               <CheckCircle className="w-6 h-6 mx-auto mb-2" />
//               <p className="text-sm font-medium">Verified Properties</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
//               <Phone className="w-6 h-6 mx-auto mb-2" />
//               <p className="text-sm font-medium">Instant Response</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
//               <MapPin className="w-6 h-6 mx-auto mb-2" />
//               <p className="text-sm font-medium">Best Locations</p>
//             </div>
//           </div>
//         </div>
//         {/* Form Card */}
//         <div className="bg-white rounded-3xl shadow-2xl p-8">
//           <div className="space-y-6">
//             {/* Name Field */}
//             <div>
//               <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <User className="w-4 h-4 mr-2 text-blue-600" />
//                 Your Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your full name"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//               />
//             </div>
//             {/* Phone Field */}
//             <div>
//               <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <Phone className="w-4 h-4 mr-2 text-blue-600" />
//                 Phone Number *
//               </label>
//               <div className="flex">
//                 <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
//                   +91
//                 </span>
//                 <input
//                   type="tel"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   required
//                   placeholder="10 digit mobile number"
//                   className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   maxLength={10}
//                 />
//               </div>
//             </div>
//             {/* Service Area - Autocomplete */}
//             <div ref={autocompleteRef}>
//               <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <MapPin className="w-4 h-4 mr-2 text-blue-600" />
//                 Preferred Location *
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setFormData({ ...formData, address: e.target.value });
//                     setShowSuggestions(true);
//                   }}
//                   onFocus={() => setShowSuggestions(true)}
//                   placeholder="Search or select location"
//                   className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   required
//                 />
//                 {showSuggestions && filteredAreas.length > 0 && (
//                   <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
//                     {filteredAreas.map((area, index) => (
//                       <button
//                         key={index}
//                         onClick={() => handleAreaSelect(area)}
//                         className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
//                       >
//                         <div className="flex items-center">
//                           <MapPin className="w-4 h-4 mr-2 text-blue-600" />
//                           <span className="text-gray-700">{area}</span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//             {/* Flat Type - Dropdown */}
//             <div>
//               <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <Home className="w-4 h-4 mr-2 text-blue-600" />
//                 Property Type *
//               </label>
//               <div className="relative">
//                 <select
//                   name="flatType"
//                   value={formData.flatType}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
//                 >
//                   <option value="">Select property type</option>
//                   {FLAT_TYPES.map((type) => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             {/* Budget - Dropdown */}
//             <div>
//               <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
//                 Budget Range *
//               </label>
//               <div className="relative">
//                 <select
//                   name="budget"
//                   value={formData.budget}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
//                 >
//                   <option value="">Select budget range</option>
//                   {BUDGET_RANGES.map((range) => (
//                     <option key={range.value} value={range.value}>
//                       {range.label}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Submitting...</span>
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-5 h-5" />
//                   <span>Submit Enquiry</span>
//                 </>
//               )}
//             </button>
//           </div>
//           {/* Message Display */}
//           {message && (
//             <div
//               className={`mt-6 p-4 rounded-xl flex items-start space-x-3 ${
//                 message.type === 'success'
//                   ? 'bg-green-50 border-2 border-green-200 text-green-700'
//                   : 'bg-red-50 border-2 border-red-200 text-red-700'
//               }`}
//             >
//               {message.type === 'success' ? (
//                 <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//               ) : (
//                 <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
//               )}
//               <p className="font-medium">{message.text}</p>
//             </div>
//           )}
//           {/* Footer Note */}
//           <div className="mt-6 pt-6 border-t-2 border-gray-100">
//             <p className="text-sm text-gray-600 text-center">
//               By submitting this form, you agree to our{' '}
//               <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
//                 Terms & Conditions
//               </span>{' '}
//               and{' '}
//               <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
//                 Privacy Policy
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>EnquiryForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
'use client';
;
;
;
;
const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';
// Common service areas in Mumbai
const SERVICE_AREAS = [
    'Whitefield',
    'Indiranagar',
    'Koramangala',
    'Bengaluru',
    'Jayanagar',
    'Banashankari',
    'Basaveshwaranagar',
    'Bheemanahalli',
    'Bommanahalli',
    'Chikkalasandra',
    'Dasarahalli',
    'Domlur',
    'Electronic City',
    'Frazer Town',
    'Girinagar',
    'Gokula',
    'Gopalapuram',
    'Hanumanthanagar',
    'HBR Layout',
    'Hebbal',
    'Hoysala',
    'HSR Layout',
    'Ittamadu',
    'JP Nagar',
    'Jyothinagar',
    'Kammanahalli',
    'Kaval Byrasandra',
    'Kodichikkanahalli',
    'Kommadi',
    'Kundalahalli',
    'Lingrajapuram',
    'Mahadevapura',
    'Malleswaram',
    'Marathahalli',
    'Mathikere',
    'Mico Layout',
    'Mookambika',
    'Nagavara',
    'Nagawara',
    'Nagarathpet',
    'Nandini Layout',
    'Nayandahalli',
    'Old Airport Road',
    'Peenya',
    'Prithviraj Road',
    'RMV Extension',
    'Sadashivnagar',
    'Sahakarnagar',
    'Sanjaynagar',
    'Sarjapur Road',
    'Seshadripuram',
    'Shantinagar',
    'Shivaji Nagar',
    'Soladevanahalli',
    'Subramanyanagar'
];
const FLAT_TYPES = [
    '1RK',
    '1BHK',
    '2BHK',
    '3BHK',
    '4BHK',
    'Villa',
    'Penthouse'
];
const BUDGET_RANGES = [
    {
        label: 'Under ₹10,000',
        value: '0-10000'
    },
    {
        label: '₹10,000 - ₹20,000',
        value: '10000-20000'
    },
    {
        label: '₹20,000 - ₹30,000',
        value: '20000-30000'
    },
    {
        label: '₹30,000 - ₹50,000',
        value: '30000-50000'
    },
    {
        label: '₹50,000 - ₹75,000',
        value: '50000-75000'
    },
    {
        label: '₹75,000 - ₹1,00,000',
        value: '75000-100000'
    },
    {
        label: 'Above ₹1,00,000',
        value: '100000-above'
    }
];
function EnquiryForm() {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        phoneNumber: '',
        address: '',
        budget: '',
        flatType: ''
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Autocomplete states
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showSuggestions, setShowSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filteredAreas, setFilteredAreas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const autocompleteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Filter service areas based on search
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (searchTerm) {
            const filtered = SERVICE_AREAS.filter((area)=>area.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredAreas(filtered);
        } else {
            setFilteredAreas(SERVICE_AREAS);
        }
    }, [
        searchTerm
    ]);
    // Close suggestions when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handlePhoneChange = (e)=>{
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        setFormData({
            ...formData,
            phoneNumber: value
        });
    };
    const handleChange = (e)=>{
        if (e.target.name === 'phoneNumber') return handlePhoneChange(e);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleAreaSelect = (area)=>{
        setFormData({
            ...formData,
            address: area
        });
        setSearchTerm(area);
        setShowSuggestions(false);
    };
    const handleSubmit = async ()=>{
        setLoading(true);
        setMessage(null);
        // Validate phone number
        if (formData.phoneNumber.length !== 10) {
            setMessage({
                type: 'error',
                text: 'Phone number must be exactly 10 digits'
            });
            setLoading(false);
            return;
        }
        // Parse budget range
        let budgetValue;
        if (formData.budget) {
            const [min] = formData.budget.split('-');
            budgetValue = parseInt(min);
        }
        try {
            const response = await fetch(`${baseurl}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    phoneNumber: '+91' + formData.phoneNumber,
                    address: formData.address,
                    budget: budgetValue,
                    flatType: formData.flatType
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'Enquiry submitted successfully! We will contact you soon.'
                });
                setFormData({
                    name: '',
                    phoneNumber: '',
                    address: '',
                    budget: '',
                    flatType: ''
                });
                setSearchTerm('');
            } else {
                setMessage({
                    type: 'error',
                    text: data.message || 'Something went wrong.'
                });
            }
        } catch (err) {
            console.error(err);
            setMessage({
                type: 'error',
                text: 'Network error. Please try again.'
            });
        } finally{
            setLoading(false);
        }
    };
    // Animated floating elements
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
            fileName: "[project]/app/enquiry-form/page.tsx",
            lineNumber: 789,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-27e4e06839e145cb" + " " + "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 pt-32",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "27e4e06839e145cb",
                children: "@keyframes float{0%,to{transform:translateY(0)translate(0)}25%{transform:translateY(-20px)translate(10px)}50%{transform:translateY(-10px)translate(-10px)}75%{transform:translateY(-30px)translate(5px)}}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-27e4e06839e145cb" + " " + "w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-27e4e06839e145cb" + " " + "grid md:grid-cols-2 min-h-[700px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-27e4e06839e145cb" + " " + "relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-12 flex flex-col justify-center items-center text-white overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                                    delay: 0,
                                    duration: 4,
                                    className: "jsx-27e4e06839e145cb"
                                }, void 0, false, {
                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                    lineNumber: 816,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                                    delay: 1,
                                    duration: 5,
                                    className: "jsx-27e4e06839e145cb"
                                }, void 0, false, {
                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                    lineNumber: 817,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                                    delay: 2,
                                    duration: 3.5,
                                    className: "jsx-27e4e06839e145cb"
                                }, void 0, false, {
                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                    lineNumber: 818,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                                    delay: 0.5,
                                    duration: 4.5,
                                    className: "jsx-27e4e06839e145cb"
                                }, void 0, false, {
                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                    lineNumber: 819,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-27e4e06839e145cb" + " " + "relative z-10 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            className: "w-24 h-24 mx-auto mb-6 animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                            lineNumber: 822,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-27e4e06839e145cb" + " " + "text-4xl font-bold mb-4",
                                            children: "Find Your Dream Home"
                                        }, void 0, false, {
                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                            lineNumber: 823,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-27e4e06839e145cb" + " " + "text-blue-100 mb-8 text-lg",
                                            children: "Discover the perfect property that matches your lifestyle and budget"
                                        }, void 0, false, {
                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                            lineNumber: 824,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-27e4e06839e145cb" + " " + "space-y-4 text-left max-w-sm mx-auto",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-27e4e06839e145cb" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                            className: "w-6 h-6 mt-1 flex-shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 830,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-27e4e06839e145cb",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "jsx-27e4e06839e145cb" + " " + "font-semibold",
                                                                    children: "Verified Properties"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 832,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-27e4e06839e145cb" + " " + "text-sm text-blue-100",
                                                                    children: "All listings are authentically verified"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 833,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 831,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                    lineNumber: 829,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-27e4e06839e145cb" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                            className: "w-6 h-6 mt-1 flex-shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 837,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-27e4e06839e145cb",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "jsx-27e4e06839e145cb" + " " + "font-semibold",
                                                                    children: "Instant Response"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 839,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-27e4e06839e145cb" + " " + "text-sm text-blue-100",
                                                                    children: "Connect with brokers immediately"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 840,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 838,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                    lineNumber: 836,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-27e4e06839e145cb" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                            className: "w-6 h-6 mt-1 flex-shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 844,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-27e4e06839e145cb",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "jsx-27e4e06839e145cb" + " " + "font-semibold",
                                                                    children: "Best Locations"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 846,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-27e4e06839e145cb" + " " + "text-sm text-blue-100",
                                                                    children: "Properties across all prime areas"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 847,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 845,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                    lineNumber: 843,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-27e4e06839e145cb" + " " + "flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            className: "w-6 h-6 mt-1 flex-shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 851,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-27e4e06839e145cb",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "jsx-27e4e06839e145cb" + " " + "font-semibold",
                                                                    children: "Easy Process"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 853,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-27e4e06839e145cb" + " " + "text-sm text-blue-100",
                                                                    children: "Simple and transparent property search"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 854,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 852,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                    lineNumber: 850,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                            lineNumber: 828,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                    lineNumber: 821,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/enquiry-form/page.tsx",
                            lineNumber: 815,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-27e4e06839e145cb" + " " + "p-12 flex flex-col justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-27e4e06839e145cb" + " " + "max-w-md mx-auto w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-27e4e06839e145cb" + " " + "text-3xl font-bold text-gray-800 mb-2",
                                        children: "Submit Your Enquiry"
                                    }, void 0, false, {
                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                        lineNumber: 864,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-27e4e06839e145cb" + " " + "text-gray-600 mb-8",
                                        children: "Tell us what you're looking for"
                                    }, void 0, false, {
                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                        lineNumber: 865,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-27e4e06839e145cb" + " " + "space-y-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-27e4e06839e145cb",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "flex items-center text-sm font-semibold text-gray-700 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                className: "w-4 h-4 mr-2 text-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 871,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Your Name *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 870,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "name",
                                                        value: formData.name,
                                                        onChange: handleChange,
                                                        required: true,
                                                        placeholder: "Enter your full name",
                                                        className: "jsx-27e4e06839e145cb" + " " + "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 874,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 869,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-27e4e06839e145cb",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "flex items-center text-sm font-semibold text-gray-700 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                className: "w-4 h-4 mr-2 text-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 888,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Phone Number *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 887,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "flex",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-27e4e06839e145cb" + " " + "inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium",
                                                                children: "+91"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 892,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "tel",
                                                                name: "phoneNumber",
                                                                value: formData.phoneNumber,
                                                                onChange: handleChange,
                                                                required: true,
                                                                placeholder: "10 digit mobile number",
                                                                maxLength: 10,
                                                                className: "jsx-27e4e06839e145cb" + " " + "flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 895,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 891,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 886,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                ref: autocompleteRef,
                                                className: "jsx-27e4e06839e145cb",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "flex items-center text-sm font-semibold text-gray-700 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                className: "w-4 h-4 mr-2 text-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 911,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Preferred Location *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 910,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 915,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: searchTerm,
                                                                onChange: (e)=>{
                                                                    setSearchTerm(e.target.value);
                                                                    setFormData({
                                                                        ...formData,
                                                                        address: e.target.value
                                                                    });
                                                                    setShowSuggestions(true);
                                                                },
                                                                onFocus: ()=>setShowSuggestions(true),
                                                                placeholder: "Search or select location",
                                                                required: true,
                                                                className: "jsx-27e4e06839e145cb" + " " + "w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 916,
                                                                columnNumber: 21
                                                            }, this),
                                                            showSuggestions && filteredAreas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-27e4e06839e145cb" + " " + "absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto",
                                                                children: filteredAreas.map((area, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleAreaSelect(area),
                                                                        className: "jsx-27e4e06839e145cb" + " " + "w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 text-black",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-27e4e06839e145cb" + " " + "flex items-center",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                                    className: "w-4 h-4 mr-2 text-blue-600"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                                    lineNumber: 938,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-27e4e06839e145cb",
                                                                                    children: area
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                                    lineNumber: 939,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                                            lineNumber: 937,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, index, false, {
                                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                                        lineNumber: 932,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 930,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 914,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 909,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-27e4e06839e145cb",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "flex items-center text-sm font-semibold text-gray-700 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                                className: "w-4 h-4 mr-2 text-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 951,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Property Type *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 950,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                name: "flatType",
                                                                value: formData.flatType,
                                                                onChange: handleChange,
                                                                required: true,
                                                                className: "jsx-27e4e06839e145cb" + " " + "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-black",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        className: "jsx-27e4e06839e145cb",
                                                                        children: "Select property type"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                                        lineNumber: 962,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    FLAT_TYPES.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: type,
                                                                            className: "jsx-27e4e06839e145cb",
                                                                            children: type
                                                                        }, type, false, {
                                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                                            lineNumber: 964,
                                                                            columnNumber: 25
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 955,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-27e4e06839e145cb" + " " + "absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    className: "jsx-27e4e06839e145cb" + " " + "w-5 h-5 text-gray-400",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M19 9l-7 7-7-7",
                                                                        className: "jsx-27e4e06839e145cb"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                                        lineNumber: 971,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 970,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 969,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 954,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 949,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-27e4e06839e145cb",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "flex items-center text-sm font-semibold text-gray-700 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                                className: "w-4 h-4 mr-2 text-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 980,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Budget Range *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 979,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-27e4e06839e145cb" + " " + "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                name: "budget",
                                                                value: formData.budget,
                                                                onChange: handleChange,
                                                                required: true,
                                                                className: "jsx-27e4e06839e145cb" + " " + "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-black",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        className: "jsx-27e4e06839e145cb",
                                                                        children: "Select budget range"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                                        lineNumber: 991,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    BUDGET_RANGES.map((range)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: range.value,
                                                                            className: "jsx-27e4e06839e145cb",
                                                                            children: range.label
                                                                        }, range.value, false, {
                                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                                            lineNumber: 993,
                                                                            columnNumber: 25
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 984,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-27e4e06839e145cb" + " " + "absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    className: "jsx-27e4e06839e145cb" + " " + "w-5 h-5 text-gray-400",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M19 9l-7 7-7-7",
                                                                        className: "jsx-27e4e06839e145cb"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                                        lineNumber: 1000,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                                    lineNumber: 999,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                                lineNumber: 998,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                                        lineNumber: 983,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 978,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleSubmit,
                                                disabled: loading,
                                                className: "jsx-27e4e06839e145cb" + " " + "w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6",
                                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-27e4e06839e145cb" + " " + "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 1014,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-27e4e06839e145cb",
                                                            children: "Submitting..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 1015,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 1019,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-27e4e06839e145cb",
                                                            children: "Submit Enquiry"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                                            lineNumber: 1020,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 1007,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                        lineNumber: 867,
                                        columnNumber: 15
                                    }, this),
                                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-27e4e06839e145cb" + " " + `mt-6 p-4 rounded-xl flex items-start space-x-3 ${message.type === 'success' ? 'bg-green-50 border-2 border-green-200 text-green-700' : 'bg-red-50 border-2 border-red-200 text-red-700'}`,
                                        children: [
                                            message.type === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                className: "w-5 h-5 flex-shrink-0 mt-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 1036,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-5 h-5 flex-shrink-0 mt-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 1038,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-27e4e06839e145cb" + " " + "font-medium",
                                                children: message.text
                                            }, void 0, false, {
                                                fileName: "[project]/app/enquiry-form/page.tsx",
                                                lineNumber: 1040,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                        lineNumber: 1028,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-27e4e06839e145cb" + " " + "mt-6 pt-6 border-t-2 border-gray-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-27e4e06839e145cb" + " " + "text-xs text-gray-600 text-center",
                                            children: [
                                                "By submitting this form, you agree to our",
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-27e4e06839e145cb" + " " + "text-blue-600 font-semibold cursor-pointer hover:text-blue-700",
                                                    children: "Terms & Conditions"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                    lineNumber: 1048,
                                                    columnNumber: 19
                                                }, this),
                                                ' ',
                                                "and",
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-27e4e06839e145cb" + " " + "text-blue-600 font-semibold cursor-pointer hover:text-blue-700",
                                                    children: "Privacy Policy"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/enquiry-form/page.tsx",
                                                    lineNumber: 1052,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/enquiry-form/page.tsx",
                                            lineNumber: 1046,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/enquiry-form/page.tsx",
                                        lineNumber: 1045,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/enquiry-form/page.tsx",
                                lineNumber: 863,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/enquiry-form/page.tsx",
                            lineNumber: 862,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/enquiry-form/page.tsx",
                    lineNumber: 813,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/enquiry-form/page.tsx",
                lineNumber: 812,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/enquiry-form/page.tsx",
        lineNumber: 802,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_enquiry-form_page_tsx_d370b394._.js.map