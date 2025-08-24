import React from "react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto mt-24 p-8 bg-white rounded-xl shadow-md">
      <h1
        className="text-4xl font-extrabold text-blue-800 mb-6"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        About Weave Nest
      </h1>
      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
        At <strong>Weave Nest</strong>, we believe that clothing is more than
        just fabric—it’s an expression of who you are. Founded with the vision
        of bringing smart tailoring to the modern customer, we combine
        craftsmanship, technology, and premium fabrics to deliver bespoke
        garments tailored perfectly for you.
      </p>
      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
        Our team of expert tailors and designers work closely with you to
        understand your style, preferences, and requirements. Whether it's a
        classic suit, casual wear, or innovative designs, we ensure every
        stitch reflects quality and elegance.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Experience personalized service, attention to detail, and cutting-edge
        tailoring technology with Weave Nest — where tradition meets innovation.
      </p>
    </div>
  );
}
