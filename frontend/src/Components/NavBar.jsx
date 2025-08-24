// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaBars, FaTimes, FaBell } from "react-icons/fa";
// import { useActivePage } from "../Components/ActivePage";
// import profileIcon from "../images/user.png";
// import axios from "axios";
// import io from "socket.io-client";

// const SOCKET_SERVER_URL = "http://localhost:5000";

// export default function NavBar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const { activePage, setActivePage, loggedIn, setLoggedIn, role, userId } = useActivePage();

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const handleClick = (page) => {
//     setActivePage(page);
//     setIsOpen(false);
//     setProfileOpen(false);
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setActivePage("home");
//     setProfileOpen(false);
//     setIsOpen(false);
//     localStorage.removeItem("token");
//   };

//   const fetchNotifications = async () => {
//     if (!loggedIn) return;
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${SOCKET_SERVER_URL}/api/notifications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications(res.data.notifications || []);
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//     }
//   };

//   const markAsRead = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`${SOCKET_SERVER_URL}/api/notifications/${id}/read`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
//     } catch (err) {
//       console.error("Error marking notification as read:", err);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     if (!loggedIn) return;

//     const socket = io(SOCKET_SERVER_URL);

//     socket.on("connect", () => console.log("Connected to socket server:", socket.id));

//     // Listen to user-specific notifications
//     socket.on(`notification-${userId}`, (notification) => {
//       setNotifications(prev => [notification, ...prev]);
//     });

//     return () => socket.disconnect();
//   }, [loggedIn, userId]);

//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <motion.nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50"
//       initial={{ y: -80, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//     >
//       <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center relative">
//         <h2 className="text-3xl font-bold cursor-pointer"
//             style={{ fontFamily: "'Dancing Script', cursive", color: "#286fad" }}
//             onClick={() => handleClick("home")}>
//           Weave Nest
//         </h2>

//         <ul className="hidden md:flex space-x-10 text-[#286fad] font-medium text-lg">
//           {["home", "about", "designs", "contact"].map(item => (
//             <li key={item} className="cursor-pointer hover:text-[#1f5685] transition"
//                 onClick={() => handleClick(item)}>
//               {item.charAt(0).toUpperCase() + item.slice(1)}
//             </li>
//           ))}
//         </ul>

//         <div className="hidden md:flex items-center space-x-5 relative">
//           {loggedIn && (
//             <div className="relative cursor-pointer" onClick={() => handleClick("Notifications")}>
//               <FaBell className="text-2xl text-[#286fad]" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
//                   {unreadCount}
//                 </span>
//               )}
//             </div>
//           )}

//           {loggedIn ? (
//             <div className="relative" onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
//               <motion.img src={profileIcon} alt="Profile"
//                 className="h-8 w-8 rounded-full cursor-pointer"
//                 whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} title="Profile" />

//               <AnimatePresence>
//                 {profileOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 text-[#286fad] font-medium z-50"
//                   >
//                     <div className="px-4 py-2 cursor-pointer hover:bg-[#d6ba73] hover:text-white rounded-t-md"
//                         onClick={() => handleClick(role === "Admin" ? "Admin" : "dashboard")}>
//                       {role === "Admin" ? "Admin Dashboard" : "My Profile"}
//                     </div>
//                     <div className="px-4 py-2 cursor-pointer hover:bg-[#d6ba73] hover:text-white rounded-b-md"
//                         onClick={handleLogout}>
//                       Logout
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           ) : (
//             <button className="bg-[#286fad] hover:bg-[#1f5685] text-white px-6 py-3 rounded-lg text-lg"
//                     onClick={() => handleClick("login")}>
//               Login
//             </button>
//           )}
//         </div>

//         <div className="md:hidden text-2xl text-[#286fad] cursor-pointer" onClick={toggleMenu}>
//           {isOpen ? <FaTimes /> : <FaBars />}
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isOpen && (
//         <motion.div className="md:hidden bg-white shadow-lg px-8 py-5 space-y-4"
//                     initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
//           {["home","about","designs","contact"].map(item => (
//             <div key={item} className="text-lg text-[#286fad] cursor-pointer hover:text-[#1f5685] transition"
//                 onClick={() => handleClick(item)}>
//               {item.charAt(0).toUpperCase() + item.slice(1)}
//             </div>
//           ))}

//           <hr />

//           {loggedIn ? (
//             <>
//               <div className="text-lg text-[#286fad] cursor-pointer hover:text-[#1f5685] transition py-2"
//                   onClick={() => { handleClick(role === "Admin" ? "Admin" : "dashboard"); setIsOpen(false); }}>
//                 {role === "Admin" ? "Admin Dashboard" : "My Profile"}
//               </div>
//               <div className="text-lg text-[#286fad] cursor-pointer hover:text-[#1f5685] transition py-2"
//                   onClick={() => { handleLogout(); setIsOpen(false); }}>
//                 Logout
//               </div>
//             </>
//           ) : (
//             <button className="w-full bg-[#286fad] hover:bg-[#1f5685] text-white py-3 rounded-lg text-lg"
//                     onClick={() => { handleClick("login"); setIsOpen(false); }}>
//               Login
//             </button>
//           )}
//         </motion.div>
//       )}
//     </motion.nav>
//   );
// }
// src/Components/NavBar.jsximport React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profileImage = user?.profileImage || "/default-profile.png";

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setIsOpen(false);
    navigate("/login");
  };

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
    
    console.log("Navigating to notifications, user role:", user.role); // Debug log
    
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
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-bold select-none"
          style={{ fontFamily: "'Dancing Script', cursive", color: "#286fad" }}
        >
          Weave Nest
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10 text-[#286fad] font-medium text-lg">
          {menuItems.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `cursor-pointer hover:text-[#1f5685] transition ${
                    isActive ? "border-b-2 border-[#286fad]" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-6 relative">
          {/* 🔔 Notifications */}
          {user && (
            <div className="relative cursor-pointer" onClick={goToNotifications}>
              <FaBell className="text-2xl text-[#286fad] hover:text-[#1f5685] transition" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
          )}

          {/* 👤 Profile / Login */}
          {user ? (
            <div className="relative">
              <motion.img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer border-2 border-[#286fad]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Profile"
                onClick={() => setProfileOpen((prev) => !prev)}
                onError={(e) => {
                  e.target.src = "/default-profile.png";
                }}
              />
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border border-gray-200 text-[#286fad] font-medium z-50"
                  >
                    <div
                      className="px-5 py-3 cursor-pointer hover:bg-[#286fad] hover:text-white rounded-t-xl"
                      onClick={() => {
                        navigate(
                          user.role?.toLowerCase() === "admin"
                            ? "/admin/dashboard"
                            : "/dashboard"
                        );
                        setProfileOpen(false);
                      }}
                    >
                      {user.role === "Admin" ? "Admin Dashboard" : "My Profile"}
                    </div>
                    <div
                      className="px-5 py-3 cursor-pointer hover:bg-red-500 hover:text-white rounded-b-xl"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              className="bg-[#286fad] hover:bg-[#1f5685] text-white px-6 py-3 rounded-lg text-lg shadow-md transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden text-2xl text-[#286fad] cursor-pointer"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg px-8 py-5 space-y-4 border-t border-gray-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {menuItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-lg text-[#286fad] cursor-pointer hover:text-[#1f5685] transition ${
                    isActive ? "font-bold" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <hr />

            {user ? (
              <>
                <div
                  className="text-lg text-[#286fad] cursor-pointer hover:text-[#1f5685] transition py-2"
                  onClick={() => {
                    navigate(
                      user.role?.toLowerCase() === "admin"
                        ? "/admin/dashboard"
                        : "/dashboard"
                    );
                    setIsOpen(false);
                  }}
                >
                  {user.role === "Admin" ? "Admin Dashboard" : "My Profile"}
                </div>
                <div
                  className="text-lg text-[#286fad] cursor-pointer hover:text-[#1f5685] transition py-2"
                  onClick={goToNotifications}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div
                  className="text-lg text-red-500 cursor-pointer hover:text-red-600 transition py-2"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </>
            ) : (
              <button
                className="w-full bg-[#286fad] hover:bg-[#1f5685] text-white py-3 rounded-lg text-lg"
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
              >
                Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}