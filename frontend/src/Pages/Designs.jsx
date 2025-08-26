import React, { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Premium Tailored Shirt",
    category: "Formal Shirts",
    price: 1200,
    originalPrice: 1500,
    description:
      "A perfectly tailored premium shirt crafted with the finest cotton fabric. Features precision stitching, mother-of-pearl buttons, and a contemporary slim fit design perfect for business and formal occasions.",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    features: ["100% Cotton", "Slim Fit", "Mother-of-pearl buttons", "Machine washable"],
    colors: ["White", "Light Blue", "Charcoal Grey"],
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Royal Ethnic Kurta",
    category: "Traditional Wear",
    price: 1800,
    originalPrice: 2200,
    description:
      "Exquisitely crafted traditional kurta featuring intricate thread work and authentic design elements. Perfect for festivals, weddings, and cultural celebrations with a modern comfort fit.",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e1?auto=format&fit=crop&w=600&q=80",
    features: ["Hand Embroidered", "Pure Cotton", "Traditional Cut", "Comfortable Fit"],
    colors: ["Royal Blue", "Maroon", "Golden Yellow", "Cream"],
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 3,
    name: "Executive Formal Pants",
    category: "Formal Wear",
    price: 1500,
    originalPrice: 1800,
    description:
      "Professionally tailored formal pants with precision fitting and premium fabric. Features flat front design, reinforced seams, and wrinkle-resistant fabric for all-day comfort and style.",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    features: ["Wrinkle Resistant", "Flat Front", "Reinforced Seams", "Comfort Waistband"],
    colors: ["Navy Blue", "Charcoal", "Black", "Grey"],
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "Designer Wedding Lehenga",
    category: "Bridal Wear",
    price: 4500,
    originalPrice: 5500,
    description:
      "Stunning designer lehenga featuring intricate zardozi embroidery, premium silk fabric, and traditional craftsmanship. Perfect for weddings and grand celebrations with a regal appearance.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    features: ["Zardozi Embroidery", "Premium Silk", "Heavy Work", "Custom Blouse"],
    colors: ["Deep Red", "Royal Pink", "Golden", "Emerald Green"],
    rating: 5.0,
    reviews: 67,
  },
  {
    id: 5,
    name: "Casual Linen Shirt",
    category: "Casual Wear",
    price: 1000,
    originalPrice: 1200,
    description:
      "Comfortable and breathable linen shirt perfect for casual outings and vacation wear. Features relaxed fit, natural texture, and easy-care properties for effortless style.",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    features: ["100% Linen", "Relaxed Fit", "Breathable", "Easy Care"],
    colors: ["White", "Sky Blue", "Beige", "Light Green"],
    rating: 4.6,
    reviews: 201,
  },
  {
    id: 6,
    name: "Contemporary Designer Kurta",
    category: "Fusion Wear",
    price: 2200,
    originalPrice: 2600,
    description:
      "Modern designer kurta blending traditional aesthetics with contemporary styling. Features unique print patterns, premium fabric, and versatile design suitable for both casual and semi-formal occasions.",
    image:
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=600&q=80",
    features: ["Designer Prints", "Premium Fabric", "Modern Cut", "Versatile Style"],
    colors: ["Indigo", "Mustard", "Olive Green", "Burgundy"],
    rating: 4.8,
    reviews: 93,
  },
  {
    id: 7,
    name: "Luxury Business Suit",
    category: "Formal Suits",
    price: 8500,
    originalPrice: 10000,
    description:
      "Premium business suit crafted from finest wool blend fabric. Features impeccable tailoring, contemporary cut, and professional styling perfect for corporate environments and formal events.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    features: ["Wool Blend", "Professional Cut", "Lined Jacket", "Matching Vest"],
    colors: ["Navy Blue", "Charcoal Grey", "Black"],
    rating: 4.9,
    reviews: 78,
  },
  {
    id: 8,
    name: "Elegant Saree Blouse",
    category: "Blouses",
    price: 800,
    originalPrice: 1000,
    description:
      "Beautifully tailored saree blouse with intricate detailing and perfect fit. Features contemporary neckline designs, premium stitching, and comfortable wear for special occasions.",
    image:
      "https://images.unsplash.com/photo-1583391733981-e6ad8fc02d23?auto=format&fit=crop&w=600&q=80",
    features: ["Custom Fit", "Designer Neckline", "Premium Stitching", "Multiple Styles"],
    colors: ["Gold", "Silver", "Deep Red", "Royal Blue"],
    rating: 4.7,
    reviews: 145,
  },
];

const categories = [
  "All",
  "Formal Shirts",
  "Traditional Wear",
  "Formal Wear",
  "Bridal Wear",
  "Casual Wear",
  "Fusion Wear",
  "Formal Suits",
  "Blouses",
];

export default function Designs() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter products by category and sort
  useEffect(() => {
    let filtered =
      selectedCategory === "All"
        ? products
        : products.filter((product) => product.category === selectedCategory);

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy]);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));

  const handleBookNow = (product) => {
    alert(
      `Booking consultation for ${product.name}. Our tailor will contact you within 24 hours!`
    );
    closeModal();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading our exclusive designs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto pt-24 px-6 pb-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Exquisite{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tailoring
            </span>{" "}
            Designs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our curated collection of premium tailored clothing. Each
            piece is meticulously crafted with attention to detail, ensuring
            perfect fit and exceptional quality.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort By */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
              onClick={() => openModal(product)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧵</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No designs found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category or adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                onClick={closeModal}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-96 lg:h-full object-cover rounded-xl"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(
                      ((selectedProduct.originalPrice - selectedProduct.price) /
                        selectedProduct.originalPrice) *
                        100
                    )}
                    % OFF
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">
                      {selectedProduct.name}
                    </h2>
                    <div className="flex items-center space-x-2 mt-2">
                      {renderStars(selectedProduct.rating)}
                      <span className="text-sm text-gray-600">
                        ({selectedProduct.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{selectedProduct.price}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{selectedProduct.originalPrice}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Save ₹{selectedProduct.originalPrice - selectedProduct.price}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Key Features
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Colors */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Available Colors
                    </h3>
                    <div className="flex space-x-2">
                      {selectedProduct.colors.map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-6 border-t">
                    <button
                      onClick={() => handleBookNow(selectedProduct)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Book Consultation - ₹{selectedProduct.price}
                    </button>
                    <button
                      onClick={() => alert("Added to favorites!")}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      Add to Favorites
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                    {[
                      "Free consultation and measurement",
                      "7-14 days delivery time",
                      "Perfect fit guarantee",
                    ].map((info, i) => (
                      <div
                        key={i}
                        className="flex items-center text-sm text-blue-800"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {info}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
