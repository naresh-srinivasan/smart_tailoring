// src/Subpages/Designs.jsx
import React, { useState } from "react";

const products = [
  {
    id: 1,
    name: "Classic Tailored Shirt",
    category: "Shirt",
    price: 1200,
    description: "A perfectly tailored classic shirt for formal and casual occasions.",
    image: "https://images.unsplash.com/photo-1602810317305-6bc9c843c8d6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Elegant Kurta",
    category: "Kurta",
    price: 1800,
    description: "Traditional yet stylish kurta suitable for festivals and weddings.",
    image: "https://images.unsplash.com/photo-1610325407151-65942c07c9db?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Formal Pants",
    category: "Pants",
    price: 1500,
    description: "Tailored formal pants with a perfect fit for office and events.",
    image: "https://images.unsplash.com/photo-1626430130038-7f8b2cbe0b04?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Traditional Lehenga",
    category: "Lehenga",
    price: 4500,
    description: "Beautifully crafted lehenga with intricate embroidery for weddings.",
    image: "https://images.unsplash.com/photo-1598553081377-d3b33e380206?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    name: "Casual Linen Shirt",
    category: "Shirt",
    price: 1000,
    description: "Comfortable linen shirt, perfect for casual outings.",
    image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    name: "Designer Kurta",
    category: "Kurta",
    price: 2200,
    description: "Stylish designer kurta for modern traditional look.",
    image: "https://images.unsplash.com/photo-1600181956764-688b89d1e4a4?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Designs() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <div className="max-w-7xl mx-auto mt-24 px-6 pb-16">
      <h1
        className="text-4xl font-extrabold text-blue-800 mb-10 text-center"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Our Tailoring Designs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => openModal(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-1">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <p className="font-semibold text-gray-800">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full relative p-6">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{selectedProduct.name}</h2>
            <p className="text-gray-600 mb-1">Category: {selectedProduct.category}</p>
            <p className="font-semibold text-gray-800 mb-2">Price: ₹{selectedProduct.price}</p>
            <p className="text-gray-700">{selectedProduct.description}</p>
            <button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
              onClick={() => alert(`Booking for ${selectedProduct.name}`)}
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
