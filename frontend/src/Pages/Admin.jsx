import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaClipboardList,
  FaBell,
  FaUser,
  FaHome,
  FaRuler,
  FaBox,
  FaPercent,
  FaBars,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaDownload,
  FaChartLine,
  FaShoppingCart,
} from "react-icons/fa";
import CustomersList from "../Subpages/CustomersList.jsx";
import AdminOrders from "../Subpages/AdminOrders.jsx";
import AdminInventory from "../Subpages/AdminInventory.jsx";
import AdminNotifications from "../Subpages/AdminNotifications.jsx";
import PromoCodes from "../Subpages/PromoCodes.jsx";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [completedByDate, setCompletedByDate] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Adjust navbar height here if your navbar is different (e.g., 70px, 80px, etc.)
  const NAVBAR_HEIGHT = '70px';

  const sections = [
    { 
      name: "overview", 
      label: "Dashboard", 
      icon: <FaHome className="w-4 h-4" />, 
      badge: null 
    },
    { 
      name: "customers", 
      label: "Customers", 
      icon: <FaUsers className="w-4 h-4" />, 
      badge: totalCustomers 
    },
    { 
      name: "orders", 
      label: "Orders", 
      icon: <FaClipboardList className="w-4 h-4" />, 
      badge: pendingOrders 
    },
    { 
      name: "measurements", 
      label: "Measurements", 
      icon: <FaRuler className="w-4 h-4" />, 
      badge: null 
    },
    { 
      name: "inventory", 
      label: "Inventory", 
      icon: <FaBox className="w-4 h-4" />, 
      badge: null 
    },
    { 
      name: "notifications", 
      label: "Notifications", 
      icon: <FaBell className="w-4 h-4" />, 
      badge: null 
    },
    { 
      name: "promo_codes", 
      label: "Promo Codes", 
      icon: <FaPercent className="w-4 h-4" />, 
      badge: null 
    },
    { 
      name: "profile", 
      label: "Profile", 
      icon: <FaUser className="w-4 h-4" />, 
      badge: null 
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [
          customersRes,
          ordersRes,
          statsRes,
          ordersByDateRes,
          completedByDateRes,
          dailyRevenueRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/customers/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/orders/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/orders/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/orders/daily-stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            "http://localhost:5000/api/admin/orders/completed-daily-stats",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get("http://localhost:5000/api/admin/orders/daily-revenue", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTotalCustomers(customersRes.data.count || 0);
        setTotalOrders(ordersRes.data.count || 0);
        setPendingOrders(statsRes.data.pendingOrders || 0);
        setCompletedOrders(statsRes.data.completedOrders || 0);
        setOrdersByDate(ordersByDateRes.data || []);
        setCompletedByDate(completedByDateRes.data || []);
        setDailyRevenue(dailyRevenueRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeSection === "overview") {
      fetchStats();
    }
  }, [activeSection]);

  const stats = [
    { 
      title: "Total Customers", 
      value: totalCustomers, 
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: <FaUsers className="w-6 h-6" />,
      change: "+12.5%",
      changeType: "positive",
      description: "Active users"
    },
    { 
      title: "Total Orders", 
      value: totalOrders, 
      color: "bg-gradient-to-br from-green-500 to-green-600",
      icon: <FaShoppingCart className="w-6 h-6" />,
      change: "+8.3%",
      changeType: "positive",
      description: "All time orders"
    },
    { 
      title: "Pending Orders", 
      value: pendingOrders, 
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      icon: <FaClipboardList className="w-6 h-6" />,
      change: "-2.1%",
      changeType: "negative",
      description: "Awaiting processing"
    },
    { 
      title: "Completed Orders", 
      value: completedOrders, 
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      icon: <FaChartLine className="w-6 h-6" />,
      change: "+15.7%",
      changeType: "positive",
      description: "Successfully delivered"
    },
  ];

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
        <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
      </div>
      <p className="text-gray-600 font-semibold text-lg">Loading dashboard data...</p>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Enhanced Header */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent -mt-28 mb-3">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  Welcome back! Here's what's happening with your business today.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all duration-200 font-medium shadow-sm text-sm"
                >
                  <FaCalendarAlt className="w-3 h-3" />
                  Last 30 days
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg text-sm"
                >
                  <FaDownload className="w-3 h-3" />
                  Export Report
                </motion.button>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className={`${stat.color} text-white rounded-xl p-5 shadow-lg relative overflow-hidden`}
                    >
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -translate-y-4 translate-x-4"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white bg-opacity-5 rounded-full translate-y-2 -translate-x-2"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                            {stat.icon}
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                            stat.changeType === 'positive' 
                              ? 'bg-green-100 bg-opacity-90 text-green-800' 
                              : 'bg-red-100 bg-opacity-90 text-red-800'
                          }`}>
                            {stat.changeType === 'positive' ? 
                              <FaArrowUp className="w-2 h-2" /> : 
                              <FaArrowDown className="w-2 h-2" />
                            }
                            {stat.change}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{stat.value.toLocaleString()}</h3>
                          <p className="text-base font-semibold opacity-90">{stat.title}</p>
                          <p className="text-xs opacity-75 mt-1">{stat.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Orders Received Chart */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Orders Received</h3>
                      <p className="text-gray-600 text-sm">Daily order trends</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={ordersByDate}>
                        <defs>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          fill="url(#colorOrders)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Completed Orders Chart */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Completed Orders</h3>
                      <p className="text-gray-600 text-sm">Weekly completion rate</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={completedByDate}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Revenue Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Revenue by Day</h3>
                      <p className="text-gray-600 text-sm">Daily revenue trends</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={dailyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip 
                          formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ r: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* Enhanced Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Quick Actions</h3>
                    <p className="text-gray-600 text-sm">Frequently used actions and shortcuts</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection("customers")}
                      className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group"
                    >
                      <div className="p-2 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
                        <FaUsers className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 text-sm">View All Customers</p>
                        <p className="text-xs text-blue-600">Manage customer data</p>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection("orders")}
                      className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 group"
                    >
                      <div className="p-2 bg-green-500 text-white rounded-lg group-hover:bg-green-600 transition-colors">
                        <FaClipboardList className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 text-sm">Manage Orders</p>
                        <p className="text-xs text-green-600">Process and track orders</p>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection("notifications")}
                      className="flex items-center gap-3 p-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-200 group"
                    >
                      <div className="p-2 bg-red-500 text-white rounded-lg group-hover:bg-red-600 transition-colors">
                        <FaBell className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 text-sm">Check Notifications</p>
                        <p className="text-xs text-red-600">View updates</p>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        );

      case "customers":
        return <CustomersList />;
      case "orders":
        return <AdminOrders />;
      case "measurements":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg">
                <FaRuler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Measurement Guidelines</h3>
                <p className="text-gray-600 text-sm">Manage measurement instructions for all dress types.</p>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-700">Measurement system will be implemented here...</p>
            </div>
          </motion.div>
        );
      case "inventory":
        return <AdminInventory />;
      case "notifications":
        return <AdminNotifications />;
      case "promo_codes":
        return <PromoCodes />;
      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-md mx-auto"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Profile</h3>
              <p className="text-gray-600 text-sm">Manage your account settings</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg"
            >
              Logout
            </motion.button>
          </motion.div>
        );
      default:
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Section Not Found</h3>
            <p className="text-gray-600 text-sm">The requested section could not be found.</p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Global Styles */}
      <style jsx global>{`
        .admin-dashboard-container {
          --navbar-height: ${NAVBAR_HEIGHT};
          --sidebar-width: 256px;
        }

        /* Custom scrollbar styling for sidebar */
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 transparent;
        }
        
        .sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
          border-radius: 10px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0,0,0,0.4);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      <div className="admin-dashboard-container bg-gradient-to-br from-gray-50 to-gray-100">
        
        {/* Mobile Menu Button - Only visible on mobile when sidebar is needed */}
        <div 
          className="lg:hidden fixed bg-white/95 backdrop-blur-sm border-b border-gray-200 w-full flex items-center justify-between px-4 py-3 z-40"
          style={{ top: NAVBAR_HEIGHT }}
        >
          <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </motion.button>
        </div>

        {/* SIDEBAR - Positioned under your existing navbar */}
        <aside 
          className={`
            fixed left-0 w-64 bg-white shadow-lg border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out z-30
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0
          `}
          style={{ 
            top: NAVBAR_HEIGHT, 
            height: `calc(100vh - ${NAVBAR_HEIGHT})` 
          }}
        >
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center shadow-md">
                <FaChartLine className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Dashboard</h2>
                <p className="text-xs text-blue-100 font-medium">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav 
            className="flex-1 p-3 space-y-1 sidebar-scroll" 
            style={{ 
              height: `calc(100vh - ${NAVBAR_HEIGHT} - 160px)`,
              overflowY: 'auto'
            }}
          >
            {sections.map((sec) => {
              const isActive = activeSection === sec.name;
              return (
                <motion.button
                  key={sec.name}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-2 border-transparent"
                  }`}
                  onClick={() => handleSectionClick(sec.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      {sec.icon}
                    </div>
                    <span className="font-medium text-sm">{sec.label}</span>
                  </div>
                  {sec.badge && (
                    <span className={`px-2 py-1 text-xs font-bold rounded-full transition-colors duration-200 ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      {sec.badge > 99 ? '99+' : sec.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Sidebar Footer - Always Visible */}
          <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-gray-50">
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <FaUser className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-xs truncate">Administrator</p>
                <p className="text-xs text-gray-500 truncate">admin@company.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
            style={{ top: `calc(${NAVBAR_HEIGHT} + 60px)` }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT - FIXED: Properly positioned to the right of sidebar */}
        <div className="flex">
          {/* Sidebar Space Placeholder for Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0"></div>
          
          {/* Main Content Area */}
          <main 
            className="flex-1 min-h-screen z-10 relative"
            style={{ 
              paddingTop: `calc(${NAVBAR_HEIGHT} + 60px)`,
              marginLeft: '0'
            }}
          >
            <div className="p-4 md:p-6">
              {renderMainContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
