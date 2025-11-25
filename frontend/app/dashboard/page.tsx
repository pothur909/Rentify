

// OverviewPage.tsx
import { TrendingUp, Users, CheckCircle, Package } from "lucide-react";

export default function OverviewPage() {
  const stats = {
    totalLeads: 30,
    contactedLeads: 20,
    convertedLeads: 10,
    totalPackages: 5,
  };

  const cards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Contacted Leads",
      value: stats.contactedLeads,
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-500",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Converted Leads",
      value: stats.convertedLeads,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      iconBg: "bg-green-500",
      change: "+15%",
      changeType: "increase"
    },
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: Package,
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      iconBg: "bg-orange-500",
      change: "+3",
      changeType: "increase"
    },
  ];

  return (
    <div className="text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your leads today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.iconBg} shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                card.changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {card.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold text-green-600">33.3%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Response Rate</span>
              <span className="font-semibold text-blue-600">66.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Packages</span>
              <span className="font-semibold text-purple-600">{stats.totalPackages}</span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-md text-white">
          <h2 className="text-xl font-bold mb-4">Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-indigo-100">Lead Goal</span>
                <span className="text-sm font-semibold">75%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-indigo-100">Conversion Goal</span>
                <span className="text-sm font-semibold">50%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: "50%" }}></div>
              </div>
            </div>
            <p className="text-sm text-indigo-100 mt-4">
              You're doing great! Keep up the momentum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}