import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// Dummy data
const dummyData = {
  stats: {
    totalComponents: 15420,
    installedComponents: 12845,
    pendingInstallations: 1890,
    defectiveComponents: 685,
    totalInspections: 8945,
    activeInspectors: 45,
    installationTeams: 12,
    warehouseLocations: 8
  },
  
  monthlyInstallations: [
    { month: 'Jan', installations: 980, inspections: 756 },
    { month: 'Feb', installations: 1240, inspections: 892 },
    { month: 'Mar', installations: 1180, inspections: 967 },
    { month: 'Apr', installations: 1420, inspections: 1123 },
    { month: 'May', installations: 1680, inspections: 1289 },
    { month: 'Jun', installations: 1590, inspections: 1456 }
  ],
  
  componentTypes: [
    { name: 'Track Components', value: 4200, color: '#3b82f6' },
    { name: 'Signal Equipment', value: 3100, color: '#10b981' },
    { name: 'Safety Systems', value: 2800, color: '#f59e0b' },
    { name: 'Power Systems', value: 2400, color: '#ef4444' },
    { name: 'Communication', value: 1900, color: '#8b5cf6' },
    { name: 'Others', value: 1020, color: '#6b7280' }
  ],
  
  defectTrends: [
    { month: 'Jan', defects: 45, resolved: 42 },
    { month: 'Feb', defects: 52, resolved: 48 },
    { month: 'Mar', defects: 38, resolved: 41 },
    { month: 'Apr', defects: 61, resolved: 55 },
    { month: 'May', defects: 48, resolved: 52 },
    { month: 'Jun', defects: 42, resolved: 46 }
  ],
  
  recentActivities: [
    { id: 1, type: 'installation', message: 'Component TRK-4521 installed at Zone-A', time: '2 mins ago', status: 'success' },
    { id: 2, type: 'inspection', message: 'Defect found in component SIG-7892', time: '5 mins ago', status: 'warning' },
    { id: 3, type: 'installation', message: 'Batch installation completed at Station-12', time: '12 mins ago', status: 'success' },
    { id: 4, type: 'inspection', message: 'Monthly inspection report generated', time: '18 mins ago', status: 'info' },
    { id: 5, type: 'maintenance', message: 'Scheduled maintenance for Zone-C completed', time: '25 mins ago', status: 'success' }
  ],
  
  topPerformers: [
    { name: 'Team Alpha', installations: 245, efficiency: 98 },
    { name: 'Team Beta', installations: 230, efficiency: 95 },
    { name: 'Team Gamma', installations: 215, efficiency: 92 },
    { name: 'Team Delta', installations: 198, efficiency: 89 }
  ],

  manufacturers: [
    {
      id: 'railtech',
      name: 'RailTech Industries Ltd.',
      category: 'Track Fittings & Fasteners',
      location: 'Mumbai, Maharashtra',
      established: '1985',
      rating: 4.8,
      specialization: 'Rail Fasteners, Fish Plates, Elastic Clips'
    },
    {
      id: 'indianrail',
      name: 'Indian Railway Construction Company',
      category: 'Track Infrastructure',
      location: 'Kolkata, West Bengal',
      established: '1978',
      rating: 4.6,
      specialization: 'Rail Joints, Track Sleepers, Ballast Systems'
    },
    {
      id: 'precisiontrack',
      name: 'Precision Track Solutions',
      category: 'Precision Track Components',
      location: 'Chennai, Tamil Nadu',
      established: '1992',
      rating: 4.7,
      specialization: 'Switch & Crossing, Point Machines, Rail Welds'
    },
    {
      id: 'steelrail',
      name: 'Steel Rail Manufacturing Co.',
      category: 'Rail Steel Products',
      location: 'Jamshedpur, Jharkhand',
      established: '1965',
      rating: 4.9,
      specialization: 'Rail Sections, Steel Sleepers, Anchor Bolts'
    },
    {
      id: 'moderntrack',
      name: 'Modern Track Fittings Ltd.',
      category: 'Modern Track Solutions',
      location: 'Pune, Maharashtra',
      established: '1995',
      rating: 4.5,
      specialization: 'Pandrol Clips, Base Plates, Insulation Pads'
    }
  ],

  manufacturerPerformance: {
    railtech: {
      monthlyProduction: [
        { month: 'Jan', produced: 12500, delivered: 12200, defects: 45, revenue: 18.5 },
        { month: 'Feb', produced: 13200, delivered: 12980, defects: 38, revenue: 19.8 },
        { month: 'Mar', produced: 14100, delivered: 13850, defects: 52, revenue: 21.2 },
        { month: 'Apr', produced: 13800, delivered: 13650, defects: 41, revenue: 20.5 },
        { month: 'May', produced: 15200, delivered: 14980, defects: 48, revenue: 22.8 },
        { month: 'Jun', produced: 15800, delivered: 15620, defects: 43, revenue: 23.7 }
      ],
      qualityMetrics: [
        { metric: 'Production Quality', value: 97.2, target: 95.0 },
        { metric: 'Delivery Timeliness', value: 98.1, target: 90.0 },
        { metric: 'Defect Rate', value: 0.28, target: 0.5, inverse: true },
        { metric: 'Customer Satisfaction', value: 4.8, target: 4.5 }
      ],
      componentBreakdown: [
        { type: 'Rail Fasteners', count: 45200, percentage: 42 },
        { type: 'Fish Plates', count: 28500, percentage: 26 },
        { type: 'Elastic Clips', count: 22100, percentage: 20 },
        { type: 'Anchor Bolts', count: 12800, percentage: 12 }
      ]
    },
    indianrail: {
      monthlyProduction: [
        { month: 'Jan', produced: 8500, delivered: 8200, defects: 85, revenue: 25.2 },
        { month: 'Feb', produced: 9200, delivered: 8950, defects: 78, revenue: 27.1 },
        { month: 'Mar', produced: 9800, delivered: 9500, defects: 95, revenue: 28.9 },
        { month: 'Apr', produced: 9400, delivered: 9150, defects: 82, revenue: 27.8 },
        { month: 'May', produced: 10500, delivered: 10200, defects: 110, revenue: 31.2 },
        { month: 'Jun', produced: 11200, delivered: 10850, defects: 105, revenue: 33.6 }
      ],
      qualityMetrics: [
        { metric: 'Production Quality', value: 92.8, target: 95.0 },
        { metric: 'Delivery Timeliness', value: 94.2, target: 90.0 },
        { metric: 'Defect Rate', value: 0.95, target: 0.5, inverse: true },
        { metric: 'Customer Satisfaction', value: 4.6, target: 4.5 }
      ],
      componentBreakdown: [
        { type: 'Track Sleepers', count: 32500, percentage: 55 },
        { type: 'Rail Joints', count: 15200, percentage: 26 },
        { type: 'Ballast Systems', count: 8800, percentage: 15 },
        { type: 'Drainage Components', count: 2400, percentage: 4 }
      ]
    },
    precisiontrack: {
      monthlyProduction: [
        { month: 'Jan', produced: 3200, delivered: 3180, defects: 8, revenue: 28.5 },
        { month: 'Feb', produced: 3450, delivered: 3420, defects: 12, revenue: 30.8 },
        { month: 'Mar', produced: 3680, delivered: 3650, defects: 15, revenue: 32.9 },
        { month: 'Apr', produced: 3520, delivered: 3500, defects: 10, revenue: 31.4 },
        { month: 'May', produced: 3850, delivered: 3820, defects: 18, revenue: 34.6 },
        { month: 'Jun', produced: 4100, delivered: 4070, defects: 22, revenue: 36.8 }
      ],
      qualityMetrics: [
        { metric: 'Production Quality', value: 99.1, target: 95.0 },
        { metric: 'Delivery Timeliness', value: 99.5, target: 90.0 },
        { metric: 'Defect Rate', value: 0.18, target: 0.5, inverse: true },
        { metric: 'Customer Satisfaction', value: 4.9, target: 4.5 }
      ],
      componentBreakdown: [
        { type: 'Switch & Crossing', count: 8200, percentage: 38 },
        { type: 'Point Machines', count: 6800, percentage: 31 },
        { type: 'Rail Welds', count: 4500, percentage: 21 },
        { type: 'Signal Brackets', count: 2300, percentage: 10 }
      ]
    },
    steelrail: {
      monthlyProduction: [
        { month: 'Jan', produced: 18500, delivered: 18200, defects: 95, revenue: 42.8 },
        { month: 'Feb', produced: 19800, delivered: 19450, defects: 115, revenue: 45.6 },
        { month: 'Mar', produced: 21200, delivered: 20850, defects: 128, revenue: 48.9 },
        { month: 'Apr', produced: 20500, delivered: 20200, defects: 118, revenue: 47.2 },
        { month: 'May', produced: 22800, delivered: 22400, defects: 145, revenue: 52.5 },
        { month: 'Jun', produced: 23500, delivered: 23100, defects: 152, revenue: 54.1 }
      ],
      qualityMetrics: [
        { metric: 'Production Quality', value: 99.8, target: 95.0 },
        { metric: 'Delivery Timeliness', value: 98.9, target: 90.0 },
        { metric: 'Defect Rate', value: 0.15, target: 0.5, inverse: true },
        { metric: 'Customer Satisfaction', value: 4.9, target: 4.5 }
      ],
      componentBreakdown: [
        { type: 'Rail Sections (60kg)', count: 68500, percentage: 52 },
        { type: 'Steel Sleepers', count: 35200, percentage: 27 },
        { type: 'Anchor Bolts', count: 18800, percentage: 14 },
        { type: 'Rail Accessories', count: 9200, percentage: 7 }
      ]
    },
    moderntrack: {
      monthlyProduction: [
        { month: 'Jan', produced: 15200, delivered: 14800, defects: 125, revenue: 22.8 },
        { month: 'Feb', produced: 16500, delivered: 16100, defects: 142, revenue: 24.8 },
        { month: 'Mar', produced: 17800, delivered: 17200, defects: 168, revenue: 26.7 },
        { month: 'Apr', produced: 17200, delivered: 16850, defects: 155, revenue: 25.8 },
        { month: 'May', produced: 18900, delivered: 18400, defects: 185, revenue: 28.4 },
        { month: 'Jun', produced: 19600, delivered: 19100, defects: 198, revenue: 29.5 }
      ],
      qualityMetrics: [
        { metric: 'Production Quality', value: 89.2, target: 95.0 },
        { metric: 'Delivery Timeliness', value: 91.8, target: 90.0 },
        { metric: 'Defect Rate', value: 1.02, target: 0.5, inverse: true },
        { metric: 'Customer Satisfaction', value: 4.2, target: 4.5 }
      ],
      componentBreakdown: [
        { type: 'Pandrol Clips', count: 52800, percentage: 46 },
        { type: 'Base Plates', count: 31200, percentage: 27 },
        { type: 'Insulation Pads', count: 20500, percentage: 18 },
        { type: 'Track Bolts', count: 10300, percentage: 9 }
      ]
    }
  }
};

const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedManufacturer, setSelectedManufacturer] = useState('railtech');
  const [stats, setStats] = useState(dummyData.stats);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalInspections: prev.totalInspections + Math.floor(Math.random() * 3),
        activeInspectors: 45 + Math.floor(Math.random() * 10) - 5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:border-blue-400/50 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600"></div>
      <div className="flex justify-between items-center mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${
          color === 'blue' ? 'bg-blue-500/20 border-blue-400/40' :
          color === 'green' ? 'bg-green-500/20 border-green-400/40' :
          color === 'orange' ? 'bg-orange-500/20 border-orange-400/40' :
          color === 'red' ? 'bg-red-500/20 border-red-400/40' :
          color === 'purple' ? 'bg-purple-500/20 border-purple-400/40' :
          color === 'teal' ? 'bg-teal-500/20 border-teal-400/40' :
          color === 'indigo' ? 'bg-indigo-500/20 border-indigo-400/40' :
          'bg-gray-500/20 border-gray-400/40'
        }`}>
          {icon}
        </div>
        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-400/30">
          +{change}%
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {value.toLocaleString()}
        </h3>
        <p className="text-sm text-slate-400 font-semibold">{title}</p>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className={`flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border-l-4 transition-all duration-300 hover:bg-slate-700/50 hover:translate-x-1 ${
      activity.status === 'success' ? 'border-l-green-500' :
      activity.status === 'warning' ? 'border-l-orange-500' :
      activity.status === 'info' ? 'border-l-blue-500' :
      'border-l-blue-500'
    }`}>
      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-base">
        {activity.type === 'installation' && '🔧'}
        {activity.type === 'inspection' && '🔍'}
        {activity.type === 'maintenance' && '⚙️'}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-200 mb-1">{activity.message}</p>
        <span className="text-xs text-slate-400 font-medium">{activity.time}</span>
      </div>
    </div>
  );

  const ManufacturerCard = ({ manufacturer, isSelected, onClick }) => (
    <div 
      className={`bg-slate-800/80 backdrop-blur-lg border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 relative overflow-hidden ${
        isSelected 
          ? 'border-blue-400/80 shadow-lg shadow-blue-500/30 bg-blue-500/10' 
          : 'border-slate-600/50'
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
      )}
      <div className="flex justify-between items-center mb-3">
        <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-bold border border-orange-400/40">
          ★ {manufacturer.rating}
        </div>
        <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400/40">
          {manufacturer.category}
        </div>
      </div>
      <h4 className="text-lg font-bold text-white mb-3 leading-tight">{manufacturer.name}</h4>
      <div className="space-y-1">
        <p className="text-sm text-slate-400 font-medium">📍 {manufacturer.location}</p>
        <p className="text-sm text-slate-400 font-medium">📅 Est. {manufacturer.established}</p>
      </div>
    </div>
  );

  const QualityMetricBar = ({ metric }) => (
    <div className="bg-slate-700/30 rounded-xl p-4 border border-blue-400/20">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-gray-200">{metric.metric}</span>
        <span className="text-base font-bold text-white">
          {metric.metric === 'Customer Satisfaction' ? metric.value : `${metric.value}%`}
        </span>
      </div>
      <div className="relative h-2 bg-slate-600/50 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 ${
            metric.inverse 
              ? (metric.value <= metric.target ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600')
              : (metric.value >= metric.target ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600')
          }`}
          style={{ 
            width: metric.metric === 'Customer Satisfaction' 
              ? `${(metric.value / 5) * 100}%`
              : `${metric.value}%` 
          }}
        ></div>
        <div 
          className="absolute top-[-2px] h-3 w-0.5 bg-orange-400 transform -translate-x-1/2"
          style={{
            left: metric.metric === 'Customer Satisfaction' 
              ? `${(metric.target / 5) * 100}%`
              : `${metric.target}%`
          }}
        >
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 text-orange-400 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
            Target: {metric.metric === 'Customer Satisfaction' ? metric.target : `${metric.target}%`}
          </div>
        </div>
      </div>
    </div>
  );

  const selectedManufacturerData = dummyData.manufacturerPerformance[selectedManufacturer];
  const selectedManufacturerInfo = dummyData.manufacturers.find(m => m.id === selectedManufacturer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white font-sans relative">
      {/* Animated Background Orbs */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 rounded-full bg-gradient-radial from-blue-500/10 to-transparent z-0 animate-pulse"></div>
      <div className="fixed top-3/5 right-1/5 w-60 h-60 rounded-full bg-gradient-radial from-green-500/8 to-transparent z-0 animate-pulse delay-1000"></div>

      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-blue-400/30 px-8 py-6 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-blue-500/40 animate-pulse">
              🚂
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                Railway QR System
              </h1>
              <p className="text-base text-slate-400 font-semibold">Admin Dashboard - Ministry of Railways</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-slate-700/60 border border-blue-400/40 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none cursor-pointer transition-all duration-300 hover:border-blue-400/60 hover:bg-slate-700/80"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/40 px-4 py-2 rounded-full text-sm font-semibold text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              Live
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/60 backdrop-blur-lg px-8 py-4 flex gap-2 border-b border-slate-700/50 relative z-10">
        <button 
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'overview' 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/60 text-white shadow-lg shadow-blue-500/30' 
              : 'border border-slate-600/50 text-slate-400 hover:bg-slate-700/30 hover:text-gray-200 hover:border-blue-400/40'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'components' 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/60 text-white shadow-lg shadow-blue-500/30' 
              : 'border border-slate-600/50 text-slate-400 hover:bg-slate-700/30 hover:text-gray-200 hover:border-blue-400/40'
          }`}
          onClick={() => setActiveTab('components')}
        >
          🔧 Components
        </button>
        <button 
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'inspections' 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/60 text-white shadow-lg shadow-blue-500/30' 
              : 'border border-slate-600/50 text-slate-400 hover:bg-slate-700/30 hover:text-gray-200 hover:border-blue-400/40'
          }`}
          onClick={() => setActiveTab('inspections')}
        >
          🔍 Inspections
        </button>
        <button 
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'teams' 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/60 text-white shadow-lg shadow-blue-500/30' 
              : 'border border-slate-600/50 text-slate-400 hover:bg-slate-700/30 hover:text-gray-200 hover:border-blue-400/40'
          }`}
          onClick={() => setActiveTab('teams')}
        >
          👥 Teams
        </button>
        <button 
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'manufacturers' 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/60 text-white shadow-lg shadow-blue-500/30' 
              : 'border border-slate-600/50 text-slate-400 hover:bg-slate-700/30 hover:text-gray-200 hover:border-blue-400/40'
          }`}
          onClick={() => setActiveTab('manufacturers')}
        >
          🏭 Manufacturers
        </button>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 max-w-7xl mx-auto relative z-10">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Components" 
                value={stats.totalComponents} 
                change={12.5} 
                icon="📦" 
                color="blue"
              />
              <StatCard 
                title="Installed Components" 
                value={stats.installedComponents} 
                change={8.3} 
                icon="✅" 
                color="green"
              />
              <StatCard 
                title="Pending Installations" 
                value={stats.pendingInstallations} 
                change={-2.1} 
                icon="⏳" 
                color="orange"
              />
              <StatCard 
                title="Defective Components" 
                value={stats.defectiveComponents} 
                change={-15.8} 
                icon="⚠️" 
                color="red"
              />
              <StatCard 
                title="Total Inspections" 
                value={stats.totalInspections} 
                change={18.2} 
                icon="🔍" 
                color="purple"
              />
              <StatCard 
                title="Active Inspectors" 
                value={stats.activeInspectors} 
                change={5.4} 
                icon="👤" 
                color="teal"
              />
              <StatCard 
                title="Installation Teams" 
                value={stats.installationTeams} 
                change={0} 
                icon="👥" 
                color="indigo"
              />
              <StatCard 
                title="Warehouse Locations" 
                value={stats.warehouseLocations} 
                change={0} 
                icon="🏢" 
                color="gray"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Installation & Inspection Trends */}
              <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-black/30">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold text-white">📈 Installation & Inspection Trends</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      Installations
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      Inspections
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dummyData.monthlyInstallations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="installations" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="inspections" 
                      stackId="2" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Component Distribution */}
              <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-black/30">
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-white">🔧 Component Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dummyData.componentTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {dummyData.componentTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {dummyData.componentTypes.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-black/30">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-white">🕒 Recent Activities</h3>
                  <button className="bg-slate-700/50 border border-blue-400/30 rounded-lg text-slate-400 p-2 transition-all duration-300 hover:bg-slate-700/80 hover:border-blue-400/50 hover:text-white">
                    🔄
                  </button>
                </div>
                <div className="space-y-3">
                  {dummyData.recentActivities.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-black/30">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white">🏆 Top Performing Teams</h3>
                </div>
                <div className="space-y-4">
                  {dummyData.topPerformers.map((team, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl transition-all duration-300 hover:bg-slate-700/50 hover:translate-y-[-2px]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{team.name}</h4>
                        <p className="text-sm text-slate-400 font-medium">{team.installations} installations</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-slate-600/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                            style={{ width: `${team.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-green-400 min-w-[40px]">{team.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="animate-fade-in">
            <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">📊 Component Status Overview</h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dummyData.componentTypes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }} 
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'inspections' && (
          <div className="animate-fade-in">
            <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">🔍 Defect Trends Analysis</h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dummyData.defectTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="defects" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="animate-fade-in">
            <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">👥 Team Performance Metrics</h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dummyData.topPerformers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }} 
                  />
                  <Bar dataKey="installations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="efficiency" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'manufacturers' && (
          <div className="space-y-8 animate-fade-in">
            {/* Manufacturer Selection Cards */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6">Select Manufacturer to View Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {dummyData.manufacturers.map(manufacturer => (
                  <ManufacturerCard
                    key={manufacturer.id}
                    manufacturer={manufacturer}
                    isSelected={selectedManufacturer === manufacturer.id}
                    onClick={() => setSelectedManufacturer(manufacturer.id)}
                  />
                ))}
              </div>
            </div>

            {/* Selected Manufacturer Performance Dashboard */}
            {selectedManufacturerData && selectedManufacturerInfo && (
              <div className="space-y-8">
                <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600"></div>
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      🏭 {selectedManufacturerInfo.name}
                    </h2>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-400/40 rounded-full px-5 py-3">
                      <span className="text-orange-400 text-xl">★</span>
                      <span className="text-orange-400 font-bold text-lg">{selectedManufacturerInfo.rating}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-xl border border-blue-400/20">
                      <span className="text-sm font-semibold text-slate-400">Category:</span>
                      <span className="text-sm font-bold text-white">{selectedManufacturerInfo.category}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-xl border border-blue-400/20">
                      <span className="text-sm font-semibold text-slate-400">Location:</span>
                      <span className="text-sm font-bold text-white">{selectedManufacturerInfo.location}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-xl border border-blue-400/20">
                      <span className="text-sm font-semibold text-slate-400">Established:</span>
                      <span className="text-sm font-bold text-white">{selectedManufacturerInfo.established}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Production & Delivery Trends */}
                  <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xl font-bold text-white">📈 Production & Delivery Performance</h3>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          Produced
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          Delivered
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          Defects
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={selectedManufacturerData.monthlyProduction}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#f1f5f9'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="produced" 
                          stackId="1" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.4}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="delivered" 
                          stackId="2" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.4}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="defects" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue Trends */}
                  <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl">
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-white">💰 Revenue Trends (₹ Crores)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={selectedManufacturerData.monthlyProduction}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#f1f5f9'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#f59e0b" 
                          strokeWidth={4}
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quality Metrics & Component Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quality Metrics */}
                  <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl">
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-white">🎯 Quality Metrics vs Targets</h3>
                    </div>
                    <div className="space-y-5">
                      {selectedManufacturerData.qualityMetrics.map((metric, index) => (
                        <QualityMetricBar key={index} metric={metric} />
                      ))}
                    </div>
                  </div>

                  {/* Component Breakdown */}
                  <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl">
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-white">🔧 Component Production Breakdown</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={selectedManufacturerData.componentBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="count"
                          label={({ percentage }) => `${percentage}%`}
                        >
                          {selectedManufacturerData.componentBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={dummyData.componentTypes[index]?.color || '#6b7280'} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#f1f5f9'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {selectedManufacturerData.componentBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: dummyData.componentTypes[index]?.color || '#6b7280' }}
                          ></div>
                          <span className="text-xs font-semibold text-slate-400 flex-1">{item.type}</span>
                          <span className="text-xs font-bold text-white">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Summary Cards */}
                <div className="space-y-5">
                  <h3 className="text-2xl font-bold text-white text-center">📊 Performance Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 text-center transition-all duration-300 hover:translate-y-[-4px] hover:border-blue-400/50 hover:shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                      <div className="text-3xl mb-3">🏭</div>
                      <div>
                        <h4 className="text-base font-semibold text-slate-400 mb-2">Total Production</h4>
                        <p className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          {selectedManufacturerData.monthlyProduction.reduce((sum, item) => sum + item.produced, 0).toLocaleString()}
                        </p>
                        <span className="text-sm text-slate-400 font-medium">Components</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 text-center transition-all duration-300 hover:translate-y-[-4px] hover:border-blue-400/50 hover:shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                      <div className="text-3xl mb-3">🚚</div>
                      <div>
                        <h4 className="text-base font-semibold text-slate-400 mb-2">Total Delivered</h4>
                        <p className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          {selectedManufacturerData.monthlyProduction.reduce((sum, item) => sum + item.delivered, 0).toLocaleString()}
                        </p>
                        <span className="text-sm text-slate-400 font-medium">Components</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 text-center transition-all duration-300 hover:translate-y-[-4px] hover:border-blue-400/50 hover:shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                      <div className="text-3xl mb-3">⚠️</div>
                      <div>
                        <h4 className="text-base font-semibold text-slate-400 mb-2">Total Defects</h4>
                        <p className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          {selectedManufacturerData.monthlyProduction.reduce((sum, item) => sum + item.defects, 0)}
                        </p>
                        <span className="text-sm text-slate-400 font-medium">Defective Units</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 text-center transition-all duration-300 hover:translate-y-[-4px] hover:border-blue-400/50 hover:shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                      <div className="text-3xl mb-3">💰</div>
                      <div>
                        <h4 className="text-base font-semibold text-slate-400 mb-2">Total Revenue</h4>
                        <p className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          ₹{selectedManufacturerData.monthlyProduction.reduce((sum, item) => sum + item.revenue, 0).toFixed(1)}
                        </p>
                        <span className="text-sm text-slate-400 font-medium">Crores</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;