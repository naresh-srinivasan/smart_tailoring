import React from "react";

const products = [
  {
    id: 1,
    name: "Classic Tailored Suit",
    image: "https://source.unsplash.com/400x400/?suit,tailoring",
  },
  {
    id: 2,
    name: "Custom Dress Shirt",
    image: "https://source.unsplash.com/400x400/?shirt,tailoring",
  },
  {
    id: 3,
    name: "Handmade Leather Belt",
    image: "https://source.unsplash.com/400x400/?leather,belt",
  },
  {
    id: 4,
    name: "Elegant Evening Gown",
    image: "https://source.unsplash.com/400x400/?gown,fashion",
  },
  {
    id: 5,
    name: "Tailored Trousers",
    image: "https://source.unsplash.com/400x400/?trousers,tailoring",
  },
  {
    id: 6,
    name: "Classic Blazer",
    image: "https://source.unsplash.com/400x400/?blazer,fashion",
  },
  {
    id: 7,
    name: "Custom-made Waistcoat",
    image: "https://source.unsplash.com/400x400/?waistcoat,suit",
  },
  {
    id: 8,
    name: "Formal Tie Collection",
    image: "https://source.unsplash.com/400x400/?tie,fashion",
  },
];

export default function Designs() {
  return (
    <div className="max-w-7xl mx-auto mt-24 px-6 pb-16">
      <h1
        className="text-4xl font-extrabold text-blue-800 mb-10"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Our Tailoring Designs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(({ id, name, image }) => (
          <div
            key={id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={image}
              alt={name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">{name}</h2>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                onClick={() => alert(`Viewing more about: ${name}`)}
              >
                View More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
