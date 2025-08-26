import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Designs", path: "/designs" },
    { name: "Measurement Guide", path: "/measurement-guide" },
    { name: "Order Tracking", path: "/orders" },
    { name: "Profile", path: "/profile" },
    { name: "Contact Us", path: "/contact" },
  ];

  const supportLinks = [
    { name: "FAQs", path: "/faqs" },
    { name: "Return & Refund Policy", path: "/return-policy" },
    { name: "Shipping Information", path: "/shipping" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
  ];

  const handleSubscription = async (e) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSubscriptionStatus("error");
      setTimeout(() => setSubscriptionStatus(""), 3000);
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulate API call for newsletter subscription
      const response = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscriptionStatus("success");
        setEmail("");
        
        // Send confirmation email (this would typically be handled by your backend)
        const emailData = {
          to: email,
          subject: "Welcome to Weave Nest Newsletter!",
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="background: linear-gradient(135deg, #286fad, #1a5a94); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Weave Nest!</h1>
                <p style="color: #d6ba73; margin: 10px 0 0 0; font-size: 16px;">Thank you for subscribing to our newsletter</p>
              </div>
              
              <div style="padding: 40px 20px; background-color: #f8f9fa;">
                <h2 style="color: #286fad; margin-bottom: 20px;">You're All Set!</h2>
                <p style="margin-bottom: 20px;">
                  Thank you for subscribing to the Weave Nest newsletter! You'll now receive:
                </p>
                
                <ul style="margin: 20px 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">🧵 Latest fashion trends and styling tips</li>
                  <li style="margin-bottom: 10px;">✂️ Exclusive tailoring offers and discounts</li>
                  <li style="margin-bottom: 10px;">👗 New design collections and fabric arrivals</li>
                  <li style="margin-bottom: 10px;">📏 Measurement guides and fitting tips</li>
                </ul>
                
                <p style="margin-top: 30px;">
                  We're excited to have you as part of our community of fashion enthusiasts!
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="http://localhost:3000" 
                     style="background-color: #286fad; color: white; padding: 12px 30px; 
                            text-decoration: none; border-radius: 6px; font-weight: bold;
                            display: inline-block;">
                    Visit Our Website
                  </a>
                </div>
              </div>
              
              <div style="background-color: #286fad; color: white; padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 14px;">
                  © ${new Date().getFullYear()} Weave Nest. All rights reserved.
                </p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #d6ba73;">
                  123 Tailor St., Chennai, India | support@weavenest.com
                </p>
              </div>
            </div>
          `
        };

        // Send confirmation email
        await fetch("http://localhost:5000/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        });

      } else {
        setSubscriptionStatus("error");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setSubscriptionStatus("error");
    }
    
    setIsSubscribing(false);
    setTimeout(() => setSubscriptionStatus(""), 5000);
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl transform translate-x-24 translate-y-24"></div>
      
      <div className="relative z-10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Weave Nest
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  Your trusted partner for tailor-made clothes. Quality fabrics and 
                  personalized tailoring with over a decade of expertise.
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-blue-100">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  123 Tailor St., Chennai, India
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@weavenest.com
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 98765 43210
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-blue-700/30 pb-2">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-blue-100 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-blue-700/30 pb-2">
                Customer Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-blue-100 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-blue-700/30 pb-2">
                Stay Connected
              </h3>
              
              {/* Newsletter Subscription */}
              <form onSubmit={handleSubscription} className="mb-8">
                <p className="text-blue-100 text-sm mb-4">
                  Subscribe to get updates on new collections and exclusive offers.
                </p>
                
                <div className="flex flex-col space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 
                             text-white placeholder-blue-200 focus:outline-none focus:ring-2 
                             focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    disabled={isSubscribing}
                  />
                  
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-6 
                             rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 
                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:transform-none shadow-lg"
                  >
                    {isSubscribing ? (
                      <span className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Subscribing...
                      </span>
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                </div>

                {/* Subscription Status Messages */}
                {subscriptionStatus === "success" && (
                  <div className="mt-3 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                    <p className="text-green-200 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Successfully subscribed! Check your email for confirmation.
                    </p>
                  </div>
                )}
                
                {subscriptionStatus === "error" && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <p className="text-red-200 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Please enter a valid email address.
                    </p>
                  </div>
                )}
              </form>

              {/* Social Media Links */}
              <div className="mb-8">
                <p className="text-blue-100 text-sm mb-4">Follow us on social media</p>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="Facebook"
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center
                             hover:bg-blue-600 transition-all duration-200 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="Instagram"
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center
                             hover:bg-pink-600 transition-all duration-200 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="Twitter"
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center
                             hover:bg-sky-600 transition-all duration-200 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="LinkedIn"
                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center
                             hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <p className="text-blue-100 text-sm mb-4">We accept</p>
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-2 bg-white rounded-md shadow-sm">
                    <span className="text-blue-900 font-bold text-xs">VISA</span>
                  </div>
                  <div className="px-3 py-2 bg-white rounded-md shadow-sm">
                    <span className="text-red-600 font-bold text-xs">MC</span>
                  </div>
                  <div className="px-3 py-2 bg-white rounded-md shadow-sm">
                    <span className="text-blue-700 font-bold text-xs">PayPal</span>
                  </div>
                  <div className="px-3 py-2 bg-white rounded-md shadow-sm">
                    <span className="text-green-600 font-bold text-xs">UPI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/20 pt-8 mt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-blue-100 text-sm">
                © {new Date().getFullYear()} Weave Nest. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-blue-200">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}