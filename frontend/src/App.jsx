// import React from "react";
// import NavBar from "./Components/NavBar";
// import { AuthProvider } from "./Context/AuthContext";
// import Home from "./Pages/Home";
// import About from "./Pages/About";
// import Designs from "./Pages/Designs";
// import Contact from "./Pages/ContactPage";
// import Login from "./Pages/Login";
// import Admin from "./Pages/Admin";
// import Profile from "./Pages/Profile";
// import "./index.css";
// import { ActivePageProvider, useActivePage } from "./Components/ActivePage";  // <-- use ActivePage.jsx
// import Footer from "./Components/Footer";
// import Dashboard from "./Pages/Dashboard";
// import MeasurementGuide from "./Subpages/MeasurementGuide";
// import BookNow from "./Pages/BookNow";
// import Notifications from "./Components/Notifications";
// function PageRenderer() {
//   const { activePage } = useActivePage();

//   switch (activePage) {
//     case "home":
//       return <Home />;
//     case "about":
//       return <About />;
//     case "designs":
//       return <Designs />;
//     case "contact":
//       return <Contact />;
//     case "login":
//       return <Login />;
//     case "profile":
//       return <Dashboard />;
//     case "dashboard":
//       return <Dashboard />;
//     case "BookNow":
//       return <BookNow />
//     case "Admin":
//       return <Admin />
//     case "Myorders":
//       return <Dashboard />
//     case "Notifications":
//       return <Notifications />
//     default:
//       return <Home />;
//   }
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <ActivePageProvider>
//         <NavBar />
//         <div className="pt-20">{/* padding top for fixed navbar */}
//           <PageRenderer />
//         </div>
//         <Footer />
//       </ActivePageProvider>
//     </AuthProvider>
//   );
// }
// src/App.jsx// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import "./index.css";
import { AuthProvider, useAuth } from "./Context/AuthContext";

// Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Designs from "./Pages/Designs";
import Contact from "./Pages/ContactPage";
import Login from "./Pages/Login";
import BookNow from "./Pages/BookNow";
import Dashboard from "./Pages/Dashboard";

// Subpages
import MeasurementGuide from "./Subpages/MeasurementGuide";
import MyOrders from "./Subpages/MyOrders";
import ReturnAndRefundPolicy from "./Pages/returnAndRefundPolicy";

// Admin Subpages
import Admin from "./Pages/Admin";
import CustomersList from "./Subpages/CustomersList.jsx";
import AdminOrders from "./Subpages/AdminOrders.jsx";
import AdminInventory from "./Subpages/AdminInventory.jsx";
import AdminNotifications from "./Subpages/AdminNotifications.jsx";
import PromoCodes from "./Subpages/PromoCodes.jsx";
import Notifications from "./Components/Notifications.jsx";

// ---------------- Protected Route ----------------
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// ---------------- Admin Route ----------------
function AdminRoute({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  if (user === null) return null; // optional while loading
  console.log('Admin', isAdmin)
  return isAdmin ? children : <Navigate to="/login" replace />;
}

// ---------------- App Component ----------------
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />

        <div className="pt-20 min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booknow" element={<BookNow />} />
            <Route path="/measurement-guide" element={<MeasurementGuide />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Individual Dashboard Sub-routes (if you want direct access) */}
            <Route
              path="/dashboard/account"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/measurement-guide"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/faqs"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/returnandrefundpolicy"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/transactions"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Other Protected Routes */}
            <Route
              path="/dashboard/booknow"
              element={
                <ProtectedRoute>
                  <BookNow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dashboard/overview"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <CustomersList />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/measurements"
              element={
                <AdminRoute>
                  <div>Measurement Guidelines</div>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <AdminRoute>
                  <AdminInventory />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <AdminRoute>
                  <Notifications />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/promo_codes"
              element={
                <AdminRoute>
                  <PromoCodes />
                </AdminRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </AuthProvider>
  );
}