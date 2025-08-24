import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ForgotPassword from "../Components/ForgotPassword";

// Reusable input component
const InputField = ({ type = "text", placeholder, value, onChange, className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

export default function AuthPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Registration states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState("Customer");
  const [regError, setRegError] = useState("");

  // Forgot password state
  const [forgotPassword, setForgotPassword] = useState(false);

  const API_BASE = "http://localhost:5000/api";

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ----------------------
  // Redirect if already logged in
  // ----------------------
  useEffect(() => {
    if (user) {
      // Get the intended destination from location state, or default redirect
      const from = location.state?.from?.pathname || (user.role === "Admin" ? "/admin" : "/dashboard");
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // ----------------------
  // Handle Login
  // ----------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim()) return setLoginError("Email is required");
    if (!validateEmail(loginEmail)) return setLoginError("Enter a valid email");
    if (!loginPassword) return setLoginError("Password is required");
    if (loginPassword.length < 6)
      return setLoginError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        // Store token in localStorage (if your AuthContext doesn't handle this)
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        
        // Update auth context
        await login(data.token, data.user);
        
        // Navigate to appropriate page
        const from = location.state?.from?.pathname || (data.user.role === "Admin" ? "/admin/dashboard" : "/dashboard");
        navigate(from, { replace: true });
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  // ----------------------
  // Handle Registration
  // ----------------------
  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim()) return setRegError("Name is required");
    if (!regEmail.trim()) return setRegError("Email is required");
    if (!validateEmail(regEmail)) return setRegError("Enter a valid email");
    if (!regPassword) return setRegError("Password is required");
    if (regPassword.length < 6)
      return setRegError("Password must be at least 6 characters");
    if (regPassword !== regConfirmPassword)
      return setRegError("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: regRole,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token && data.user) {
          // Auto-login after successful registration
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          
          await login(data.token, data.user);
          
          const redirectTo = data.user.role === "Admin" ? "/admin" : "/dashboard";
          navigate(redirectTo, { replace: true });
        } else {
          // Registration successful but requires manual login
          setIsLogin(true);
          setRegError(""); // Clear any errors
          alert("Registration successful! Please login.");
          // Clear registration form
          setRegName("");
          setRegEmail("");
          setRegPassword("");
          setRegConfirmPassword("");
        }
      } else {
        setRegError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  // ----------------------
  // Animation variants
  // ----------------------
  const variants = {
    enter: (dir) => ({ 
      x: dir > 0 ? 300 : -300, 
      opacity: 0, 
      position: "absolute", 
      width: "100%" 
    }),
    center: { 
      x: 0, 
      opacity: 1, 
      position: "relative", 
      width: "100%" 
    },
    exit: (dir) => ({ 
      x: dir < 0 ? 300 : -300, 
      opacity: 0, 
      position: "absolute", 
      width: "100%" 
    }),
  };

  // ----------------------
  // Loading Screen
  // ----------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-700 to-white">
        <div className="w-16 h-16 border-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // ----------------------
  // Render Auth Page
  // ----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-white flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-lg max-w-md w-full p-10 border border-blue-400 relative overflow-hidden">
        
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <AnimatePresence initial={false} custom={isLogin ? 1 : -1}>
          {isLogin ? (
            // ---------- LOGIN FORM ----------
            <motion.div 
              key="login" 
              custom={1} 
              variants={variants} 
              initial="enter" 
              animate="center" 
              exit="exit" 
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold text-blue-800 mb-6 text-center tracking-wide" 
                  style={{ fontFamily: "'Dancing Script', cursive" }}>
                Login
              </h1>

              {loginError && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-semibold">
                  {loginError}
                </div>
              )}

              {forgotPassword ? (
                <ForgotPassword onBack={() => setForgotPassword(false)} />
              ) : (
                <form onSubmit={handleLoginSubmit} className="flex flex-col space-y-4">
                  <InputField 
                    type="email" 
                    placeholder="Email" 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                  />
                  <InputField 
                    type="password" 
                    placeholder="Password" 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  <div className="text-right">
                    <button 
                      type="button" 
                      onClick={() => setForgotPassword(true)} 
                      className="text-sm text-blue-600 hover:underline font-semibold focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              )}

              {!forgotPassword && (
                <p className="mt-6 text-center text-blue-700 font-semibold cursor-pointer hover:underline select-none" 
                   onClick={() => setIsLogin(false)}>
                  New user? Register here
                </p>
              )}
            </motion.div>
          ) : (
            // ---------- REGISTER FORM ----------
            <motion.div 
              key="register" 
              custom={-1} 
              variants={variants} 
              initial="enter" 
              animate="center" 
              exit="exit" 
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold text-blue-800 mb-6 text-center tracking-wide" 
                  style={{ fontFamily: "'Dancing Script', cursive" }}>
                New Registration
              </h1>

              {regError && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-semibold">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegSubmit} className="flex flex-col space-y-4">
                <InputField 
                  placeholder="Full Name" 
                  value={regName} 
                  onChange={(e) => setRegName(e.target.value)} 
                />
                <InputField 
                  type="email" 
                  placeholder="Email" 
                  value={regEmail} 
                  onChange={(e) => setRegEmail(e.target.value)} 
                />
                <InputField 
                  type="password" 
                  placeholder="Password" 
                  value={regPassword} 
                  onChange={(e) => setRegPassword(e.target.value)} 
                />
                <InputField 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={regConfirmPassword} 
                  onChange={(e) => setRegConfirmPassword(e.target.value)} 
                />
                <select 
                  value={regRole} 
                  onChange={(e) => setRegRole(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already signed in?{" "}
                <button 
                  onClick={() => setIsLogin(true)} 
                  className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
                >
                  Login here
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}