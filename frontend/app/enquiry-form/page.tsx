
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Search, Home, DollarSign, MapPin, Phone, User, CheckCircle, X, Building2, Key } from 'lucide-react';

// const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

// // Common service areas in Mumbai
// const SERVICE_AREAS = [
//   'Whitefield', 'Indiranagar', 'Koramangala', 'Bengaluru', 'Jayanagar', 'Banashankari',
//   'Basaveshwaranagar', 'Bheemanahalli', 'Bommanahalli', 'Chikkalasandra', 'Dasarahalli',
//   'Domlur', 'Electronic City', 'Frazer Town', 'Girinagar', 'Gokula', 'Gopalapuram',
//   'Hanumanthanagar', 'HBR Layout', 'Hebbal', 'Hoysala', 'HSR Layout', 'Ittamadu',
//   'JP Nagar', 'Jyothinagar', 'Kammanahalli', 'Kaval Byrasandra', 'Kodichikkanahalli',
//   'Kommadi', 'Kundalahalli', 'Lingrajapuram', 'Mahadevapura', 'Malleswaram', 'Marathahalli',
//   'Mathikere', 'Mico Layout', 'Mookambika', 'Nagavara', 'Nagawara', 'Nagarathpet',
//   'Nandini Layout', 'Nayandahalli', 'Old Airport Road', 'Peenya', 'Prithviraj Road',
//   'RMV Extension', 'Sadashivnagar', 'Sahakarnagar', 'Sanjaynagar', 'Sarjapur Road',
//   'Seshadripuram', 'Shantinagar', 'Shivaji Nagar', 'Soladevanahalli', 'Subramanyanagar'
// ];
// const FLAT_TYPES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse'];

// const PROPERTY_TYPES = [
//   'Standalone house',
//   'Apartment',
//   'Gated community',
//   'Independent house',
//   'Villa',
//   'PG / Co-living',
//   'Plot / Land',
// ];


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
//     areaKey: '',
//     propertyType: '', 
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

//   // const handleAreaSelect = (area: string) => {
//   //   setFormData({ ...formData, address: area });
//   //   setSearchTerm(area);
//   //   setShowSuggestions(false);
//   // };

//   const handleAreaSelect = (area: string) => {
//   setFormData({
//     ...formData,
//     address: 'Bangalore', // city fixed
//     areaKey: area,        // this is the service area
//   });
//   setSearchTerm(area);
//   setShowSuggestions(false);
// };


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
//           address: formData.address || 'Bangalore',
//           budget: budgetValue,
//           flatType: formData.flatType,
//           areaKey: formData.areaKey,  
//           propertyType: formData.propertyType,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', text: 'Enquiry submitted successfully! We will contact you soon.' });
//         setFormData({ name: '', phoneNumber: '', address: '', budget: '', flatType: '', areaKey: '', propertyType: '',  });
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

//   // Animated floating elements
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
//       `}</style>

//       <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
//         <div className="grid md:grid-cols-2 min-h-[700px]">
//           {/* Left Side - Content */}
//           <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-12 flex flex-col justify-center items-center text-white overflow-hidden">
//             <FloatingElement delay={0} duration={4} />
//             <FloatingElement delay={1} duration={5} />
//             <FloatingElement delay={2} duration={3.5} />
//             <FloatingElement delay={0.5} duration={4.5} />

//             <div className="relative z-10 text-center">
//               <Building2 className="w-24 h-24 mx-auto mb-6 animate-pulse" />
//               <h2 className="text-4xl font-bold mb-4">Find Your Dream Home</h2>
//               <p className="text-blue-100 mb-8 text-lg">
//                 Discover the perfect property that matches your lifestyle and budget
//               </p>
              
//               <div className="space-y-4 text-left max-w-sm mx-auto">
//                 <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                   <Home className="w-6 h-6 mt-1 flex-shrink-0" />
//                   <div>
//                     <h4 className="font-semibold">Verified Properties</h4>
//                     <p className="text-sm text-blue-100">All listings are authentically verified</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                   <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
//                   <div>
//                     <h4 className="font-semibold">Instant Response</h4>
//                     <p className="text-sm text-blue-100">Connect with brokers immediately</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                   <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
//                   <div>
//                     <h4 className="font-semibold">Best Locations</h4>
//                     <p className="text-sm text-blue-100">Properties across all prime areas</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                   <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
//                   <div>
//                     <h4 className="font-semibold">Easy Process</h4>
//                     <p className="text-sm text-blue-100">Simple and transparent property search</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Form */}
//           <div className="p-12 flex flex-col justify-center">
//             <div className="max-w-md mx-auto w-full">
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">Submit Your Enquiry</h2>
//               <p className="text-gray-600 mb-8">Tell us what you're looking for</p>

//               <div className="space-y-5">
//                 {/* Name Field */}
//                 <div>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <User className="w-4 h-4 mr-2 text-blue-600" />
//                     Your Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter your full name"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
//                   />
//                 </div>

//                 {/* Phone Field */}
//                 <div>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <Phone className="w-4 h-4 mr-2 text-blue-600" />
//                     Phone Number *
//                   </label>
//                   <div className="flex">
//                     <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
//                       +91
//                     </span>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       required
//                       placeholder="10 digit mobile number"
//                       className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
//                       maxLength={10}
//                     />
//                   </div>
//                 </div>

//                 {/* Service Area - Autocomplete */}
//                 <div ref={autocompleteRef}>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <MapPin className="w-4 h-4 mr-2 text-blue-600" />
//                     Preferred Location *
//                   </label>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     {/* <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => {
//                         setSearchTerm(e.target.value);
//                         setFormData({ ...formData, address: e.target.value });
//                         setShowSuggestions(true);
//                       }}
//                       onFocus={() => setShowSuggestions(true)}
//                       placeholder="Search or select location"
//                       className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
//                       required
//                     /> */}
                    
//                     <input
//   type="text"
//   value={searchTerm}
//   onChange={(e) => {
//     setSearchTerm(e.target.value);
//     setShowSuggestions(true);
//   }}
//   onFocus={() => setShowSuggestions(true)}
//   placeholder="Search or select location"
//   className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
//   required
// />


//                     {showSuggestions && filteredAreas.length > 0 && (
//                       <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
//                         {filteredAreas.map((area, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handleAreaSelect(area)}
//                             className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 text-black"
//                           >
//                             <div className="flex items-center">
//                               <MapPin className="w-4 h-4 mr-2 text-blue-600" />
//                               <span>{area}</span>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Flat Type - Dropdown */}
//                {/* <div>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <Home className="w-4 h-4 mr-2 text-blue-600" />
//                     Property Type *
//                   </label>
//                   <div className="relative">
//                     <select
//                       name="flatType"
//                       value={formData.flatType}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-black"
//                     >
//                       <option value="">Select property type</option>
//                       {FLAT_TYPES.map((type) => (
//                         <option key={type} value={type}>
//                           {type}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div> */}

//                 {/* Property Type - Dropdown */}
// <div>
//   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//     <Home className="w-4 h-4 mr-2 text-blue-600" />
//     Property Type *
//   </label>
//   <div className="relative">
//     <select
//       name="propertyType"
//       value={formData.propertyType}
//       onChange={handleChange}
//       required
//       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-black"
//     >
//       <option value="">Select property type</option>
//       {PROPERTY_TYPES.map((t) => (
//         <option key={t} value={t}>
//           {t}
//         </option>
//       ))}
//     </select>
//     <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//       </svg>
//     </div>
//   </div>
// </div>

// {/* Flat / BHK Type - optional */}
// <div>
//   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//     <Key className="w-4 h-4 mr-2 text-blue-600" />
//     BHK / Flat Type (optional)
//   </label>
//   <div className="relative">
//     <select
//       name="flatType"
//       value={formData.flatType}
//       onChange={handleChange}
//       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-black"
//     >
//       <option value="">Select BHK / flat type</option>
//       {FLAT_TYPES.map((type) => (
//         <option key={type} value={type}>
//           {type}
//         </option>
//       ))}
//     </select>
//     <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//       </svg>
//     </div>
//   </div>
// </div>


//                 {/* Budget - Dropdown */}
//                 <div>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
//                     Budget Range *
//                   </label>
//                   <div className="relative">
//                     <select
//                       name="budget"
//                       value={formData.budget}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-black"
//                     >
//                       <option value="">Select budget range</option>
//                       {BUDGET_RANGES.map((range) => (
//                         <option key={range.value} value={range.value}>
//                           {range.label}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Submitting...</span>
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="w-5 h-5" />
//                       <span>Submit Enquiry</span>
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Message Display */}
//               {message && (
//                 <div
//                   className={`mt-6 p-4 rounded-xl flex items-start space-x-3 ${
//                     message.type === 'success'
//                       ? 'bg-green-50 border-2 border-green-200 text-green-700'
//                       : 'bg-red-50 border-2 border-red-200 text-red-700'
//                   }`}
//                 >
//                   {message.type === 'success' ? (
//                     <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//                   ) : (
//                     <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
//                   )}
//                   <p className="font-medium">{message.text}</p>
//                 </div>
//               )}

//               {/* Footer Note */}
//               <div className="mt-6 pt-6 border-t-2 border-gray-100">
//                 <p className="text-xs text-gray-600 text-center">
//                   By submitting this form, you agree to our{' '}
//                   <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
//                     Terms & Conditions
//                   </span>{' '}
//                   and{' '}
//                   <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
//                     Privacy Policy
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Home,
  DollarSign,
  MapPin,
  Phone,
  User,
  CheckCircle,
  X,
  Building2,
  Key,
} from 'lucide-react';

const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

const SERVICE_AREAS = [
  'Whitefield', 'Indiranagar', 'Koramangala', 'Bengaluru', 'Jayanagar', 'Banashankari',
  'Basaveshwaranagar', 'Bheemanahalli', 'Bommanahalli', 'Chikkalasandra', 'Dasarahalli',
  'Domlur', 'Electronic City', 'Frazer Town', 'Girinagar', 'Gokula', 'Gopalapuram',
  'Hanumanthanagar', 'HBR Layout', 'Hebbal', 'Hoysala', 'HSR Layout', 'Ittamadu',
  'JP Nagar', 'Jyothinagar', 'Kammanahalli', 'Kaval Byrasandra', 'Kodichikkanahalli',
  'Kommadi', 'Kundalahalli', 'Lingrajapuram', 'Mahadevapura', 'Malleswaram', 'Marathahalli',
  'Mathikere', 'Mico Layout', 'Mookambika', 'Nagavara', 'Nagawara', 'Nagarathpet',
  'Nandini Layout', 'Nayandahalli', 'Old Airport Road', 'Peenya', 'Prithviraj Road',
  'RMV Extension', 'Sadashivnagar', 'Sahakarnagar', 'Sanjaynagar', 'Sarjapur Road',
  'Seshadripuram', 'Shantinagar', 'Shivaji Nagar', 'Soladevanahalli', 'Subramanyanagar',
];

const FLAT_TYPES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse'];

const PROPERTY_TYPES = [
  'Standalone house',
  'Apartment',
  'Gated community',
  'Independent house',
  'Villa',
  'PG / Co-living',
  'Plot / Land',
  'Anything is fine',
];

const BUDGET_RANGES = [
  { label: '₹10,000 - ₹15,000', value: '10000-15000' },
  { label: '₹15,000 - ₹20,000', value: '15000-20000' },
  { label: '₹20,000 - ₹25,000', value: '20000-25000' },
  { label: '₹25,000 - ₹35,000', value: '25000-35000' },
  { label: '₹35,000 - ₹50,000', value: '35000-50000' },
  { label: 'Above ₹50,000', value: '50000-above' },
];

const FURNISHING_TYPES = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

const AMENITIES = ['Parking', 'Security', 'Power backup', 'Lift', 'Balcony'];

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    budget: '',
    flatType: '',
    areaKey: '',
    propertyType: '',
  furnishingType: '',
  amenities: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{
    display_name: string;
    area_name: string;
    lat: string;
    lon: string;
    is_base_area: boolean;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBaseArea, setSelectedBaseArea] = useState<string | null>(null);
  const [showSubLocations, setShowSubLocations] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const toggleAmenity = (amenity: string) => {
  setFormData(prev => {
    const exists = prev.amenities.includes(amenity);
    return {
      ...prev,
      amenities: exists
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    };
  });
};


  // Helper function to extract area name from address
  const extractAreaName = (displayName: string, address: any): string => {
    // Split the display name by commas
    const parts = displayName.split(',').map(p => p.trim());
    
    // Generic location terms to filter out
    const genericTerms = [
      'bangalore', 'bengaluru', 'karnataka', 'india',
      'bangalore urban', 'bengaluru urban', 'bangalore south', 'bengaluru south',
      'south city corporation', 'bengaluru south city corporation',
      'new tavarekere', 'tavarekere'
    ];
    
    // Check if a part is generic
    const isGeneric = (part: string): boolean => {
      const lower = part.toLowerCase();
      return genericTerms.some(term => lower.includes(term)) || /^\d{6}$/.test(part.trim());
    };
    
    // Check if contains sector/block/phase/stage
    const hasSpecificInfo = (str: string): boolean => {
      const lower = str.toLowerCase();
      return /\b(sector|block|phase|stage)\b/i.test(lower);
    };
    
    // Check if it's a road/street name
    const isRoadName = (str: string): boolean => {
      const lower = str.toLowerCase();
      return /\b(road|street|cross|main|avenue|lane)\b/i.test(lower) && !hasSpecificInfo(str);
    };
    
    // Check if it's a business/building name
    const isBusinessName = (str: string): boolean => {
      if (hasSpecificInfo(str)) return false;
      const businessIndicators = /\b(labs|pvt|ltd|bank|atm|hospital|school|mall|tower|plaza|complex|apartment|building)\b/i;
      return businessIndicators.test(str);
    };
    
    // Extract only area name and sector/stage/block
    const meaningful: string[] = [];
    
    for (const part of parts) {
      // Skip generic terms
      if (isGeneric(part)) continue;
      
      // Skip roads and business names
      if (isRoadName(part) || isBusinessName(part)) continue;
      
      // Skip building numbers
      if (/^\d+$/.test(part.trim())) continue;
      
      // Add this part
      meaningful.push(part);
      
      // If we have area + stage/sector, we're done
      if (meaningful.length >= 2 && hasSpecificInfo(meaningful[meaningful.length - 1])) {
        break;
      }
      
      // If we have just stage/sector (like "1st Stage"), keep going for one more
      if (meaningful.length === 1 && hasSpecificInfo(meaningful[0])) {
        continue;
      }
      
      // Stop after 2 meaningful parts
      if (meaningful.length >= 2) {
        break;
      }
    }
    
    // Return the result
    if (meaningful.length > 0) {
      return meaningful.join(' ');
    }
    
    return parts[0] || displayName;
  };

  // Check if a location is a base area (no sector/stage info)
  const isBaseArea = (areaName: string): boolean => {
    const lower = areaName.toLowerCase();
    return !/\b(sector|block|phase|stage)\b/.test(lower);
  };

  // Fetch sub-locations (sectors/stages) for a base area
  const fetchSubLocations = async (baseArea: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(baseArea)},Bangalore,India&` +
        `format=json&` +
        `limit=20&` +
        `addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Rentify-App',
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Filter to only show locations with sector/stage info
        const subLocs = data
          .map((item: any) => ({
            display_name: item.display_name,
            area_name: extractAreaName(item.display_name, item.address),
            lat: item.lat,
            lon: item.lon,
            is_base_area: false,
          }))
          .filter((loc: any) => !isBaseArea(loc.area_name));
        
        setLocationSuggestions(subLocs);
        setShowSubLocations(true);
      }
    } catch (error) {
      console.error('Error fetching sub-locations:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search for Nominatim API
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setLocationSuggestions([]);
      setShowSubLocations(false);
      setSelectedBaseArea(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setShowSubLocations(false);
      setSelectedBaseArea(null);
      try {
        // Nominatim API - free geocoding from OpenStreetMap
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchTerm)},Bangalore,India&` +
          `format=json&` +
          `limit=8&` +
          `addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Rentify-App', // Nominatim requires a user agent
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          // Process data to extract area names
          const processedData = data.map((item: any) => {
            const areaName = extractAreaName(item.display_name, item.address);
            return {
              display_name: item.display_name,
              area_name: areaName,
              lat: item.lat,
              lon: item.lon,
              is_base_area: isBaseArea(areaName),
            };
          });
          setLocationSuggestions(processedData);
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    setFormData({ ...formData, phoneNumber: value });
  };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   if (e.target.name === 'phoneNumber')
  //     return handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  if (e.target.name === 'phoneNumber')
    return handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);

  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};


  const handleAreaSelect = (location: { display_name: string; area_name: string; lat: string; lon: string; is_base_area: boolean }) => {
    // If this is a base area (no sector info), fetch sub-locations
    if (location.is_base_area) {
      setSelectedBaseArea(location.area_name);
      setSearchTerm(location.area_name);
      fetchSubLocations(location.area_name);
      return;
    }
    
    // Otherwise, select this specific location
    setFormData({
      ...formData,
      address: 'Bangalore',
      areaKey: location.area_name,
    });
    
    // Clear everything and close dropdown
    setLocationSuggestions([]); // Clear suggestions first
    setSearchTerm(location.area_name);
    setShowSuggestions(false); // Then close dropdown
    setShowSubLocations(false);
    setSelectedBaseArea(null);
  };

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setMessage(null);

  //   if (formData.phoneNumber.length !== 10) {
  //     setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
  //     setLoading(false);
  //     return;
  //   }

  //   let budgetValue: number | undefined;
  //   if (formData.budget) {
  //     const [min] = formData.budget.split('-');
  //     budgetValue = parseInt(min);
  //   }

  //   try {
  //     const response = await fetch(`${baseurl}/api/leads`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         phoneNumber: '+91' + formData.phoneNumber,
  //         address: formData.address || 'Bangalore',
  //         budget: budgetValue,
  //         flatType: formData.flatType,
  //         areaKey: formData.areaKey,
  //         propertyType: formData.propertyType,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setMessage({
  //         type: 'success',
  //         text: 'Enquiry submitted successfully. We will contact you soon.',
  //       });
  //       setFormData({
  //         name: '',
  //         phoneNumber: '',
  //         address: '',
  //         budget: '',
  //         flatType: '',
  //         areaKey: '',
  //         propertyType: '',
  //       });
  //       setSearchTerm('');
  //     } else {
  //       setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setMessage({ type: 'error', text: 'Network error. Please try again.' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
  setLoading(true);
  setMessage(null);

  if (formData.phoneNumber.length !== 10) {
    setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
    setLoading(false);
    return;
  }

  if (!formData.propertyType) {
    setMessage({ type: 'error', text: 'Please select a property type' });
    setLoading(false);
    return;
  }

  if (!formData.flatType) {
    setMessage({ type: 'error', text: 'Please select a BHK / flat type' });
    setLoading(false);
    return;
  }

  if (!formData.areaKey) {
    setMessage({ type: 'error', text: 'Please select a preferred location' });
    setLoading(false);
    return;
  }

  if (!formData.budget) {
    setMessage({ type: 'error', text: 'Please select a budget range' });
    setLoading(false);
    return;
  }

  let budgetValue: number | undefined;
  if (formData.budget) {
    const [min] = formData.budget.split('-');
    budgetValue = parseInt(min);
  }

  try {
    const response = await fetch(`${baseurl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phoneNumber: '+91' + formData.phoneNumber,
        address: formData.address || 'Bangalore',
        budget: budgetValue,
        flatType: formData.flatType,
        areaKey: formData.areaKey,
        propertyType: formData.propertyType,
        furnishingType: formData.furnishingType || undefined,
        amenities: formData.amenities,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage({
        type: 'success',
        text: 'Enquiry submitted successfully. We will contact you soon.',
      });
      setFormData({
        name: '',
        phoneNumber: '',
        address: '',
        budget: '',
        flatType: '',
        areaKey: '',
        propertyType: '',
        furnishingType: '',
        amenities: [],
      });
      setSearchTerm('');
    } else {
      setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
    }
  } catch (err) {
    console.error(err);
    setMessage({ type: 'error', text: 'Network error. Please try again.' });
  } finally {
    setLoading(false);
  }
};


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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 pt-24 md:pt-32 overflow-x-hidden">
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
      `}</style>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[650px]">
          {/* Left Side */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 md:p-12 flex flex-col justify-center items-center text-white overflow-hidden">
            <FloatingElement delay={0} duration={4} />
            <FloatingElement delay={1} duration={5} />
            <FloatingElement delay={2} duration={3.5} />
            <FloatingElement delay={0.5} duration={4.5} />

            <div className="relative z-10 text-center max-w-md mx-auto">
              <Building2 className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 animate-pulse" />
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                Find Your Dream Home
              </h2>
              <p className="text-sm md:text-lg text-blue-100 mb-6 md:mb-8">
                Discover the perfect property that matches your lifestyle and budget.
              </p>

              <div className="space-y-3 md:space-y-4 text-left">
                <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                  <Home className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Verified Properties</h4>
                    <p className="text-xs md:text-sm text-blue-100">
                      All listings are authentically verified.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Instant Response</h4>
                    <p className="text-xs md:text-sm text-blue-100">
                      Connect with brokers immediately.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Best Locations</h4>
                    <p className="text-xs md:text-sm text-blue-100">
                      Properties across all prime areas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Easy Process</h4>
                    <p className="text-xs md:text-sm text-blue-100">
                      Simple and transparent property search.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-6 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                Submit Your Enquiry
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8">
                Tell us what you are looking for in a home.
              </p>

              <div className="space-y-4 md:space-y-5">
                {/* Name */}
                <div>
                  <label className="flex items-center text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base text-black"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    Phone Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 md:px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium text-xs md:text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="10 digit mobile number"
                      className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base text-black"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Location */}
                <div ref={autocompleteRef}>
                  <label className="flex items-center text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    Preferred Location *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search or select location"
                      className="w-full pl-10 pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base text-black"
                      required
                    />

                    {showSuggestions && (searchTerm.length >= 3 || locationSuggestions.length > 0) && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto text-sm">
                        {isSearching ? (
                          <div className="px-4 py-3 text-center text-gray-500">
                            <div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            {showSubLocations ? 'Loading sectors...' : 'Searching locations...'}
                          </div>
                        ) : locationSuggestions.length > 0 ? (
                          <>
                            {showSubLocations && selectedBaseArea && (
                              <div className="px-4 py-2 bg-blue-50 border-b-2 border-blue-200 text-blue-700 font-semibold text-xs">
                                Select a sector/stage in {selectedBaseArea}
                              </div>
                            )}
                            {locationSuggestions.map((location, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleAreaSelect(location)}
                                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 active:scale-[0.99] transition-all border-b border-gray-100 last:border-b-0 text-black"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start flex-1 min-w-0">
                                    <MapPin className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm leading-relaxed break-words">{location.area_name}</span>
                                  </div>
                                  {location.is_base_area && (
                                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </>
                        ) : searchTerm.length >= 3 ? (
                          <div className="px-4 py-3 text-center text-gray-500">
                            No locations found. Try a different search term.
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-center text-gray-500">
                            Type at least 3 characters to search
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="flex items-center text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    <Home className="w-4 h-4 mr-2 text-blue-600" />
                    Property Type *
                  </label>
                  <div className="relative">
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-sm md:text-base text-black"
                    >
                      <option value="">Select property type</option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* BHK / Flat Type (optional) */}
                <div>
                  <label className="flex items-center text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    <Key className="w-4 h-4 mr-2 text-blue-600" />
                    BHK / Flat Type (optional)
                  </label>
                  <div className="relative">
                    <select
                      name="flatType"
                      value={formData.flatType}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-sm md:text-base text-black"
                    >
                      <option value="">Select BHK / flat type</option>
                      {FLAT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
  <label className="flex items-center text-xs md:text-sm font-semibold text-gray-700 mb-2">
    <Home className="w-4 h-4 mr-2 text-blue-600" />
    Furnishing (optional)
  </label>
  <div className="relative">
    <select
      name="furnishingType"
      value={formData.furnishingType}
      onChange={handleChange}
      className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-sm md:text-base text-black"
    >
      <option value="">Select furnishing</option>
      {FURNISHING_TYPES.map(t => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
    {/* arrow svg */}
  </div>
</div>

<div>
  <label className="flex items-center text-xs md:text-sm font-semibold text-gray-700 mb-2">
    <Home className="w-4 h-4 mr-2 text-blue-600" />
    Amenities (optional)
  </label>
  <div className="grid grid-cols-2 gap-2 md:gap-3">
    {AMENITIES.map(a => (
      <label
        key={a}
        className={`flex items-center space-x-2 px-2.5 py-2 rounded-lg border text-xs md:text-sm cursor-pointer ${
          formData.amenities.includes(a)
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 bg-white text-gray-700'
        }`}
      >
        <input
          type="checkbox"
          className="accent-blue-600"
          checked={formData.amenities.includes(a)}
          onChange={() => toggleAmenity(a)}
        />
        <span>{a}</span>
      </label>
    ))}
  </div>
</div>



                {/* Budget */}
                <div>
                  <label className="flex items-center text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                    Budget Range *
                  </label>
                  <div className="relative">
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-sm md:text-base text-black"
                    >
                      <option value="">Select budget range</option>
                      {BUDGET_RANGES.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`mt-4 md:mt-6 p-3 md:p-4 rounded-xl flex items-start space-x-3 text-xs md:text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 border-2 border-green-200 text-green-700'
                      : 'bg-red-50 border-2 border-red-200 text-red-700'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              {/* Footer note */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t-2 border-gray-100">
                <p className="text-[11px] md:text-xs text-gray-600 text-center leading-relaxed">
                  By submitting this form, you agree to our{' '}
                  <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
                    Terms & Conditions
                  </span>{' '}
                  and{' '}
                  <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
