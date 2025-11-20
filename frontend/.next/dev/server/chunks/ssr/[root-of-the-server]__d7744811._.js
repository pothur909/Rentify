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
"[project]/app/lead-form/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

// // File: app/lead-form/page.tsx
// 'use client';
// import { useState } from 'react';
// export default function LeadFormPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     phoneNumber: '',
//     address: '',
//     budget: '',
//     flatType: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//       const response = await fetch('/api/leads', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           budget: formData.budget ? Number(formData.budget) : undefined,
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessage('Lead created successfully!');
//         setFormData({ name: '', phoneNumber: '', address: '', budget: '', flatType: '' });
//       } else {
//         setMessage(data.message || 'Something went wrong.');
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('Network error.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white text-black">
//       <h1 className="text-2xl font-bold mb-6">Create Lead</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1 font-medium">Name*</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Phone Number*</label>
//           <input
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             required
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Address</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Budget</label>
//           <input
//             type="number"
//             name="budget"
//             value={formData.budget}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Flat Type</label>
//           <input
//             type="text"
//             name="flatType"
//             value={formData.flatType}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           {loading ? 'Submitting...' : 'Create Lead'}
//         </button>
//       </form>
//       {message && <p className="mt-4 text-center">{message}</p>}
//     </div>
//   );
// }
}),
"[project]/app/lead-form/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/lead-form/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d7744811._.js.map