


"use client";

import { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  Award,
  Save,
  Edit2,
  Camera,
  Menu,
  X,
  LayoutGrid,
  BookOpen,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function ProfilePage() {
  const { broker, login, logout, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const initialFormData = {
    phoneNumber: broker?.phoneNumber || "",
    name: broker?.name || "",
    email: broker?.email || "",
    address: broker?.address || "",
    experience: broker?.experience || "",
    specialization: broker?.specialization || "",
    joinDate: broker?.joinDate || "January 2020",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tempData, setTempData] = useState({ ...initialFormData });

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
      // TODO: replace with real API call
      // const res = await fetch("/api/broker/profile", {...})
      // const updated = await res.json();

      setFormData({ ...tempData });

      // If your login stores broker in context, update it here
      if (broker && login) {
        // assuming login(token, broker)
        // @ts-ignore if broker has token field
        login(broker.token, { ...broker, ...tempData });
      }

      setIsEditing(false);
      alert("Profile updated successfully");
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

  const mobileMenu = [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "Leads", href: "/dashboard/leads", icon: BookOpen },
    { label: "Packages", href: "/dashboard/packages", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Logout", href: "/logout", icon: LogOut, action: logout },
  ];

  if (!isAuthenticated || !broker) {
    return (
      <div className="p-6 text-gray-700">
        Please login as broker to view profile.
      </div>
    );
  }

  return (
    <div className="text-gray-800">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 mb-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Hello</p>
            <p className="text-base font-semibold text-gray-900">
              {formData.name || "Broker"}
            </p>
            <p className="text-xs text-gray-500">
              Profile
            </p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      {/* Mobile heading under header */}
      <div className="mb-4 lg:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
        <p className="text-sm text-gray-600">
          Manage your details and preferences.
        </p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {formData.name || "Broker Name"}
              </h2>
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
                    <span
                      className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
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
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm"
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
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Phone Number
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Phone number cannot be changed
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  value={isEditing ? tempData.name : formData.name}
                  onChange={(e) =>
                    setTempData({ ...tempData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                    isEditing
                      ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  value={isEditing ? tempData.email : formData.email}
                  onChange={(e) =>
                    setTempData({ ...tempData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                    isEditing
                      ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Address
                  </span>
                </label>
                <input
                  type="text"
                  value={isEditing ? tempData.address : formData.address}
                  onChange={(e) =>
                    setTempData({ ...tempData, address: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                    isEditing
                      ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    Experience
                  </span>
                </label>
                <input
                  type="text"
                  value={isEditing ? tempData.experience : formData.experience}
                  onChange={(e) =>
                    setTempData({ ...tempData, experience: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="e.g., 5 years"
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                    isEditing
                      ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    Specialization
                  </span>
                </label>
                <input
                  type="text"
                  value={
                    isEditing ? tempData.specialization : formData.specialization
                  }
                  onChange={(e) =>
                    setTempData({
                      ...tempData,
                      specialization: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  placeholder="e.g., Residential Properties"
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                    isEditing
                      ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Help / Support Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-md p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-orange-50 mb-4 text-sm">
              Have questions about your account or need assistance? Our support
              team is here to help you.
            </p>
            <button className="bg-white text-orange-600 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>

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
                  {formData.name || "Broker"}
                </p>
                <p className="text-xs text-blue-100">
                  {formData.phoneNumber}
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
                        : "text-white/90 hover:bg白/10"
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
