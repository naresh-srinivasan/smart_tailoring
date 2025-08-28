// src/Components/NavBar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import io from "socket.io-client";
import profileimg from "../Assests/profile.png";

const SOCKET_SERVER_URL = "http://localhost:5000";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profileImage = user?.profileImage || profileimg;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setIsOpen(false);
    navigate("/login");
  };

  // Scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${SOCKET_SERVER_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ✅ Socket.io live updates
  useEffect(() => {
    fetchNotifications();
    if (!user) return;

    const socket = io(SOCKET_SERVER_URL);
    socket.on(`notification-${user.id}`, (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ Fixed Navigate to Notifications Page
  const goToNotifications = () => {
    if (!user) return;
    
    console.log("Navigating to notifications, user role:", user.role);
    
    if (user.role?.toLowerCase() === "admin") {
      navigate("/admin/notifications");
    } else {
      navigate("/dashboard/notifications");
    }
    setProfileOpen(false);
    setIsOpen(false);
  };

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/designs", label: "Designs" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg shadow-gray-900/5' 
          : 'bg-white/90 backdrop-blur-md'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="group flex items-center space-x-3"
        >
          <motion.div
            className="text-3xl md:text-4xl font-bold select-none bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-blue-600 transition-all duration-500"
            style={{ fontFamily: "'Dancing Script', cursive" }}
            whileHover={{ scale: 1.05 }}
          >
            Weave Nest
          </motion.div>
          <motion.div
            className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-2">
          {menuItems.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `relative text-gray-700 hover:text-indigo-600 font-medium text-base transition-all duration-300 px-5 py-2.5 rounded-lg hover:bg-indigo-50 ${
                    isActive ? "text-indigo-600 bg-indigo-50 border border-indigo-100" : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-6">
          {/* 🔔 Notifications */}
          {user && (
            <motion.div
              className="relative cursor-pointer p-3 rounded-lg bg-gray-100 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 transition-all duration-300"
              onClick={goToNotifications}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBell className="text-lg text-gray-600 hover:text-indigo-600 transition-colors" />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 min-w-[18px] h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </motion.div>
          )}

          {/* 👤 Profile / Login */}
          {user ? (
            <div className="relative">
              <motion.div
                className="flex items-center space-x-3 cursor-pointer p-2 pl-3 pr-4 rounded-lg bg-gray-100 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-8 w-8 rounded-full border-2 border-indigo-300 object-cover"
                    onError={(e) => {
                      e.target.src = profileimg;
                    }}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
                <motion.div
                  className="text-gray-400"
                  animate={{ rotate: profileOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ▼
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-lg rounded-xl border border-gray-200 shadow-2xl shadow-gray-900/10 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="h-12 w-12 rounded-full border-2 border-indigo-300 object-cover"
                            onError={(e) => {
                              e.target.src = profileimg;
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <div className="text-gray-800 font-semibold text-sm">
                            {user.name || 'User'}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {user.email}
                          </div>
                          <div className="text-indigo-600 text-xs font-medium">
                            {user.role || 'Customer'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <motion.div
                        className="px-4 py-3 cursor-pointer hover:bg-indigo-50 rounded-lg text-gray-700 hover:text-indigo-600 transition-all duration-200 text-sm flex items-center space-x-3"
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          navigate(
                            user.role?.toLowerCase() === "admin"
                              ? "/admin/dashboard"
                              : "/dashboard"
                          );
                          setProfileOpen(false);
                        }}
                      >
                        <span className="text-indigo-500">👤</span>
                        <span>{user.role === "Admin" ? "Admin Dashboard" : "My Profile"}</span>
                      </motion.div>
                      <motion.div
                        className="px-4 py-3 cursor-pointer hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-all duration-200 text-sm flex items-center space-x-3"
                        whileHover={{ x: 4 }}
                        onClick={handleLogout}
                      >
                        <span className="text-red-500">🚪</span>
                        <span>Logout</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.div
          className="md:hidden text-2xl text-gray-600 cursor-pointer p-2 rounded-lg hover:bg-gray-100 hover:text-indigo-600 transition-colors"
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white/98 backdrop-blur-lg border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 py-6 space-y-2">
              {menuItems.map(({ path, label }, index) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 ${
                        isActive ? "text-indigo-600 bg-indigo-50 border-l-4 border-indigo-500" : ""
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="my-4 border-t border-gray-200" />

              {user ? (
                <>
                  <motion.div
                    className="px-4 py-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => {
                      navigate(
                        user.role?.toLowerCase() === "admin"
                          ? "/admin/dashboard"
                          : "/dashboard"
                      );
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-indigo-500">👤</span>
                    <span>{user.role === "Admin" ? "Admin Dashboard" : "My Profile"}</span>
                  </motion.div>

                  <motion.div
                    className="px-4 py-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={goToNotifications}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-indigo-500">🔔</span>
                      <span>Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </motion.div>

                  <motion.div
                    className="px-4 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={handleLogout}
                  >
                    <span className="text-red-500">🚪</span>
                    <span>Logout</span>
                  </motion.div>
                </>
              ) : (
                <motion.button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                >
                  Login
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
