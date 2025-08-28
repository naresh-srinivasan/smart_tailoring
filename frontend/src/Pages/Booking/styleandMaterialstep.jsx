import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Regular from "../../Assests/Regular.png";
import Mandarin from "../../Assests/Mandarin.png";
import ButtonDown from "../../Assests/ButtonDown.png";
import Spread from "../../Assests/Spread.png";
import LongPoint from "../../Assests/LongPoint.png";

export default function StyleAndMaterialStep({
    gender,
    dressType,
    material,
    setMaterial,
    color,
    setColor,
    pattern,
    setPattern,
    collarType,
    setCollarType,
    sleeveType,
    setSleeveType,
    buttonType,
    setButtonType,
    buttonColor,
    setButtonColor,
    showCollarInfo,
    setShowCollarInfo,
    showSleeveInfo,
    setShowSleeveInfo,
    onBack,
    onNext,
}) {
    const [inventory, setInventory] = useState([]);
    const [selectedCombination, setSelectedCombination] = useState(null);
    const [hoveredCombination, setHoveredCombination] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/inventory");
                const data = await response.json();
                setInventory(Array.isArray(data.items) ? data.items : []);
            } catch (err) {
                console.error("Error fetching inventory:", err);
            }
        };
        fetchInventory();
    }, []);

    const allowedMaterials = [...new Set(inventory.map((item) => item.material_name))];

    const getAvailableCombinations = () => {
        if (!material) return [];
        return inventory
            .filter((item) => item.material_name === material)
            .map((item) => ({
                id: item.id,
                color: item.color,
                pattern: item.pattern || "Solid",
                material: item.material_name,
                image: item.image_url || null,
                price: item.price || 0,
                original_price: item.original_price || item.price || 0,
                total_quantity: item.total_quantity || 0,
            }));
    };

    const availableCombinations = getAvailableCombinations();

    const handleCombinationSelect = (combination) => {
        setSelectedCombination(combination);
        setColor(combination.color);
        setPattern(combination.pattern);
    };

    const calculateDiscount = (originalPrice, currentPrice) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getColorHex = (colorValue) => {
        if (colorValue && colorValue.startsWith('#')) {
            return colorValue;
        }
        
        const colorMap = {
            'red': '#EF4444',
            'blue': '#3B82F6',
            'green': '#10B981',
            'yellow': '#F59E0B',
            'black': '#1F2937',
            'white': '#FFFFFF',
            'gray': '#6B7280',
            'grey': '#6B7280',
            'purple': '#8B5CF6',
            'orange': '#F97316',
            'pink': '#EC4899',
            'brown': '#A78BFA',
            'navy': '#1E40AF',
            'maroon': '#991B1B',
        };
        
        const colorName = colorValue ? colorValue.toLowerCase() : '';
        return colorMap[colorName] || '#6366F1';
    };

    const createPatternPreview = (color, pattern) => {
        const hexColor = getColorHex(color);
        
        const baseStyle = {
            width: "100%",
            height: "90px",
            borderRadius: "12px",
            border: "2px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: hexColor,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        };

        switch (pattern?.toLowerCase()) {
            case "stripes":
            case "striped":
                return (
                    <div style={baseStyle}>
                        <div
                            className="w-full h-full relative overflow-hidden rounded-lg"
                            style={{
                                background: `repeating-linear-gradient(
                                    45deg,
                                    ${hexColor},
                                    ${hexColor} 8px,
                                    rgba(255,255,255,0.3) 8px,
                                    rgba(255,255,255,0.3) 16px
                                )`,
                            }}
                        />
                    </div>
                );
            case "dots":
            case "polka dots":
                return (
                    <div style={baseStyle}>
                        <div
                            className="w-full h-full relative overflow-hidden rounded-lg"
                            style={{
                                backgroundColor: hexColor,
                                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 2px, transparent 2px)",
                                backgroundSize: "15px 15px",
                            }}
                        />
                    </div>
                );
            default:
                return (
                    <div style={baseStyle}>
                        <span className="font-semibold text-white text-opacity-80 drop-shadow-md">
                            Solid
                        </span>
                    </div>
                );
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className="space-y-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Material Selection */}
            <motion.div className="space-y-4" variants={itemVariants}>
                <label className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">🧵</span>
                    Premium Materials
                </label>
                <select
                    value={material}
                    onChange={(e) => {
                        setMaterial(e.target.value);
                        setColor("");
                        setPattern("");
                        setSelectedCombination(null);
                    }}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                    required
                >
                    <option value="" disabled>Choose your preferred material</option>
                    {allowedMaterials.map((mat) => (
                        <option key={mat} value={mat} className="font-medium">
                            {mat}
                        </option>
                    ))}
                </select>
            </motion.div>

            {/* Color & Pattern Combinations */}
            <AnimatePresence>
                {material && availableCombinations.length > 0 && (
                    <motion.div
                        className="space-y-6"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <label className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">🎨</span>
                            Available Colors & Patterns
                        </label>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {availableCombinations.map((combination, index) => {
                                const hexColor = getColorHex(combination.color);
                                const discountPercentage = calculateDiscount(combination.original_price, combination.price);
                                const hasDiscount = discountPercentage > 0;
                                const isSelected = selectedCombination?.id === combination.id;
                                
                                return (
                                    <motion.div
                                        key={`${combination.id}-${index}`}
                                        className={`group cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                                            isSelected
                                                ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-500/20"
                                                : "border-gray-200 hover:border-indigo-300 hover:shadow-lg"
                                        }`}
                                        onClick={() => handleCombinationSelect(combination)}
                                        onMouseEnter={() => setHoveredCombination(combination.id)}
                                        onMouseLeave={() => setHoveredCombination(null)}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {/* Image/Pattern Preview */}
                                        <div className="relative">
                                            {combination.image ? (
                                                <img
                                                    src={combination.image}
                                                    alt={`${combination.color} ${combination.pattern}`}
                                                    className="w-full h-24 object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                        e.target.nextSibling.style.display = "block";
                                                    }}
                                                />
                                            ) : null}
                                            <div style={{ display: combination.image ? "none" : "block" }}>
                                                {createPatternPreview(combination.color, combination.pattern)}
                                            </div>
                                            
                                            {/* Discount Badge */}
                                            {hasDiscount && (
                                                <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                    {discountPercentage}% OFF
                                                </div>
                                            )}

                                            {/* Selection Indicator */}
                                            {isSelected && (
                                                <motion.div
                                                    className="absolute top-2 left-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500 }}
                                                >
                                                    <span className="text-white text-sm">✓</span>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 border-white shadow-md flex-shrink-0"
                                                    style={{
                                                        backgroundColor: hexColor,
                                                        borderColor: hexColor === '#FFFFFF' ? '#d1d5db' : 'white',
                                                    }}
                                                />
                                                <div>
                                                    <div className="font-semibold text-gray-800 capitalize text-sm">
                                                        {combination.color}
                                                    </div>
                                                    <div className="text-xs text-gray-600 capitalize">
                                                        {combination.pattern || "Solid"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="space-y-1">
                                                {hasDiscount ? (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs text-gray-500 line-through">
                                                            {formatPrice(combination.original_price)}
                                                        </span>
                                                        <span className="text-sm font-bold text-red-600">
                                                            {formatPrice(combination.price)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-800">
                                                        {formatPrice(combination.price)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stock Status */}
                                            <div className={`text-xs font-medium ${
                                                combination.total_quantity > 0 
                                                    ? "text-green-600" 
                                                    : "text-red-500"
                                            }`}>
                                                {combination.total_quantity > 0
                                                    ? `${combination.total_quantity}m available`
                                                    : "Out of stock"}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Selected Combination Summary */}
                        <AnimatePresence>
                            {selectedCombination && (
                                <motion.div
                                    className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                        <span className="text-xl">✨</span>
                                        Selected Combination
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Material:</span>
                                            <div className="text-indigo-700 font-semibold">{selectedCombination.material}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Color:</span>
                                            <div className="text-indigo-700 font-semibold">{selectedCombination.color}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Pattern:</span>
                                            <div className="text-indigo-700 font-semibold">{selectedCombination.pattern}</div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Price:</span>
                                            <div className="text-indigo-700 font-bold">{formatPrice(selectedCombination.price)}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collar Selection */}
            {dressType === "Shirt" && (
                <motion.div className="space-y-6" variants={itemVariants}>
                    <div className="flex items-center justify-between">
                        <label className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">👔</span>
                            Collar Style
                        </label>
                        <button
                            onClick={() => setShowCollarInfo(!showCollarInfo)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                        >
                            <span>ℹ️</span> Style Guide
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { label: "Regular", img: Regular },
                            { label: "Mandarin", img: Mandarin },
                            { label: "Button-Down", img: ButtonDown },
                            { label: "Spread", img: Spread },
                            { label: "LongPoint", img: LongPoint },
                        ].map((c) => (
                            <motion.div
                                key={c.label}
                                className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                                    collarType === c.label 
                                        ? "border-indigo-500 shadow-lg shadow-indigo-500/25" 
                                        : "border-gray-200 hover:border-indigo-300"
                                }`}
                                onClick={() => setCollarType(c.label)}
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="relative">
                                    <img
                                        src={c.img}
                                        alt={c.label}
                                        className="w-full h-32 object-contain bg-gray-50"
                                        onError={(e) => {
                                            e.target.src = "/collars/default.png";
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <div className="text-white text-sm font-semibold text-center">
                                            {c.label}
                                        </div>
                                    </div>
                                    {collarType === c.label && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <AnimatePresence>
                        {showCollarInfo && (
                            <motion.div
                                className="bg-gray-50 border border-gray-200 rounded-xl p-6"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <h3 className="font-semibold mb-3 text-gray-800">Collar Style Guide</h3>
                                <p className="text-sm text-gray-600">
                                    Choose from our collection of premium collar styles. Each style offers a different aesthetic and level of formality.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Sleeve Type */}
            {dressType === "Shirt" && (
                <motion.div className="space-y-4" variants={itemVariants}>
                    <label className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">👕</span>
                        Sleeve Style
                    </label>
                    
                    <div className="flex items-center gap-4">
                        <select
                            value={sleeveType}
                            onChange={(e) => setSleeveType(e.target.value)}
                            className="flex-1 border-2 border-gray-200 rounded-xl p-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                            required
                        >
                            <option value="" disabled>Choose sleeve length</option>
                            <option value="Half Sleeve">Half Sleeve</option>
                            <option value="Full Sleeve">Full Sleeve</option>
                        </select>
                        <button
                            onClick={() => setShowSleeveInfo(!showSleeveInfo)}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                        >
                            ℹ️ Info
                        </button>
                    </div>

                    <AnimatePresence>
                        {showSleeveInfo && (
                            <motion.div
                                className="bg-indigo-50 border border-indigo-200 rounded-xl p-6"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <h3 className="font-semibold mb-4 text-indigo-900">Sleeve Options</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: "Half Sleeve", desc: "Short sleeves ending at mid-arm, perfect for casual and warm weather" },
                                        { label: "Full Sleeve", desc: "Long sleeves ending at wrists, ideal for formal occasions and cooler weather" },
                                    ].map((s) => (
                                        <div
                                            key={s.label}
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                                sleeveType === s.label
                                                    ? "bg-indigo-100 border-indigo-400"
                                                    : "bg-white border-gray-200 hover:border-indigo-200"
                                            }`}
                                            onClick={() => setSleeveType(s.label)}
                                        >
                                            <div className="font-semibold text-indigo-900">{s.label}</div>
                                            <div className="text-sm text-gray-600 mt-1">{s.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Button Customization */}
            <motion.div className="space-y-6" variants={itemVariants}>
                <label className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">🔘</span>
                    Button Customization
                    <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-gray-700 font-medium">Button Type</label>
                        <select
                            value={buttonType}
                            onChange={(e) => setButtonType(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl p-4 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        >
                            <option value="">Select button type</option>
                            <option value="Plastic">Plastic - Durable & Lightweight</option>
                            <option value="Wooden">Wooden - Natural & Elegant</option>
                            <option value="Metal">Metal - Premium & Sophisticated</option>
                            <option value="Pearl">Pearl - Luxurious & Classic</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-700 font-medium">Button Color</label>
                        <input
                            type="text"
                            value={buttonColor}
                            onChange={(e) => setButtonColor(e.target.value)}
                            placeholder="e.g., White, Black, Gold, Navy"
                            className="w-full border-2 border-gray-200 rounded-xl p-4 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Navigation */}
            <motion.div 
                className="flex justify-between items-center pt-8 border-t border-gray-200"
                variants={itemVariants}
            >
                <motion.button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300"
                    whileHover={{ x: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="text-xl">←</span>
                    Back to Garment Type
                </motion.button>

                <motion.button
                    type="button"
                    onClick={onNext}
                    disabled={!material || !color}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Continue to Measurements
                    <span className="text-xl">→</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
