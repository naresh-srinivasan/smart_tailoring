import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ForgotPassword from "../Components/ForgotPassword";

// Professional input component with enhanced styling
const InputField = ({ type = "text", placeholder, value, onChange, className = "" }) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3.5 rounded-lg border border-gray-300 bg-gray-50 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 focus:bg-white transition-all duration-200 text-gray-700
                 placeholder-gray-400 ${className}`}
    />
  </div>
);

// Professional button component
const PrimaryButton = ({ children, onClick, type = "button", disabled = false, loading = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3.5 px-4 
               rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 
               focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 
               disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        {children}
      </div>
    ) : (
      children
    )}
  </button>
);

// Professional select component
const SelectField = ({ value, onChange, children, className = "" }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3.5 rounded-lg border border-gray-300 bg-gray-50 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 focus:bg-white transition-all duration-200 text-gray-700 appearance-none
                 bg-no-repeat bg-right pr-10 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.75rem center',
        backgroundSize: '1.25rem 1.25rem'
      }}
    >
      {children}
    </select>
  </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-white text-lg font-medium">Processing...</p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------
  // Render Auth Page
  // ----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 border border-white/20 relative overflow-hidden">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 
                     rounded-full transition-all duration-200 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {loginError}
                  </div>
                </div>
              )}

              {forgotPassword ? (
                <ForgotPassword onBack={() => setForgotPassword(false)} />
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <InputField 
                      type="email" 
                      placeholder="Email address" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)} 
                    />
                    <InputField 
                      type="password" 
                      placeholder="Password" 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)} 
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <button 
                      type="button" 
                      onClick={() => setForgotPassword(true)} 
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  <PrimaryButton 
                    type="submit" 
                    disabled={loading}
                    loading={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </PrimaryButton>
                </form>
              )}

              {!forgotPassword && (
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <button 
                      onClick={() => setIsLogin(false)} 
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Create account
                    </button>
                  </p>
                </div>
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
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600">Join us today and get started</p>
              </div>

              {regError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {regError}
                  </div>
                </div>
              )}

              <form onSubmit={handleRegSubmit} className="space-y-5">
                <InputField 
                  placeholder="Full Name" 
                  value={regName} 
                  onChange={(e) => setRegName(e.target.value)} 
                />
                <InputField 
                  type="email" 
                  placeholder="Email address" 
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <SelectField 
                    value={regRole} 
                    onChange={(e) => setRegRole(e.target.value)}
                  >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </SelectField>
                </div>

                <PrimaryButton 
                  type="submit" 
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </PrimaryButton>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setIsLogin(true)} 
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}