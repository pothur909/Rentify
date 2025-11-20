

'use client'

import { Package, CheckCircle, Users, Clock, Star, Zap, Crown, TrendingUp } from "lucide-react";

export default function PackagesPage() {
  const packages = [
    {
      id: 1,
      name: "Basic Lead Pack",
      leads: 30,
      price: "₹4,999",
      duration: "30 days",
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
      features: [
        "30 verified leads",
        "Basic lead details",
        "Email support",
        "7-day validity"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Pro Lead Pack",
      leads: 60,
      price: "₹8,999",
      duration: "60 days",
      icon: Zap,
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-500",
      features: [
        "60 verified leads",
        "Detailed lead profiles",
        "Priority support",
        "15-day validity"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Premium Lead Pack",
      leads: 100,
      price: "₹13,999",
      duration: "90 days",
      icon: Crown,
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      iconBg: "bg-orange-500",
      features: [
        "100 verified leads",
        "Complete lead analytics",
        "24/7 dedicated support",
        "30-day validity"
      ],
      popular: false
    },
    {
      id: 4,
      name: "Enterprise Pack",
      leads: 200,
      price: "₹24,999",
      duration: "120 days",
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
      features: [
        "200+ verified leads",
        "Advanced CRM integration",
        "Account manager",
        "60-day validity"
      ],
      popular: false
    }
  ];

  const stats = [
    {
      label: "Active Packages",
      value: "2",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      label: "Total Leads Purchased",
      value: "90",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      label: "Leads Remaining",
      value: "45",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100"
    }
  ];

  return (
    <div className="text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Packages</h1>
        <p className="text-gray-600">Choose the perfect package to grow your real estate business.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${
              pkg.popular ? 'border-purple-300 ring-2 ring-purple-200' : 'border-gray-100'
            }`}
            style={{ backgroundColor: 'white' }}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  POPULAR
                </span>
              </div>
            )}

            {/* Package Icon */}
            <div className={`${pkg.bg} w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto`}>
              <div className={`p-3 rounded-lg ${pkg.iconBg} shadow-lg`}>
                <pkg.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Package Name */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {pkg.name}
            </h3>

            {/* Price */}
            <div className="text-center mb-4">
              <p className={`text-4xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                {pkg.price}
              </p>
              <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                Valid for {pkg.duration}
              </p>
            </div>

            {/* Leads Count Badge */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 text-center border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-2xl font-bold text-gray-900">{pkg.leads}</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Verified Leads</p>
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-6">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                pkg.popular
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {pkg.popular ? 'Get Started' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-md text-white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Need a Custom Package?</h2>
          <p className="text-indigo-100 mb-6">
            Looking for something specific? We can create a tailored package that fits your exact requirements.
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            Contact Sales Team
          </button>
        </div>
      </div>
    </div>
  );
}
