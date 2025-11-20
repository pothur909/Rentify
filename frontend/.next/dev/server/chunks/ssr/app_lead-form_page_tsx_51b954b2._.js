module.exports = [
"[project]/app/lead-form/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s([
    "default",
    ()=>LeadFormPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';
function LeadFormPage() {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        phoneNumber: '+91',
        address: '',
        budget: '',
        flatType: ''
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Ensure phone number starts with +91 and only 10 digits after
    const handlePhoneChange = (e)=>{
        let value = e.target.value;
        // Auto-add +91 if missing
        if (!value.startsWith('+91')) {
            value = '+91' + value.replace(/^\+?/, '');
        }
        // Remove non-digit characters except '+'
        value = '+91' + value.slice(3).replace(/\D/g, '');
        // Limit to 10 digits after +91
        if (value.length > 13) {
            value = value.slice(0, 13);
        }
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
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setMessage('');
        // Validate phone number
        const phoneRegex = /^\+91\d{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setMessage('Phone number must be 10 digits after +91.');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${baseurl}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    budget: formData.budget ? Number(formData.budget) : undefined
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Lead created successfully!');
                setFormData({
                    name: '',
                    phoneNumber: '+91',
                    address: '',
                    budget: '',
                    flatType: ''
                });
            } else {
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (err) {
            console.error(err);
            setMessage('Network error.');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg text-black bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-6",
                children: "Create Lead"
            }, void 0, false, {
                fileName: "[project]/app/lead-form/page.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block mb-1 font-medium",
                                children: "Name*"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                name: "name",
                                value: formData.name,
                                onChange: handleChange,
                                required: true,
                                className: "w-full border p-2 rounded"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/lead-form/page.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block mb-1 font-medium",
                                children: "Phone Number*"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "tel",
                                name: "phoneNumber",
                                value: formData.phoneNumber,
                                onChange: handleChange,
                                required: true,
                                className: "w-full border p-2 rounded",
                                maxLength: 13
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-1",
                                children: "Format: +911234567890"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/lead-form/page.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block mb-1 font-medium",
                                children: "Address"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                name: "address",
                                value: formData.address,
                                onChange: handleChange,
                                className: "w-full border p-2 rounded"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/lead-form/page.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block mb-1 font-medium",
                                children: "Budget"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                name: "budget",
                                value: formData.budget,
                                onChange: handleChange,
                                className: "w-full border p-2 rounded"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/lead-form/page.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block mb-1 font-medium",
                                children: "Flat Type"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                name: "flatType",
                                value: formData.flatType,
                                onChange: handleChange,
                                className: "w-full border p-2 rounded"
                            }, void 0, false, {
                                fileName: "[project]/app/lead-form/page.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/lead-form/page.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: loading,
                        className: "w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600",
                        children: loading ? 'Submitting...' : 'Create Lead'
                    }, void 0, false, {
                        fileName: "[project]/app/lead-form/page.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/lead-form/page.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-center",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/lead-form/page.tsx",
                lineNumber: 281,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/lead-form/page.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_lead-form_page_tsx_51b954b2._.js.map