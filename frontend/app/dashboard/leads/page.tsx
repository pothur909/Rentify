

// 'use client'

// import {
//   Users,
//   Phone,
//   Calendar,
//   TrendingUp,
//   Search,
//   Filter,
//   MoreVertical,
//   MapPin,
//   X,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useAuthContext } from "@/app/context/AuthContext";

// const baseurl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";

// export default function LeadsPage() {
//   const { broker, token, isAuthenticated } = useAuthContext();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [leads, setLeads] = useState<any[]>([]);
//   const [packageInfo, setPackageInfo] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // remark modal state
//   const [showRemarkModal, setShowRemarkModal] = useState(false);
//   const [selectedLeadForRemark, setSelectedLeadForRemark] = useState<any | null>(null);
//   const [remarkText, setRemarkText] = useState("");

//   // view modal state
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedLeadForView, setSelectedLeadForView] = useState<any | null>(null);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "new":
//         return "bg-blue-100 text-blue-700";
//       case "contacted":
//         return "bg-purple-100 text-purple-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   // map backend status to UI status
//   const getUiStatus = (lead: any) => {
//     if (lead.status === "contacted") return "contacted";
//     if (lead.status === "assigned") return "new";
//     return "new"; // treat others as open/new
//   };

//   const maskName = (lead: any) => {
//     if (lead.status === "contacted" && lead.name) return lead.name;

//     if (lead.name) return lead.name.slice(0, 3) + "**";
//     return "Lead**";
//   };

//   const maskPhone = (lead: any) => {
//     if (lead.status === "contacted" && lead.phoneNumber) return lead.phoneNumber;
//     return "+91**********";
//   };

//   const formatBudget = (budget: number | undefined) => {
//     if (!budget && budget !== 0) return "-";
//     return `₹${budget.toLocaleString()}`;
//   };

//   const formatDate = (lead: any) => {
//     const d = lead.assignedAt || lead.createdAt;
//     if (!d) return "-";
//     return new Date(d).toLocaleDateString();
//   };

//   // fetch assigned leads
//   useEffect(() => {
//     if (!isAuthenticated || !broker) return;

//     const fetchLeads = async () => {
//       try {
//         const brokerId = broker._id;

//         const res = await fetch(
//           `${baseurl}/api/brokers/${brokerId}/assigned-leads`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               // Authorization: `Bearer ${token}`, // if you secure it later
//             },
//           }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           setError(data.message || "Failed to fetch leads");
//           setLoading(false);
//           return;
//         }

//         setLeads(data.data || []);
//         setPackageInfo(data.packageInfo || null);
//         setLoading(false);
//       } catch (e) {
//         console.error(e);
//         setError("Network error while fetching leads");
//         setLoading(false);
//       }
//     };

//     fetchLeads();
//   }, [isAuthenticated, broker, token]);

//   // shared reveal function: update state and return revealed lead
//   const revealLeadAndUpdateState = async (leadId: string) => {
//     try {
//       const res = await fetch(`${baseurl}/api/leads/${leadId}/reveal`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         console.error(data);
//         return null;
//       }

//       const revealed = data.data; // {_id, name, phoneNumber, status}
//       setLeads((prev) =>
//         prev.map((l) => (l._id === revealed._id ? { ...l, ...revealed } : l))
//       );

//       return revealed;
//     } catch (e) {
//       console.error(e);
//       return null;
//     }
//   };

//   // VIEW: open modal, no status change
//   const handleViewLead = (lead: any) => {
//     setSelectedLeadForView(lead);
//     setShowViewModal(true);
//   };

//   const closeViewModal = () => {
//     setShowViewModal(false);
//     setSelectedLeadForView(null);
//   };

//   // reveal inside view modal (changes status to contacted)
//   const handleRevealInViewModal = async () => {
//     if (!selectedLeadForView?._id) return;
//     const revealed = await revealLeadAndUpdateState(selectedLeadForView._id);
//     if (revealed) {
//       setSelectedLeadForView((prev: any) =>
//         prev ? { ...prev, ...revealed } : revealed
//       );
//     }
//   };

//   // CALL: reveal + mark contacted + dial
//   const handleCallLead = async (lead: any) => {
//     if (lead.status === "contacted" && lead.phoneNumber) {
//       window.location.href = `tel:${lead.phoneNumber}`;
//       return;
//     }

//     const revealed = await revealLeadAndUpdateState(lead._id);
//     if (revealed?.phoneNumber) {
//       window.location.href = `tel:${revealed.phoneNumber}`;
//     }
//   };

//   // remark handlers
//   const openRemarkModal = (lead: any) => {
//     setSelectedLeadForRemark(lead);
//     setRemarkText(lead.remark || "");
//     setShowRemarkModal(true);
//   };

//   const closeRemarkModal = () => {
//     setShowRemarkModal(false);
//     setSelectedLeadForRemark(null);
//     setRemarkText("");
//   };

//   const handleSaveRemark = async () => {
//     if (!selectedLeadForRemark?._id) return;

//     try {
//       const res = await fetch(
//         `${baseurl}/api/leads/${selectedLeadForRemark._id}/remark`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ remark: remarkText }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         console.error(data);
//         return;
//       }

//       const updated = data.data;
//       setLeads((prev) =>
//         prev.map((l) => (l._id === updated._id ? { ...l, ...updated } : l))
//       );
//       closeRemarkModal();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   // stats
//   const totalLeads = leads.length;
//   const contactedCount = leads.filter((l) => l.status === "contacted").length;
//   const openCount = leads.filter((l) => l.status === "assigned").length;
//   const totalPackageLeads = packageInfo?.leadLimit || 0;
//   const upcomingLeads = packageInfo?.leadsRemaining || 0;

//   const stats = {
//     total: totalLeads,
//     contacted: contactedCount,
//     upcoming: upcomingLeads,
//     openTotal: openCount,
//   };

//   const statCards = [
//     {
//       title: "Total Leads",
//       value: stats.total,
//       icon: Users,
//       gradient: "from-blue-500 to-blue-600",
//       bg: "bg-blue-50",
//       iconBg: "bg-blue-500",
//       change: stats.total,
//       changeType: "increase",
//     },
//     {
//       title: "Contacted",
//       value: stats.contacted,
//       icon: Phone,
//       gradient: "from-purple-500 to-purple-600",
//       bg: "bg-purple-50",
//       iconBg: "bg-purple-500",
//       change: stats.contacted,
//       changeType: "increase",
//     },
//     {
//       title: "Upcoming Leads",
//       value: stats.upcoming,
//       icon: Calendar,
//       gradient: "from-orange-500 to-orange-600",
//       bg: "bg-orange-50",
//       iconBg: "bg-orange-500",
//       change: stats.upcoming,
//       changeType: "increase",
//     },
//     {
//       title: "New Leads",
//       value: stats.openTotal,
//       icon: TrendingUp,
//       gradient: "from-green-500 to-green-600",
//       bg: "bg-green-50",
//       iconBg: "bg-green-500",
//       change: stats.openTotal,
//       changeType: "increase",
//     },
//   ];

//   // filter
//   // const filteredLeads = leads
//   //   .filter((lead) => {
//   //     const term = searchTerm.toLowerCase();
//   //     const name = lead.name || "";
//   //     const phone = lead.phoneNumber || "";
//   //     const location = lead.address || lead.areaKey || "";
//   //     return (
//   //       name.toLowerCase().includes(term) ||
//   //       phone.toLowerCase().includes(term) ||
//   //       location.toLowerCase().includes(term)
//   //     );
//   //   })
//   //   .filter((lead) => {
//   //     const uiStatus = getUiStatus(lead);
//   //     if (filterStatus === "all") return true;
//   //     if (filterStatus === "new") return uiStatus === "open";
//   //     if (filterStatus === "contacted") return uiStatus === "contacted";
//   //     return true;
//   //   });

//   const filteredLeads = leads
//   .filter((lead) => {
//     const term = searchTerm.toLowerCase();
//     const name = lead.name || "";
//     const phone = lead.phoneNumber || "";
//     const location = lead.address || lead.areaKey || "";
//     return (
//       name.toLowerCase().includes(term) ||
//       phone.toLowerCase().includes(term) ||
//       location.toLowerCase().includes(term)
//     );
//   })
//   .filter((lead) => {
//     if (filterStatus === "all") return true;

//     if (filterStatus === "new") {
//       // new = assigned (not contacted yet)
//       return lead.status === "assigned";
//     }

//     if (filterStatus === "contacted") {
//       return lead.status === "contacted";
//     }

//     if (filterStatus === "upcoming") {
//       // you can decide what upcoming means; for now, nothing
//       return false;
//     }

//     if (filterStatus === "converted") {
//       // if you later use closed as converted:
//       return lead.status === "closed";
//     }

//     return true;
//   });


//   if (loading) {
//     return <div className="p-6 text-gray-700">Loading leads...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-red-600">{error}</div>;
//   }

//   if (!isAuthenticated || !broker) {
//     return (
//       <div className="p-6 text-gray-700">
//         Please login as broker to view leads.
//       </div>
//     );
//   }

//   return (
//     <div className="text-gray-800">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           Leads Management
//         </h1>
//         <p className="text-gray-600">
//           Track and manage all your property leads in one place.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {statCards.map((card) => (
//           <div
//             key={card.title}
//             className={`${card.bg} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className={`p-3 rounded-xl ${card.iconBg} shadow-lg`}>
//                 <card.icon className="w-6 h-6 text-white" />
//               </div>
//               <span
//                 className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                   card.changeType === "increase"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//               >
//                 +{card.change}
//               </span>
//             </div>
//             <h3 className="text-gray-600 text-sm font-medium mb-1">
//               {card.title}
//             </h3>
//             <p
//               className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
//             >
//               {card.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search leads by name, phone, or location..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div className="flex gap-3">
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//             >
//               <option value="all">All Status</option>
//               <option value="new">New</option>
//               <option value="contacted">Contacted</option>
//               <option value="upcoming">Upcoming</option>
//               <option value="converted">Converted</option>
//             </select>
//             <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2">
//               <Filter className="w-5 h-5" />
//               Filter
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Leads Table */}
//       <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
//         <div className="p-6 border-b border-gray-100 flex items-center justify-between">
//           <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
//           <p className="text-sm text-gray-500">
//             New leads: <span className="font-semibold">{stats.openTotal}</span>
//           </p>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Lead Info
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Contact
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Budget
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredLeads.map((lead) => {
//                 const uiStatus = getUiStatus(lead);

//                 return (
//                   <tr
//                     key={lead._id}
//                     className="hover:bg-gray-50 transition-colors duration-150"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
//                           {lead.status === "contacted" && lead.name
//                             ? lead.name.charAt(0)
//                             : "L"}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900">
//                             {maskName(lead)}
//                           </p>
//                           <p className="text-sm text-gray-500 flex items-center gap-1">
//                             <MapPin className="w-3 h-3" />
//                             {lead.address || lead.areaKey || "Location hidden"}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col gap-1">
//                         <p className="text-sm text-gray-700 flex items-center gap-2">
//                           <Phone className="w-4 h-4 text-gray-400" />
//                           {maskPhone(lead)}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-sm font-medium text-gray-900">
//                         {formatBudget(lead.budget)}
//                       </p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
//                           uiStatus
//                         )}`}
//                       >
//                         {uiStatus.charAt(0).toUpperCase() + uiStatus.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-sm text-gray-600">
//                         {formatDate(lead)}
//                       </p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         {/* View: modal, no status change */}
//                         <button
//                           onClick={() => handleViewLead(lead)}
//                           className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//                         >
//                           View
//                         </button>

//                         {/* Call: reveal + contacted + dial */}
//                         <button
//                           onClick={() => handleCallLead(lead)}
//                           className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
//                         >
//                           <Phone className="w-3 h-3" />
//                           Call
//                         </button>

//                         {/* Remark button */}
//                         <button
//                           onClick={() => openRemarkModal(lead)}
//                           className="px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
//                         >
//                           Remark
//                         </button>

//                         <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
//                           <MoreVertical className="w-5 h-5 text-gray-400" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {filteredLeads.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-6 text-center text-gray-500 text-sm"
//                   >
//                     No leads to display.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* View Modal */}
//       {showViewModal && selectedLeadForView && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
//             <button
//               onClick={closeViewModal}
//               className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//             <h3 className="text-lg font-semibold text-gray-900 mb-3">
//               Lead Details
//             </h3>
//             <div className="space-y-2 text-sm text-gray-700">
//               <div>
//                 <span className="font-semibold">Name: </span>
//                 {selectedLeadForView.status === "contacted"
//                   ? selectedLeadForView.name || "-"
//                   : maskName(selectedLeadForView)}
//               </div>
//               <div>
//                 <span className="font-semibold">Phone: </span>
//                 {selectedLeadForView.status === "contacted"
//                   ? selectedLeadForView.phoneNumber || "-"
//                   : maskPhone(selectedLeadForView)}
//               </div>
//               <div>
//                 <span className="font-semibold">Location: </span>
//                 {selectedLeadForView.address ||
//                   selectedLeadForView.areaKey ||
//                   "-"}
//               </div>
//               <div>
//                 <span className="font-semibold">Budget: </span>
//                 {formatBudget(selectedLeadForView.budget)}
//               </div>
//               <div>
//                 <span className="font-semibold">Status: </span>
//                 {selectedLeadForView.status}
//               </div>
//               <div>
//                 <span className="font-semibold">Remark: </span>
//                 {selectedLeadForView.remark || "-"}
//               </div>
//               <div>
//                 <span className="font-semibold">Assigned At: </span>
//                 {formatDate(selectedLeadForView)}
//               </div>
//             </div>
//             <div className="mt-4 flex justify-end gap-3">
//               <button
//                 onClick={closeViewModal}
//                 className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
//               >
//                 Close
//               </button>
//               {selectedLeadForView.status !== "contacted" && (
//                 <button
//                   onClick={handleRevealInViewModal}
//                   className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700"
//                 >
//                   Reveal details
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Remark Modal */}
//       {showRemarkModal && selectedLeadForRemark && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
//             <button
//               onClick={closeRemarkModal}
//               className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Add Remark
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Lead: {maskName(selectedLeadForRemark)} |{" "}
//               {selectedLeadForRemark.address || selectedLeadForRemark.areaKey}
//             </p>
//             <textarea
//               rows={4}
//               value={remarkText}
//               onChange={(e) => setRemarkText(e.target.value)}
//               placeholder="Type your remark here..."
//               className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             <div className="mt-4 flex justify-end gap-3">
//               <button
//                 onClick={closeRemarkModal}
//                 className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveRemark}
//                 className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Save Remark
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import {
  Users,
  Phone,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  X,
  Menu,
  LayoutGrid,
  User as UserIcon,
  BookOpen,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const baseurl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";

export default function LeadsPage() {
  const { broker, token, isAuthenticated, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [leads, setLeads] = useState<any[]>([]);
  const [packageInfo, setPackageInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedLeadForRemark, setSelectedLeadForRemark] = useState<any | null>(null);
  const [remarkText, setRemarkText] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLeadForView, setSelectedLeadForView] = useState<any | null>(null);

  const mobileMenu = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
    { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
    { label: "Logout", href: "/logout", icon: LogOut, action: logout },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getUiStatus = (lead: any) => {
    if (lead.status === "contacted") return "contacted";
    if (lead.status === "assigned") return "new";
    return "new";
  };

  const maskName = (lead: any) => {
    if (lead.status === "contacted" && lead.name) return lead.name;
    if (lead.name) return lead.name.slice(0, 3) + "**";
    return "Lead**";
  };

  const maskPhone = (lead: any) => {
    if (lead.status === "contacted" && lead.phoneNumber) return lead.phoneNumber;
    return "+91**********";
  };

  const formatBudget = (budget: number | undefined) => {
    if (!budget && budget !== 0) return "-";
    return `₹${budget.toLocaleString()}`;
  };

  const formatDate = (lead: any) => {
    const d = lead.assignedAt || lead.createdAt;
    if (!d) return "-";
    return new Date(d).toLocaleDateString();
  };

  useEffect(() => {
    if (!isAuthenticated || !broker) return;

    const fetchLeads = async () => {
      try {
        const brokerId = broker._id;

        const res = await fetch(
          `${baseurl}/api/brokers/${brokerId}/assigned-leads`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch leads");
          setLoading(false);
          return;
        }

        setLeads(data.data || []);
        setPackageInfo(data.packageInfo || null);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Network error while fetching leads");
        setLoading(false);
      }
    };

    fetchLeads();
  }, [isAuthenticated, broker, token]);

  const revealLeadAndUpdateState = async (leadId: string) => {
    try {
      const res = await fetch(`${baseurl}/api/leads/${leadId}/reveal`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return null;
      }

      const revealed = data.data;
      setLeads((prev) =>
        prev.map((l) => (l._id === revealed._id ? { ...l, ...revealed } : l))
      );

      return revealed;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleViewLead = (lead: any) => {
    setSelectedLeadForView(lead);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedLeadForView(null);
  };

  const handleRevealInViewModal = async () => {
    if (!selectedLeadForView?._id) return;
    const revealed = await revealLeadAndUpdateState(selectedLeadForView._id);
    if (revealed) {
      setSelectedLeadForView((prev: any) =>
        prev ? { ...prev, ...revealed } : revealed
      );
    }
  };

  const handleCallLead = async (lead: any) => {
    if (lead.status === "contacted" && lead.phoneNumber) {
      window.location.href = `tel:${lead.phoneNumber}`;
      return;
    }

    const revealed = await revealLeadAndUpdateState(lead._id);
    if (revealed?.phoneNumber) {
      window.location.href = `tel:${revealed.phoneNumber}`;
    }
  };

  const openRemarkModal = (lead: any) => {
    setSelectedLeadForRemark(lead);
    setRemarkText(lead.remark || "");
    setShowRemarkModal(true);
  };

  const closeRemarkModal = () => {
    setShowRemarkModal(false);
    setSelectedLeadForRemark(null);
    setRemarkText("");
  };

  const handleSaveRemark = async () => {
    if (!selectedLeadForRemark?._id) return;

    try {
      const res = await fetch(
        `${baseurl}/api/leads/${selectedLeadForRemark._id}/remark`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ remark: remarkText }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      const updated = data.data;
      setLeads((prev) =>
        prev.map((l) => (l._id === updated._id ? { ...l, ...updated } : l))
      );
      closeRemarkModal();
    } catch (e) {
      console.error(e);
    }
  };

  const totalLeads = leads.length;
  const contactedCount = leads.filter((l) => l.status === "contacted").length;
  const openCount = leads.filter((l) => l.status === "assigned").length;
  const totalPackageLeads = packageInfo?.leadLimit || 0;
  const upcomingLeads = packageInfo?.leadsRemaining || 0;

  const stats = {
    total: totalLeads,
    contacted: contactedCount,
    upcoming: upcomingLeads,
    openTotal: openCount,
  };

  const statCards = [
    {
      title: "Total Leads",
      value: stats.total,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
      change: stats.total,
      changeType: "increase",
    },
    {
      title: "Contacted",
      value: stats.contacted,
      icon: Phone,
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-500",
      change: stats.contacted,
      changeType: "increase",
    },
    {
      title: "Upcoming Leads",
      value: stats.upcoming,
      icon: Calendar,
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      iconBg: "bg-orange-500",
      change: stats.upcoming,
      changeType: "increase",
    },
    {
      title: "New Leads",
      value: stats.openTotal,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
      change: stats.openTotal,
      changeType: "increase",
    },
  ];

  const filteredLeads = leads
    .filter((lead) => {
      const term = searchTerm.toLowerCase();
      const name = lead.name || "";
      const phone = lead.phoneNumber || "";
      const location = lead.address || lead.areaKey || "";
      return (
        name.toLowerCase().includes(term) ||
        phone.toLowerCase().includes(term) ||
        location.toLowerCase().includes(term)
      );
    })
    .filter((lead) => {
      if (filterStatus === "all") return true;

      if (filterStatus === "new") {
        return lead.status === "assigned";
      }

      if (filterStatus === "contacted") {
        return lead.status === "contacted";
      }

      if (filterStatus === "upcoming") {
        return false;
      }

      if (filterStatus === "converted") {
        return lead.status === "closed";
      }

      return true;
    });

  if (loading) {
    return <div className="p-6 text-gray-700">Loading leads...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!isAuthenticated || !broker) {
    return (
      <div className="p-6 text-gray-700">
        Please login as broker to view leads.
      </div>
    );
  }

  return (
    <div className="text-gray-800 w-full max-w-full overflow-x-hidden">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 mb-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Hello</p>
            <p className="text-base font-semibold text-gray-900">
              {broker?.name || "Broker"}
            </p>
            <p className="text-xs text-gray-500">Leads dashboard</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl border border-gray-200 shadow-sm bg-white flex items-center gap-2"
          >
            <Menu className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Menu</span>
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="mb-8 hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Leads Management
        </h1>
        <p className="text-gray-600">
          Track and manage all your property leads in one place.
        </p>
      </div>

      {/* Mobile heading */}
      <div className="mb-4 lg:hidden px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Leads Management
        </h1>
        <p className="text-sm text-gray-600">
          Track and manage all your property leads.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 max-md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 px-4 lg:px-0">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} rounded-2xl p-4 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.iconBg} shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  card.changeType === "increase"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                +{card.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {card.title}
            </h3>
            <p
              className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-md border border-gray-100 mb-6 mx-4 lg:mx-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="upcoming">Upcoming</option>
              <option value="converted">Converted</option>
            </select>
            <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mx-4 lg:mx-0 mb-8">
        <div className="p-4 lg:p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">
            Recent Leads
          </h2>
          <p className="text-xs lg:text-sm text-gray-500">
            New leads: <span className="font-semibold">{stats.openTotal}</span>
          </p>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lead Info
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => {
                const uiStatus = getUiStatus(lead);

                return (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {lead.status === "contacted" && lead.name
                            ? lead.name.charAt(0)
                            : "L"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {maskName(lead)}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.address || lead.areaKey || "Location hidden"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs lg:text-sm text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {maskPhone(lead)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {formatBudget(lead.budget)}
                      </p>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          uiStatus
                        )}`}
                      >
                        {uiStatus.charAt(0).toUpperCase() + uiStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <p className="text-xs lg:text-sm text-gray-600">
                        {formatDate(lead)}
                      </p>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleCallLead(lead)}
                          className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </button>

                        <button
                          onClick={() => openRemarkModal(lead)}
                          className="px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          Remark
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-6 text-center text-gray-500 text-sm"
                  >
                    No leads to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedLeadForView && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeViewModal}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Lead Details
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Name: </span>
                {selectedLeadForView.status === "contacted"
                  ? selectedLeadForView.name || "-"
                  : maskName(selectedLeadForView)}
              </div>
              <div>
                <span className="font-semibold">Phone: </span>
                {selectedLeadForView.status === "contacted"
                  ? selectedLeadForView.phoneNumber || "-"
                  : maskPhone(selectedLeadForView)}
              </div>
              <div>
                <span className="font-semibold">Location: </span>
                {selectedLeadForView.address ||
                  selectedLeadForView.areaKey ||
                  "-"}
              </div>
              <div>
                <span className="font-semibold">Budget: </span>
                {formatBudget(selectedLeadForView.budget)}
              </div>
              <div>
                <span className="font-semibold">Status: </span>
                {selectedLeadForView.status}
              </div>
              <div>
                <span className="font-semibold">Remark: </span>
                {selectedLeadForView.remark || "-"}
              </div>
              <div>
                <span className="font-semibold">Assigned At: </span>
                {formatDate(selectedLeadForView)}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedLeadForView.status !== "contacted" && (
                <button
                  onClick={handleRevealInViewModal}
                  className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Reveal details
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Remark Modal */}
      {showRemarkModal && selectedLeadForRemark && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeRemarkModal}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add Remark
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Lead: {maskName(selectedLeadForRemark)} |{" "}
              {selectedLeadForRemark.address || selectedLeadForRemark.areaKey}
            </p>
            <textarea
              rows={4}
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="Type your remark here..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={closeRemarkModal}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRemark}
                className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Remark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile slide in menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-blue-100">Broker</p>
                <p className="text-base font-semibold">
                  {broker?.name || "Broker"}
                </p>
                <p className="text-xs text-blue-100">
                  {broker?.phoneNumber}
                </p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="mt-2 mb-4 h-px bg-white/20" />

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {mobileMenu.map((item) => {
                const isActive = pathname === item.href;
                const isLogout = item.label === "Logout";

                const handleClick = () => {
                  setIsMobileMenuOpen(false);
                  if (item.action) {
                    item.action();
                    return;
                  }
                  router.push(item.href);
                };

                return (
                  <button
                    key={item.label}
                    onClick={handleClick}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-all ${
                      isActive
                        ? "bg-white text-blue-700 font-semibold"
                        : isLogout
                        ? "text-red-100 hover:bg-red-500/20"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-700" : "text-white"
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-white/20 text-xs text-blue-100 text-center">
              Powered by <span className="font-semibold text-white">Rentify</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

