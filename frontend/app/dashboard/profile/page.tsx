

"use client";

import { useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Save,
  Edit2,
  Camera,
  Menu,
  X,
  LayoutGrid,
  BookOpen,
  CreditCard,
  LogOut,
  Search,
  Home,
  Calendar,
} from "lucide-react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

type LocationOption = {
  display_name: string;
  area_name: string;
  lat: string;
  lon: string;
  is_base_area: boolean;
};

const FLAT_TYPES = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "Villa"];

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000";

export default function ProfilePage() {
  const { broker, token, login, logout, isAuthenticated } =
    useAuthContext() as any;
  const router = useRouter();
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    address: "",
    monthlyFlatsAvailable: "",
    customerExpectations: "",
  });

  const [tempData, setTempData] = useState({ ...formData });

  const [serviceAreas, setServiceAreas] = useState<string[]>([""]);
  const [availableFlatTypes, setAvailableFlatTypes] = useState<string[]>([
    "",
  ]);

  // profile image state - NEW
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // geo states per service area
  const [areaSearchTerms, setAreaSearchTerms] = useState<string[]>([""]);
  const [areaShowSuggestions, setAreaShowSuggestions] = useState<
    boolean[]
  >([false]);
  const [areaLocationSuggestions, setAreaLocationSuggestions] =
    useState<LocationOption[][]>([[]]);
  const [areaIsSearching, setAreaIsSearching] = useState<boolean[]>([
    false,
  ]);
  const [areaSelectedBase, setAreaSelectedBase] = useState<
    (string | null)[]
  >([null]);
  const [areaShowSubLocations, setAreaShowSubLocations] = useState<
    boolean[]
  >([false]);

  const [stats, setStats] = useState<{
    totalLeads: number;
    conversions: number;
    successRate: string;
  }>({
    totalLeads: 0,
    conversions: 0,
    successRate: "0%",
  });

  useEffect(() => {
    if (!broker) return;

    const initialForm = {
      phoneNumber: broker.phoneNumber || "",
      name: broker.name || "",
      address: broker.address || "",
      monthlyFlatsAvailable: broker.monthlyFlatsAvailable
        ? String(broker.monthlyFlatsAvailable)
        : "",
      customerExpectations: broker.customerExpectations || "",
    };

    setFormData(initialForm);
    setTempData(initialForm);

    const areas =
      broker.serviceAreas && broker.serviceAreas.length
        ? broker.serviceAreas
        : [""];
    setServiceAreas(areas);
    setAreaSearchTerms(areas);
    setAreaShowSuggestions(new Array(areas.length).fill(false));
    setAreaLocationSuggestions(new Array(areas.length).fill([]));
    setAreaIsSearching(new Array(areas.length).fill(false));
    setAreaSelectedBase(new Array(areas.length).fill(null));
    setAreaShowSubLocations(new Array(areas.length).fill(false));

    const flats =
      broker.availableFlatTypes && broker.availableFlatTypes.length
        ? broker.availableFlatTypes
        : [""];
    setAvailableFlatTypes(flats);

    // init profile image from broker - NEW
    setProfileImage(broker.profilePicture || null);
  }, [broker?._id]);

  useEffect(() => {
    if (!broker?._id) return;

    const loadStats = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/brokers/${broker._id}/dashboard-stats`
        );
        const json = await res.json();
        if (!res.ok) return;

        const leads = json.data?.leads || {};
        const pkg = json.data?.package || {};

        const leadLimit = pkg.leadLimit || 0;
        const closed = leads.closed || 0;
        const assigned = leads.assigned || 0;
        const success =
          assigned > 0 ? Math.round((closed / assigned) * 100) : 0;

        setStats({
          totalLeads: leadLimit,
          conversions: closed,
          successRate: `${success}%`,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    loadStats();
  }, [broker?._id]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...formData });

    if (broker) {
      const areas =
        broker.serviceAreas && broker.serviceAreas.length
          ? broker.serviceAreas
          : [""];
      setServiceAreas(areas);
      setAreaSearchTerms(areas);
      setAreaShowSuggestions(new Array(areas.length).fill(false));
      setAreaLocationSuggestions(new Array(areas.length).fill([]));
      setAreaIsSearching(new Array(areas.length).fill(false));
      setAreaSelectedBase(new Array(areas.length).fill(null));
      setAreaShowSubLocations(new Array(areas.length).fill(false));

      const flats =
        broker.availableFlatTypes && broker.availableFlatTypes.length
          ? broker.availableFlatTypes
          : [""];
      setAvailableFlatTypes(flats);

      // reset profile image to broker value on cancel - NEW
      setProfileImage(broker.profilePicture || null);
    }
  };

  // upload to S3 using backend presigned URL - NEW
  const uploadProfileImageToS3 = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);

      const params = new URLSearchParams({
        fileName: file.name,
        fileType: file.type,
      });

      const res = await fetch(
        `${baseUrl}/api/s3/generateUrl?${params.toString()}`
      );
      if (!res.ok) {
        console.error("Failed to get presigned URL");
        return null;
      }

      const data = await res.json();
      const { signedUrl, fileUrl } = data;

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        console.error("Failed to upload image to S3");
        return null;
      }

      return fileUrl as string;
    } catch (err) {
      console.error("Error uploading profile image:", err);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // file input change handler - NEW
  const handleProfileImageChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const url = await uploadProfileImageToS3(file);
    if (!url) {
      alert("Failed to upload profile picture");
      return;
    }

    setProfileImage(url);
  };

  const handleSave = async () => {
    if (!broker?._id) return;

    try {
      const payload: any = {
        name: tempData.name,
        address: tempData.address,
        serviceAreas: serviceAreas
          .map(s => s.trim())
          .filter(s => s.length > 0),
        availableFlatTypes: availableFlatTypes
          .map(f => f.trim())
          .filter(f => f.length > 0),
        monthlyFlatsAvailable: tempData.monthlyFlatsAvailable
          ? Number(tempData.monthlyFlatsAvailable)
          : undefined,
        customerExpectations: tempData.customerExpectations || "",
      };

      // include profile picture if we have one - NEW
      if (profileImage) {
        payload.profilePicture = profileImage;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(
        `${baseUrl}/api/brokers/${broker._id}/profile`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Failed to update profile");
        return;
      }

      const updated = json.data;

      const newForm = {
        ...tempData,
        name: updated.name || tempData.name,
        address: updated.address || tempData.address,
        monthlyFlatsAvailable: updated.monthlyFlatsAvailable
          ? String(updated.monthlyFlatsAvailable)
          : "",
        customerExpectations: updated.customerExpectations || "",
      };

      setFormData(newForm);
      setTempData(newForm);

      const areas =
        updated.serviceAreas && updated.serviceAreas.length
          ? updated.serviceAreas
          : [""];
      setServiceAreas(areas);
      setAreaSearchTerms(areas);

      const flats =
        updated.availableFlatTypes &&
        updated.availableFlatTypes.length
          ? updated.availableFlatTypes
          : [""];
      setAvailableFlatTypes(flats);

      // update profile image from response if present - NEW
      if (updated.profilePicture) {
        setProfileImage(updated.profilePicture);
      }

      if (login && token) {
        login(token, {
          ...broker,
          ...updated,
        });
      }

      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const extractAreaName = (displayName: string, address: any): string => {
    const parts = displayName.split(",").map(p => p.trim());
    const genericTerms = [
      "bangalore",
      "bengaluru",
      "karnataka",
      "india",
      "bangalore urban",
      "bengaluru urban",
      "bangalore south",
      "bengaluru south",
      "south city corporation",
      "bengaluru south city corporation",
      "new tavarekere",
      "tavarekere",
    ];
    const isGeneric = (part: string): boolean => {
      const lower = part.toLowerCase();
      return (
        genericTerms.some(term => lower.includes(term)) ||
        /^\d{6}$/.test(part.trim())
      );
    };
    const hasSpecificInfo = (str: string): boolean => {
      const lower = str.toLowerCase();
      return /\b(sector|block|phase|stage)\b/i.test(lower);
    };
    const isRoadName = (str: string): boolean => {
      const lower = str.toLowerCase();
      return (
        /\b(road|street|cross|main|avenue|lane)\b/i.test(lower) &&
        !hasSpecificInfo(str)
      );
    };
    const isBusinessName = (str: string): boolean => {
      if (hasSpecificInfo(str)) return false;
      const businessIndicators =
        /\b(labs|pvt|ltd|bank|atm|hospital|school|mall|tower|plaza|complex|apartment|building)\b/i;
      return businessIndicators.test(str);
    };

    const meaningful: string[] = [];
    for (const part of parts) {
      if (isGeneric(part)) continue;
      if (isRoadName(part) || isBusinessName(part)) continue;
      if (/^\d+$/.test(part.trim())) continue;
      meaningful.push(part);
      if (
        meaningful.length >= 2 &&
        hasSpecificInfo(meaningful[meaningful.length - 1])
      ) {
        break;
      }
      if (meaningful.length === 1 && hasSpecificInfo(meaningful[0])) {
        continue;
      }
      if (meaningful.length >= 2) {
        break;
      }
    }
    if (meaningful.length > 0) return meaningful.join(" ");
    return parts[0] || displayName;
  };

  const isBaseArea = (areaName: string): boolean => {
    const lower = areaName.toLowerCase();
    return !/\b(sector|block|phase|stage)\b/.test(lower);
  };

  const fetchSubLocations = async (baseArea: string, index: number) => {
    const searching = [...areaIsSearching];
    searching[index] = true;
    setAreaIsSearching(searching);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          baseArea
        )},Bangalore,India&format=json&limit=20&addressdetails=1`,
        {
          headers: {
            "User-Agent": "Rentify-App",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // const subLocs: LocationOption[] = data
        //   .map((item: any) => ({
        //     display_name: item.display_name,
        //     area_name: extractAreaName(item.display_name, item.address),
        //     lat: item.lat,
        //     lon: item.lon,
        //     is_base_area: false,
        //   }))
        //   .filter(loc => !isBaseArea(loc.area_name));
        
        const subLocs: LocationOption[] = data
  .map((item: any) => ({
    display_name: item.display_name,
    area_name: extractAreaName(item.display_name, item.address),
    lat: item.lat,
    lon: item.lon,
    is_base_area: false,
  }))
  .filter((loc: LocationOption) => !isBaseArea(loc.area_name));


        const suggestions = [...areaLocationSuggestions];
        suggestions[index] = subLocs;
        setAreaLocationSuggestions(suggestions);

        const showSub = [...areaShowSubLocations];
        showSub[index] = true;
        setAreaShowSubLocations(showSub);
      }
    } catch (err) {
      console.error("Error fetching sub locations:", err);
    } finally {
      const searchingDone = [...areaIsSearching];
      searchingDone[index] = false;
      setAreaIsSearching(searchingDone);
    }
  };

  const handleAreaSearch = async (index: number, searchTerm: string) => {
    const terms = [...areaSearchTerms];
    terms[index] = searchTerm;
    setAreaSearchTerms(terms);

    const show = [...areaShowSuggestions];
    show[index] = true;
    setAreaShowSuggestions(show);

    if (!searchTerm || searchTerm.length < 3) {
      const suggestions = [...areaLocationSuggestions];
      suggestions[index] = [];
      setAreaLocationSuggestions(suggestions);

      const showSub = [...areaShowSubLocations];
      showSub[index] = false;
      setAreaShowSubLocations(showSub);

      const base = [...areaSelectedBase];
      base[index] = null;
      setAreaSelectedBase(base);
      return;
    }

    const searching = [...areaIsSearching];
    searching[index] = true;
    setAreaIsSearching(searching);

    const showSub = [...areaShowSubLocations];
    showSub[index] = false;
    setAreaShowSubLocations(showSub);

    const base = [...areaSelectedBase];
    base[index] = null;
    setAreaSelectedBase(base);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )},Bangalore,India&format=json&limit=8&addressdetails=1`,
        {
          headers: {
            "User-Agent": "Rentify-App",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const processed: LocationOption[] = data.map((item: any) => {
          const areaName = extractAreaName(
            item.display_name,
            item.address
          );
          return {
            display_name: item.display_name,
            area_name: areaName,
            lat: item.lat,
            lon: item.lon,
            is_base_area: isBaseArea(areaName),
          };
        });

        const suggestions = [...areaLocationSuggestions];
        suggestions[index] = processed;
        setAreaLocationSuggestions(suggestions);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
    } finally {
      const searchingDone = [...areaIsSearching];
      searchingDone[index] = false;
      setAreaIsSearching(searchingDone);
    }
  };

  const handleAreaSelect = (index: number, location: LocationOption) => {
    if (location.is_base_area) {
      const base = [...areaSelectedBase];
      base[index] = location.area_name;
      setAreaSelectedBase(base);

      const terms = [...areaSearchTerms];
      terms[index] = location.area_name;
      setAreaSearchTerms(terms);

      fetchSubLocations(location.area_name, index);
      return;
    }

    const updated = [...serviceAreas];
    updated[index] = location.area_name;
    setServiceAreas(updated);

    const suggestions = [...areaLocationSuggestions];
    suggestions[index] = [];
    setAreaLocationSuggestions(suggestions);

    const terms = [...areaSearchTerms];
    terms[index] = location.area_name;
    setAreaSearchTerms(terms);

    const show = [...areaShowSuggestions];
    show[index] = false;
    setAreaShowSuggestions(show);

    const showSub = [...areaShowSubLocations];
    showSub[index] = false;
    setAreaShowSubLocations(showSub);

    const base = [...areaSelectedBase];
    base[index] = null;
    setAreaSelectedBase(base);
  };

  const addServiceArea = () => {
    setServiceAreas(prev => [...prev, ""]);
    setAreaSearchTerms(prev => [...prev, ""]);
    setAreaShowSuggestions(prev => [...prev, false]);
    setAreaLocationSuggestions(prev => [...prev, []]);
    setAreaIsSearching(prev => [...prev, false]);
    setAreaSelectedBase(prev => [...prev, null]);
    setAreaShowSubLocations(prev => [...prev, false]);
  };

  const removeServiceArea = (index: number) => {
    const removeAt = <T,>(arr: T[]): T[] =>
      arr.filter((_, i) => i !== index);

    if (serviceAreas.length === 1) {
      setServiceAreas([""]);
      setAreaSearchTerms([""]);
      setAreaShowSuggestions([false]);
      setAreaLocationSuggestions([[]]);
      setAreaIsSearching([false]);
      setAreaSelectedBase([null]);
      setAreaShowSubLocations([false]);
      return;
    }

    setServiceAreas(prev => removeAt(prev));
    setAreaSearchTerms(prev => removeAt(prev));
    setAreaShowSuggestions(prev => removeAt(prev));
    setAreaLocationSuggestions(prev => removeAt(prev));
    setAreaIsSearching(prev => removeAt(prev));
    setAreaSelectedBase(prev => removeAt(prev));
    setAreaShowSubLocations(prev => removeAt(prev));
  };

  const addFlatType = () => {
    setAvailableFlatTypes(prev => [...prev, ""]);
  };

  const removeFlatType = (index: number) => {
    if (availableFlatTypes.length === 1) {
      setAvailableFlatTypes([""]);
      return;
    }
    setAvailableFlatTypes(prev => prev.filter((_, i) => i !== index));
  };

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
      {/* mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 mb-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Hello</p>
            <p className="text-base font-semibold text-gray-900">
              {formData.name || "Broker"}
            </p>
            <p className="text-xs text-gray-500">Profile</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl border border-gray-200 shadow-sm bg-white flex items-center gap-2"
          >
            <Menu className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* desktop header */}
      <div className="mb-8 hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Profile
        </h1>
        <p className="text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* mobile heading */}
      <div className="mb-4 lg:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          My Profile
        </h1>
        <p className="text-sm text-gray-600">
          Manage your details and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left profile card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 h-32 relative">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* avatar with optional image - UPDATED */}
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-xl overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>

                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                      <Camera className="w-4 h-4 text-gray-700" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {formData.name || "Broker Name"}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Real Estate Broker
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                <Phone className="w-4 h-4" />
                <span>{formData.phoneNumber}</span>
              </div>
              {uploadingImage && (
                <p className="text-xs text-gray-400 mt-1">
                  Uploading profile picture...
                </p>
              )}
            </div>

            {/* stats, from dashboard api */}
            <div className="border-t border-gray-100 px-6 py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Leads
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    {stats.totalLeads}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Conversions
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                    {stats.conversions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Success Rate
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                    {stats.successRate}
                  </span>
                </div>
              </div>
            </div>

            {/* simple member since text, optional fixed */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Broker on Rentify</span>
              </div>
            </div>
          </div>
        </div>

        {/* right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* personal and office info */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Profile Details
              </h3>
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
              {/* phone readonly */}
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

              {/* name */}
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
                  onChange={e =>
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

              {/* address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Office Address
                  </span>
                </label>
                <textarea
                  value={
                    isEditing ? tempData.address : formData.address
                  }
                  onChange={e =>
                    setTempData({
                      ...tempData,
                      address: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                    isEditing
                      ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* service areas and property info */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Service Areas and Properties
            </h3>

            {/* service areas */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Areas
              </label>

              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {serviceAreas
                    .filter(s => s && s.trim().length)
                    .map((area, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {area}
                      </span>
                    ))}
                  {serviceAreas.filter(
                    s => s && s.trim().length
                  ).length === 0 && (
                    <span className="text-xs text-gray-500">
                      No service areas added
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  {serviceAreas.map((_, i) => (
                    <div key={i} className="mb-3 relative">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={areaSearchTerms[i] || ""}
                            onChange={e =>
                              handleAreaSearch(i, e.target.value)
                            }
                            onFocus={() => {
                              const show = [...areaShowSuggestions];
                              show[i] = true;
                              setAreaShowSuggestions(show);
                            }}
                            placeholder="Search location (e.g., HSR Layout)"
                            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
                          />

                          {areaShowSuggestions[i] &&
                            ((areaSearchTerms[i]?.length || 0) >= 3 ||
                              areaLocationSuggestions[i]?.length >
                                0) && (
                              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto text-sm">
                                {areaIsSearching[i] ? (
                                  <div className="px-4 py-3 text-center text-gray-500">
                                    <div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                                    {areaShowSubLocations[i]
                                      ? "Loading sectors..."
                                      : "Searching locations..."}
                                  </div>
                                ) : areaLocationSuggestions[i]?.length >
                                  0 ? (
                                  <>
                                    {areaShowSubLocations[i] &&
                                      areaSelectedBase[i] && (
                                        <div className="px-4 py-2 bg-blue-50 border-b-2 border-blue-200 text-blue-700 font-semibold text-xs">
                                          Select a sector or stage in{" "}
                                          {areaSelectedBase[i]}
                                        </div>
                                      )}
                                    {areaLocationSuggestions[i].map(
                                      (location, idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() =>
                                            handleAreaSelect(
                                              i,
                                              location
                                            )
                                          }
                                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 active:scale-[0.99] transition-all border-b border-gray-100 last:border-b-0 text-black"
                                        >
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-start flex-1 min-w-0">
                                              <MapPin className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                                              <span className="text-sm leading-relaxed break-words">
                                                {location.area_name}
                                              </span>
                                            </div>
                                            {location.is_base_area && (
                                              <svg
                                                className="w-4 h-4 text-gray-400 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M9 5l7 7-7 7"
                                                />
                                              </svg>
                                            )}
                                          </div>
                                        </button>
                                      )
                                    )}
                                  </>
                                ) : (areaSearchTerms[i]?.length || 0) >=
                                  3 ? (
                                  <div className="px-4 py-3 text-center text-gray-500">
                                    No locations found. Try another
                                    term.
                                  </div>
                                ) : (
                                  <div className="px-4 py-3 text-center text-gray-500">
                                    Type at least 3 characters to
                                    search
                                  </div>
                                )}
                              </div>
                            )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeServiceArea(i)}
                          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs hover:bg-gray-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addServiceArea}
                    className="text-blue-600 text-xs font-semibold hover:text-blue-700 mt-1"
                  >
                    + Add another area
                  </button>
                </div>
              )}
            </div>

            {/* flat types */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Flat Types
              </label>

              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {availableFlatTypes
                    .filter(f => f && f.trim().length)
                    .map((flat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs"
                      >
                        <Home className="w-3 h-3 mr-1" />
                        {flat}
                      </span>
                    ))}
                  {availableFlatTypes.filter(
                    f => f && f.trim().length
                  ).length === 0 && (
                    <span className="text-xs text-gray-500">
                      No flat types added
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  {availableFlatTypes.map((flat, i) => (
                    <div key={i} className="mb-2 flex gap-2">
                      <select
                        value={flat}
                        onChange={e => {
                          const next = [...availableFlatTypes];
                          next[i] = e.target.value;
                          setAvailableFlatTypes(next);
                        }}
                        className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm bg-white"
                      >
                        <option value="">Select flat type</option>
                        {FLAT_TYPES.map(t => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeFlatType(i)}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs hover:bg-gray-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFlatType}
                    className="text-blue-600 text-xs font-semibold hover:text-blue-700 mt-1"
                  >
                    + Add another type
                  </button>
                </div>
              )}
            </div>

            {/* monthly flats */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                No. of flats available per month
              </label>
              <input
                type="number"
                min={0}
                value={
                  isEditing
                    ? tempData.monthlyFlatsAvailable
                    : formData.monthlyFlatsAvailable
                }
                onChange={e =>
                  setTempData({
                    ...tempData,
                    monthlyFlatsAvailable: e.target.value,
                  })
                }
                disabled={!isEditing}
                placeholder="e.g., 10"
                className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                  isEditing
                    ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-700"
                }`}
              />
            </div>

            {/* expectations */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expectations from customers
              </label>
              <textarea
                value={
                  isEditing
                    ? tempData.customerExpectations
                    : formData.customerExpectations
                }
                onChange={e =>
                  setTempData({
                    ...tempData,
                    customerExpectations: e.target.value,
                  })
                }
                disabled={!isEditing}
                rows={3}
                placeholder="Any notes or conditions you expect from tenants"
                className={`w-full px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                  isEditing
                    ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-700"
                }`}
              />
            </div>
          </div>

          {/* help card */}
          {/* <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-md p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-orange-50 mb-4 text-sm">
              Have questions about your account or need assistance? Our
              support team is here to help you.
            </p>
            <button className="bg-white text-orange-600 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm">
              Contact Support
            </button>
          </div> */}
        </div>
      </div>

      {/* mobile slide in menu */}
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
              {mobileMenu.map(item => {
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
              Powered by{" "}
              <span className="font-semibold text-white">Rentify</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
