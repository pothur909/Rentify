
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Home, DollarSign, MapPin, Phone, User, CheckCircle, X, Building2, Key } from 'lucide-react';

const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7000';

// Common service areas in Mumbai
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
  'Seshadripuram', 'Shantinagar', 'Shivaji Nagar', 'Soladevanahalli', 'Subramanyanagar'
];
const FLAT_TYPES = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse'];

const BUDGET_RANGES = [
  { label: 'Under ₹10,000', value: '0-10000' },
  { label: '₹10,000 - ₹20,000', value: '10000-20000' },
  { label: '₹20,000 - ₹30,000', value: '20000-30000' },
  { label: '₹30,000 - ₹50,000', value: '30000-50000' },
  { label: '₹50,000 - ₹75,000', value: '50000-75000' },
  { label: '₹75,000 - ₹1,00,000', value: '75000-100000' },
  { label: 'Above ₹1,00,000', value: '100000-above' },
];

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    budget: '',
    flatType: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Autocomplete states
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Filter service areas based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = SERVICE_AREAS.filter(area =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAreas(filtered);
    } else {
      setFilteredAreas(SERVICE_AREAS);
    }
  }, [searchTerm]);

  // Close suggestions when clicking outside
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'phoneNumber') return handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAreaSelect = (area: string) => {
    setFormData({ ...formData, address: area });
    setSearchTerm(area);
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    // Validate phone number
    if (formData.phoneNumber.length !== 10) {
      setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
      setLoading(false);
      return;
    }

    // Parse budget range
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
          address: formData.address,
          budget: budgetValue,
          flatType: formData.flatType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Enquiry submitted successfully! We will contact you soon.' });
        setFormData({ name: '', phoneNumber: '', address: '', budget: '', flatType: '' });
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

  // Animated floating elements
  const FloatingElement = ({ delay = 0, duration = 3 }) => (
    <div
      className="absolute rounded-full bg-white/10 backdrop-blur-sm"
      style={{
        width: `${Math.random() * 150 + 50}px`,
        height: `${Math.random() * 150 + 50}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 pt-32">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
      `}</style>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[700px]">
          {/* Left Side - Content */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-12 flex flex-col justify-center items-center text-white overflow-hidden">
            <FloatingElement delay={0} duration={4} />
            <FloatingElement delay={1} duration={5} />
            <FloatingElement delay={2} duration={3.5} />
            <FloatingElement delay={0.5} duration={4.5} />

            <div className="relative z-10 text-center">
              <Building2 className="w-24 h-24 mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl font-bold mb-4">Find Your Dream Home</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Discover the perfect property that matches your lifestyle and budget
              </p>
              
              <div className="space-y-4 text-left max-w-sm mx-auto">
                <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Home className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Verified Properties</h4>
                    <p className="text-sm text-blue-100">All listings are authentically verified</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Instant Response</h4>
                    <p className="text-sm text-blue-100">Connect with brokers immediately</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Best Locations</h4>
                    <p className="text-sm text-blue-100">Properties across all prime areas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Easy Process</h4>
                    <p className="text-sm text-blue-100">Simple and transparent property search</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Submit Your Enquiry</h2>
              <p className="text-gray-600 mb-8">Tell us what you're looking for</p>

              <div className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    Phone Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="10 digit mobile number"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Service Area - Autocomplete */}
                <div ref={autocompleteRef}>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    Preferred Location *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setFormData({ ...formData, address: e.target.value });
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search or select location"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black"
                      required
                    />
                    {showSuggestions && filteredAreas.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {filteredAreas.map((area, index) => (
                          <button
                            key={index}
                            onClick={() => handleAreaSelect(area)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 text-black"
                          >
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                              <span>{area}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Flat Type - Dropdown */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Home className="w-4 h-4 mr-2 text-blue-600" />
                    Property Type *
                  </label>
                  <div className="relative">
                    <select
                      name="flatType"
                      value={formData.flatType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-black"
                    >
                      <option value="">Select property type</option>
                      {FLAT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Budget - Dropdown */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                    Budget Range *
                  </label>
                  <div className="relative">
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer text-black"
                    >
                      <option value="">Select budget range</option>
                      {BUDGET_RANGES.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`mt-6 p-4 rounded-xl flex items-start space-x-3 ${
                    message.type === 'success'
                      ? 'bg-green-50 border-2 border-green-200 text-green-700'
                      : 'bg-red-50 border-2 border-red-200 text-red-700'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              {/* Footer Note */}
              <div className="mt-6 pt-6 border-t-2 border-gray-100">
                <p className="text-xs text-gray-600 text-center">
                  By submitting this form, you agree to our{' '}
                  <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
                    Terms & Conditions
                  </span>{' '}
                  and{' '}
                  <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}