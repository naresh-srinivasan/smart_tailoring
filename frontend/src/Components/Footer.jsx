import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#286fad] text-white pt-12 pb-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-sans tracking-wide">
            Weave Nest
          </h3>
          <p className="text-sm mb-3 font-light max-w-xs">
            Your trusted partner for tailor-made clothes. Quality fabrics and
            personalized tailoring.
          </p>
          <p className="text-sm font-light">123 Tailor St., Chennai, India</p>
          <p className="text-sm font-light">Email: support@weavenest.com</p>
          <p className="text-sm font-light">Phone: +91 98765 43210</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-sans tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm font-light cursor-pointer">
            {[
              "Home",
              "About Us",
              "Designs",
              "Measurement Guide",
              "Order Tracking",
              "Profile",
              "Contact Us",
            ].map((link) => (
              <li key={link} className="hover:text-[#d6ba73] transition">
                <a src="http://localhost:3000/Designs">{link}</a></li>  
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-sans tracking-wide">
            Customer Support
          </h3>
          <ul className="space-y-2 text-sm font-light cursor-pointer">
            {[
              "FAQs",
              "Return & Refund Policy",
              "Shipping Information",
              "Privacy Policy",
              "Terms & Conditions",
            ].map((item) => (
              <li key={item} className="hover:text-[#d6ba73] transition">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-sans tracking-wide">
            Stay Connected
          </h3>
          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#d6ba73] text-[#286fad] font-semibold py-2 rounded hover:bg-[#c0a95f] transition"
            >
              Subscribe
            </button>
          </form>

          <div className="flex space-x-4 mt-6 text-xl cursor-pointer text-[#d6ba73]">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <i className="fab fa-facebook-f">📘</i>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <i className="fab fa-instagram">📸</i>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <i className="fab fa-twitter">🐦</i>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <i className="fab fa-linkedin-in">💼</i>
            </a>
          </div>

          <div className="flex items-center space-x-3 mt-8">
            {/* Dummy payment icons */}
            <div className="w-8 h-5 bg-white rounded-sm flex items-center justify-center text-[#286fad] font-bold text-xs cursor-pointer">
              Visa
            </div>
            <div className="w-8 h-5 bg-white rounded-sm flex items-center justify-center text-[#286fad] font-bold text-xs cursor-pointer">
              MC
            </div>
            <div className="w-8 h-5 bg-white rounded-sm flex items-center justify-center text-[#286fad] font-bold text-xs cursor-pointer">
              PayPal
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="mt-10 border-t border-[#d6ba73] pt-6 text-center text-xs font-light font-sans">
        © {new Date().getFullYear()} Weave Nest. All rights reserved.
      </div>
    </footer>
  );
}
