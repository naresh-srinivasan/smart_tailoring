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
} from "recharts";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [ completedByDate, setCompletedByDate] = useState([]);
  const [loading, setLoading] = useState(true);

  const sections = [
    { name: "overview", label: "Dashboard Overview", icon: <FaHome /> },
    { name: "customers", label: "Customers", icon: <FaUsers /> },
    { name: "orders", label: "Orders", icon: <FaClipboardList /> },
    { name: "measurements", label: "Measurements", icon: <FaRuler /> },
    { name: "inventory", label: "Inventory", icon: <FaBox /> },
    { name: "notifications", label: "Notifications", icon: <FaBell /> },
    { name: "promo_codes", label: "Promo Codes", icon: <FaPercent /> },
    { name: "profile", label: "Profile", icon: <FaUser /> },
  ];

  // Fetch stats from backend
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
          completedByDateRes
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/customers/count", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/orders/count", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/orders/stats", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/orders/daily-stats", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/orders/completed-daily-stats", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setTotalCustomers(customersRes.data.count || 0);
        setTotalOrders(ordersRes.data.count || 0);
        setPendingOrders(statsRes.data.pendingOrders || 0);
        setCompletedOrders(statsRes.data.completedOrders || 0);
        setOrdersByDate(ordersByDateRes.data || []);
        setCompletedByDate(completedByDateRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch stats when on overview section
    if (activeSection === "overview") {
      fetchStats();
    }
  }, [activeSection]);

  const stats = [
    { title: "Total Customers", value: totalCustomers, color: "bg-blue-500" },
    { title: "Total Orders", value: totalOrders, color: "bg-yellow-500" },
    { title: "Pending Orders", value: pendingOrders, color: "bg-red-500" },
    { title: "Completed Orders", value: completedOrders, color: "bg-green-500" },
  ];

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Render main content based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
              <div className="text-sm text-gray-500">
                Welcome back! Here's what's happening with your business.
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading dashboard...</span>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className={`${stat.color} text-white shadow-lg rounded-2xl p-6 flex flex-col justify-between`}
                      whileHover={{ scale: 1.03 }}
                    >
                      <h3 className="text-lg font-semibold">{stat.title}</h3>
                      <p className="text-3xl font-bold mt-4">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="bg-white shadow-lg rounded-2xl p-6 flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">
                      Orders Received
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={ordersByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#2563eb"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white shadow-lg rounded-2xl p-6 flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-green-600">
                      Completed Orders
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={completedByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#16a34a"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow-lg rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveSection("customers")}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition flex items-center gap-2"
                    >
                      <FaUsers />
                      View All Customers
                    </button>
                    <button
                      onClick={() => setActiveSection("orders")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg transition flex items-center gap-2"
                    >
                      <FaClipboardList />
                      Manage Orders
                    </button>
                    <button
                      onClick={() => setActiveSection("notifications")}
                      className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transition flex items-center gap-2"
                    >
                      <FaBell />
                      Check Notifications
                    </button>
                  </div>
                </div>
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
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              Measurement Guidelines
            </h3>
            <p className="text-gray-600 mb-4">
              Manage measurement instructions for all dress types.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Blouse Measurements</h4>
                <p className="text-sm text-gray-600">Chest, Length, Shoulder, Sleeve measurements required</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Saree Measurements</h4>
                <p className="text-sm text-gray-600">Blouse and petticoat measurements needed</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">Lehenga Measurements</h4>
                <p className="text-sm text-gray-600">Choli, Skirt length and waist measurements</p>
              </div>
            </div>
          </div>
        );

      case "inventory":
        return <AdminInventory />;

      case "notifications":
        return <AdminNotifications />;

      case "promo_codes":
        return <PromoCodes />;

      case "profile":
        return (
          <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              Admin Profile
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-lg" />
                </div>
                <div>
                  <p className="font-semibold">Admin User</p>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>
              <hr />
              <div>
                <p className="mb-2">
                  <span className="font-semibold">Name:</span> Admin
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Email:</span> admin@weavenest.com
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full mt-6 px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-600">
              Section Not Found
            </h3>
            <p>Please select a valid section from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col p-6 space-y-4 fixed h-full overflow-y-auto z-40">
        <h2 className="text-3xl font-bold mb-8 tracking-wide">Admin Panel</h2>
        {sections.map((sec) => (
          <motion.div
            key={sec.name}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              activeSection === sec.name
                ? "bg-white text-blue-600 font-semibold shadow-lg"
                : "hover:bg-blue-600 hover:bg-opacity-80"
            }`}
            onClick={() => handleSectionClick(sec.name)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-lg">{sec.icon}</span>
            <span>{sec.label}</span>
          </motion.div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {renderMainContent()}
      </main>
    </div>
  );
}