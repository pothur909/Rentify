// "use client";

// import { useState } from "react";
// import { useAuthContext } from "@/app/context/AuthContext";

// export default function ProfilePage() {
//   const { broker, login } = useAuthContext();
//   const [name, setName] = useState(broker?.name || "");
//   const [address, setAddress] = useState("");

//   const saveProfile = () => {
//     // Update locally for now
//     if (broker) login(broker.token, { ...broker, name });
//     alert("Profile saved!");
//   };

//   return (
//     <div className="text-black">
//       <h1 className="text-2xl font-bold mb-4">Profile</h1>
//       <div className="max-w-md bg-white p-6 rounded shadow space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Phone Number</label>
//           <input
//             value={broker?.phoneNumber || ""}
//             disabled
//             className="mt-1 w-full border p-2 rounded bg-gray-100"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 w-full border p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Address</label>
//           <input
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             className="mt-1 w-full border p-2 rounded"
//           />
//         </div>
//         <button onClick={saveProfile} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Save
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from "react";
import { User, Phone, MapPin, Mail, Calendar, Briefcase, Award, Save, Edit2, Camera } from "lucide-react";

// Add this type/interface at the top if using TypeScript
// interface Broker {
//   name?: string;
//   phoneNumber?: string;
//   email?: string;
//   address?: string;
//   experience?: string;
//   specialization?: string;
//   joinDate?: string;
// }

export default function ProfilePage() {
  // IMPORTANT: Replace this with your actual context/hook
  // For example: const { broker, login } = useAuthContext();
  const broker = {
    phoneNumber: "+91 98765 43210",
    name: "Broker Name",
    email: "",
    address: "",
    experience: "",
    specialization: "",
    joinDate: "January 2020"
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: broker?.phoneNumber || "",
    name: broker?.name || "",
    email: broker?.email || "",
    address: broker?.address || "",
    experience: broker?.experience || "",
    specialization: broker?.specialization || "",
    joinDate: broker?.joinDate || "January 2020"
  });

  const [tempData, setTempData] = useState({ ...formData });

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...formData });
  };

  const handleSave = async () => {
    try {
      // IMPORTANT: Replace this with your actual API call
      // Example:
      // const response = await fetch('/api/broker/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: tempData.name,
      //     email: tempData.email,
      //     address: tempData.address,
      //     experience: tempData.experience,
      //     specialization: tempData.specialization
      //   })
      // });
      // 
      // if (!response.ok) throw new Error('Failed to update profile');
      // const updatedBroker = await response.json();
      
      // Update local state
      setFormData({ ...tempData });
      
      // IMPORTANT: Update your auth context/state
      // Example: login(broker.token, { ...broker, ...tempData });
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const stats = [
    { label: "Total Leads", value: "156", color: "from-blue-500 to-blue-600" },
    { label: "Conversions", value: "42", color: "from-green-500 to-green-600" },
    { label: "Success Rate", value: "27%", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Profile Header with Gradient */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 h-32 relative">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-xl">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                    <Camera className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 pb-6 px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name || "Broker Name"}</h2>
              <p className="text-gray-500 text-sm mb-4">Real Estate Broker</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                <Phone className="w-4 h-4" />
                <span>{formData.phoneNumber}</span>
              </div>
              {formData.email && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{formData.email}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="border-t border-gray-100 px-6 py-4">
              <div className="space-y-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Since */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since {formData.joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Phone Number
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Full Name
                  </div>
                </label>
                <input
                  type="text"
                  value={isEditing ? tempData.name : formData.name}
                  onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? 'border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  value={isEditing ? tempData.email : formData.email}
                  onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? 'border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Address
                  </div>
                </label>
                <input
                  type="text"
                  value={isEditing ? tempData.address : formData.address}
                  onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? 'border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    Experience
                  </div>
                </label>
                <input
                  type="text"
                  value={isEditing ? tempData.experience : formData.experience}
                  onChange={(e) => setTempData({ ...tempData, experience: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g., 5 years"
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? 'border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    Specialization
                  </div>
                </label>
                <input
                  type="text"
                  value={isEditing ? tempData.specialization : formData.specialization}
                  onChange={(e) => setTempData({ ...tempData, specialization: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g., Residential Properties"
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                    isEditing
                      ? 'border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Account Settings Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-md p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-orange-50 mb-4">
              Have questions about your account or need assistance? Our support team is here to help you.
            </p>
            <button className="bg-white text-orange-600 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}