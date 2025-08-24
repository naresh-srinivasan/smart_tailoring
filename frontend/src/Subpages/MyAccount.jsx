// // src/Subpages/MyAccount.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   FaEdit,
//   FaLock,
//   FaMapMarkerAlt,
//   FaUser,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import EditProfile from "./EditProfile";
// import { useActivePage } from "../Components/ActivePage";

// export default function MyAccount() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showEdit, setShowEdit] = useState(false);
//   const [activeTab, setActiveTab] = useState("profile");
//   const { setActivePage, setLoggedIn } = useActivePage();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setLoggedIn(false);
//           return;
//         }
//         const { data } = await axios.get("http://localhost:5000/api/user/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(data);
//       } catch (err) {
//         console.error("Axios fetch error:", err);
//         setLoggedIn(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [setLoggedIn]);

//   if (loading)
//     return <p className="text-center mt-20 text-gray-500">Loading...</p>;
//   if (!user)
//     return <p className="text-center mt-20 text-gray-500">No user data found.</p>;

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setLoggedIn(false);
//     setActivePage("home");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-16 text-center text-white shadow-md">
//         <h1 className="text-3xl md:text-4xl font-extrabold">My Account</h1>
//         <p className="mt-2 text-blue-200 text-lg">
//           Manage your profile, addresses & account security
//         </p>
//       </div>

//       <div className="max-w-7xl mx-auto -mt-12 px-4 sm:px-6 lg:px-8 pb-20">
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Sidebar */}
//           <motion.div
//             className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <img
//               src={user.profileImage || "https://via.placeholder.com/150"}
//               alt={user.name}
//               className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-600 shadow-md"
//             />
//             <h2 className="text-xl sm:text-2xl font-semibold mt-4 text-gray-800">
//               {user.name}
//             </h2>
//             <p className="text-gray-500 text-sm sm:text-base">{user.email}</p>

//             <motion.button
//               onClick={() => setShowEdit(true)}
//               className="mt-6 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-full shadow-md hover:bg-blue-700 transition"
//               whileTap={{ scale: 0.95 }}
//             >
//               <FaEdit /> Edit Profile
//             </motion.button>
//           </motion.div>

//           {showEdit && (
//             <EditProfile
//               user={user}
//               onClose={() => setShowEdit(false)}
//               onUpdate={(updatedUser) => setUser(updatedUser)}
//             />
//           )}

//           {/* Main Section */}
//           <motion.div
//             className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6 sm:p-10"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {/* Tabs */}
//             <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8">
//               {["profile", "address", "security"].map((tab) => (
//                 <button
//                   key={tab}
//                   className={`pb-3 px-3 font-medium text-sm sm:text-base transition ${
//                     activeTab === tab
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))}
//             </div>

//             {/* Tab Content */}
//             {activeTab === "profile" && (
//               <section>
//                 <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
//                   <FaUser className="text-blue-600" /> Personal Information
//                 </h3>
//                 <div className="grid md:grid-cols-2 gap-6 text-gray-700">
//                   <div>
//                     <p className="text-gray-400 text-sm">Full Name</p>
//                     <p className="font-medium">{user.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-400 text-sm">Email</p>
//                     <p className="font-medium">{user.email}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-400 text-sm">Phone Number</p>
//                     <p className="font-medium">{user.phone || "N/A"}</p>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {activeTab === "address" && (
//               <section>
//                 <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
//                   <FaMapMarkerAlt className="text-green-600" /> Address
//                 </h3>
//                 <p className="font-medium text-gray-700 text-sm sm:text-base">
//                   {user.address || "No address added yet."}
//                 </p>
//               </section>
//             )}

//             {activeTab === "security" && (
//               <section>
//                 <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
//                   <FaLock className="text-yellow-500" /> Security Settings
//                 </h3>
//                 <div className="flex flex-wrap gap-4">
//                   <button className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-full text-sm sm:text-base hover:bg-yellow-600 transition shadow-md">
//                     <FaLock /> Change Password
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full text-sm sm:text-base hover:bg-red-600 transition shadow-md"
//                   >
//                     <FaSignOutAlt /> Logout
//                   </button>
//                 </div>
//               </section>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/Subpages/MyAccount.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaLock,
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import EditProfile from "./EditProfile";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const { data } = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error("Axios fetch error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!user)
    return <p className="text-center mt-20 text-gray-500">No user data found.</p>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect to homepage after logout
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-16 text-center text-white shadow-md">
        <h1 className="text-3xl md:text-4xl font-extrabold">My Account</h1>
        <p className="mt-2 text-blue-200 text-lg">
          Manage your profile, addresses & account security
        </p>
      </div>

      <div className="max-w-7xl mx-auto -mt-12 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={user.profileImage || "https://via.placeholder.com/150"}
              alt={user.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-600 shadow-md"
            />
            <h2 className="text-xl sm:text-2xl font-semibold mt-4 text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">{user.email}</p>

            <motion.button
              onClick={() => setShowEdit(true)}
              className="mt-6 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-full shadow-md hover:bg-blue-700 transition"
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit /> Edit Profile
            </motion.button>
          </motion.div>

          {showEdit && (
            <EditProfile
              user={user}
              onClose={() => setShowEdit(false)}
              onUpdate={(updatedUser) => setUser(updatedUser)}
            />
          )}

          {/* Main Section */}
          <motion.div
            className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8">
              {["profile", "address", "security"].map((tab) => (
                <button
                  key={tab}
                  className={`pb-3 px-3 font-medium text-sm sm:text-base transition ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
              <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
                  <FaUser className="text-blue-600" /> Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone Number</p>
                    <p className="font-medium">{user.phone || "N/A"}</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "address" && (
              <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
                  <FaMapMarkerAlt className="text-green-600" /> Address
                </h3>
                <p className="font-medium text-gray-700 text-sm sm:text-base">
                  {user.address || "No address added yet."}
                </p>
              </section>
            )}

            {activeTab === "security" && (
              <section>
                <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
                  <FaLock className="text-yellow-500" /> Security Settings
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-full text-sm sm:text-base hover:bg-yellow-600 transition shadow-md">
                    <FaLock /> Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full text-sm sm:text-base hover:bg-red-600 transition shadow-md"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </section>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
