import React, { useEffect, useState } from "react";
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

    // Function to calculate discount percentage
    const calculateDiscount = (originalPrice, currentPrice) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    // Function to format currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Function to convert color names or values to hex format
    const getColorHex = (colorValue) => {
        if (colorValue && colorValue.startsWith('#')) {
            return colorValue;
        }
        
        const colorMap = {
            'red': '#FF0000',
            'blue': '#0000FF',
            'green': '#008000',
            'yellow': '#FFFF00',
            'black': '#000000',
            'white': '#FFFFFF',
            'gray': '#808080',
            'grey': '#808080',
            'purple': '#800080',
            'orange': '#FFA500',
            'pink': '#FFC0CB',
            'brown': '#A52A2A',
            'navy': '#000080',
            'maroon': '#800000',
            'olive': '#808000',
            'lime': '#00FF00',
            'aqua': '#00FFFF',
            'teal': '#008080',
            'silver': '#C0C0C0',
            'fuchsia': '#FF00FF',
        };
        
        const colorName = colorValue ? colorValue.toLowerCase() : '';
        return colorMap[colorName] || '#3b82f6';
    };

    const createPatternPreview = (color, pattern) => {
        const hexColor = getColorHex(color);
        
        const getStripeColors = (baseColor) => {
            const colorLower = baseColor.toLowerCase();
            
            if (colorLower === '#ffff00' || colorLower === 'yellow') {
                return {
                    baseColor: '#ffd700',
                    stripeColor: '#b8860b',
                    lightStripe: '#fff8dc'
                };
            }
            
            if (colorLower === '#ffffff' || colorLower === 'white') {
                return {
                    baseColor: baseColor,
                    stripeColor: '#cccccc',
                    lightStripe: '#f0f0f0'
                };
            }
            
            return {
                baseColor: baseColor,
                stripeColor: baseColor,
                lightStripe: 'rgba(255,255,255,0.4)'
            };
        };
        
        const { baseColor: adjustedBase, stripeColor, lightStripe } = getStripeColors(hexColor);
        
        const baseStyle = {
            width: "100%",
            height: "80px",
            borderRadius: "8px",
            border: "2px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: adjustedBase,
        };

        switch (pattern?.toLowerCase()) {
            case "stripes":
            case "striped":
                return (
                    <div style={baseStyle}>
                        <div
                            className="w-full h-full relative overflow-hidden rounded-md"
                            style={{
                                background: `repeating-linear-gradient(
                                    45deg,
                                    ${stripeColor},
                                    ${stripeColor} 8px,
                                    ${lightStripe} 8px,
                                    ${lightStripe} 16px
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
                            className="w-full h-full relative overflow-hidden rounded-md"
                            style={{
                                backgroundColor: adjustedBase,
                                backgroundImage: hexColor.toLowerCase() === '#ffff00' || color.toLowerCase() === 'yellow'
                                    ? "radial-gradient(circle, rgba(184,134,11,0.8) 2px, transparent 2px)"
                                    : "radial-gradient(circle, rgba(255,255,255,0.8) 2px, transparent 2px)",
                                backgroundSize: "15px 15px",
                            }}
                        />
                    </div>
                );
            case "checkered":
            case "checks":
                return (
                    <div style={baseStyle}>
                        <div
                            className="w-full h-full relative overflow-hidden rounded-md"
                            style={{
                                background: `conic-gradient(from 90deg at 50% 50%, 
                                    ${stripeColor} 90deg, 
                                    ${lightStripe} 90deg, 
                                    ${lightStripe} 180deg, 
                                    ${stripeColor} 180deg, 
                                    ${stripeColor} 270deg, 
                                    ${lightStripe} 270deg)`,
                                backgroundSize: "20px 20px",
                            }}
                        />
                    </div>
                );
            case "floral":
                return (
                    <div style={baseStyle}>
                        <div
                            className="w-full h-full relative overflow-hidden rounded-md flex items-center justify-center"
                            style={{ backgroundColor: adjustedBase }}
                        >
                            <div className={`text-xl opacity-70 ${
                                hexColor.toLowerCase() === '#ffff00' || color.toLowerCase() === 'yellow' 
                                    ? 'text-amber-800' 
                                    : 'text-white'
                            }`}>🌸</div>
                        </div>
                    </div>
                );
            case "solid":
            default:
                return (
                    <div style={baseStyle}>
                        <span className={`font-medium drop-shadow-md ${
                            hexColor.toLowerCase() === '#ffff00' || color.toLowerCase() === 'yellow'
                                ? 'text-amber-800'
                                : 'text-white text-opacity-70'
                        }`}>Solid</span>
                    </div>
                );
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Material Selection */}
            <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Material</label>
                <select
                    value={material}
                    onChange={(e) => {
                        setMaterial(e.target.value);
                        setColor("");
                        setPattern("");
                        setSelectedCombination(null);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                >
                    <option value="">Select Material</option>
                    {allowedMaterials.map((mat) => (
                        <option key={mat} value={mat}>
                            {mat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Color & Pattern Combinations */}
            {material && availableCombinations.length > 0 && (
                <div className="flex flex-col gap-4">
                    <label className="text-gray-700 font-medium">
                        Available Color & Pattern Combinations
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {availableCombinations.map((combination, index) => {
                            const hexColor = getColorHex(combination.color);
                            const discountPercentage = calculateDiscount(combination.original_price, combination.price);
                            const hasDiscount = discountPercentage > 0;
                            
                            return (
                                <div
                                    key={`${combination.id}-${index}`}
                                    onClick={() => handleCombinationSelect(combination)}
                                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 hover:shadow-md ${
                                        selectedCombination?.id === combination.id
                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="mb-3">
                                        {combination.image ? (
                                            <img
                                                src={combination.image}
                                                alt={`${combination.color} ${combination.pattern}`}
                                                className="w-full h-20 object-cover rounded-md border"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.nextSibling.style.display = "block";
                                                }}
                                            />
                                        ) : null}
                                        <div style={{ display: combination.image ? "none" : "block" }}>
                                            {createPatternPreview(combination.color, combination.pattern)}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 shadow-sm"
                                                style={{
                                                    backgroundColor: hexColor,
                                                    borderColor: hexColor === '#FFFFFF' ? '#d1d5db' : hexColor,
                                                }}
                                            />
                                            <span className="text-sm font-medium text-gray-800 truncate capitalize">
                                                {combination.color}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 capitalize">
                                            {combination.pattern || "Solid"}
                                        </div>

                                        {/* Enhanced Price Display with Discount */}
                                        <div className="space-y-1">
                                            {hasDiscount ? (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs text-gray-500 line-through">
                                                        {formatPrice(combination.original_price)}
                                                    </span>
                                                    <span className="text-sm font-bold text-red-600">
                                                        {formatPrice(combination.price)}
                                                    </span>
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                        {discountPercentage}% OFF
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800">
                                                    {formatPrice(combination.price)}
                                                </span>
                                            )}
                                        </div>

                                        {combination.total_quantity !== undefined && (
                                            <div
                                                className={`text-xs ${
                                                    combination.total_quantity > 0 ? "text-green-600" : "text-red-500"
                                                }`}
                                            >
                                                {combination.total_quantity > 0
                                                    ? `${combination.total_quantity} m available`
                                                    : "Out of stock"}
                                            </div>
                                        )}
                                    </div>

                                    {selectedCombination?.id === combination.id && (
                                        <div className="mt-2 flex justify-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {selectedCombination && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <h4 className="font-medium text-blue-900 mb-2">Selected Combination:</h4>
                            <div className="flex items-center gap-4 text-sm flex-wrap">
                                <span>
                                    <strong>Material:</strong> {selectedCombination.material}
                                </span>
                                <span>
                                    <strong>Color:</strong> {selectedCombination.color}
                                </span>
                                <span>
                                    <strong>Pattern:</strong> {selectedCombination.pattern}
                                </span>
                                <div
                                    className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                                    style={{
                                        backgroundColor: getColorHex(selectedCombination.color),
                                    }}
                                />
                                <div className="flex items-center gap-2">
                                    <strong>Price:</strong>
                                    {calculateDiscount(selectedCombination.original_price, selectedCombination.price) > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 line-through text-sm">
                                                {formatPrice(selectedCombination.original_price)}
                                            </span>
                                            <span className="text-red-600 font-bold">
                                                {formatPrice(selectedCombination.price)}
                                            </span>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                {calculateDiscount(selectedCombination.original_price, selectedCombination.price)}% OFF
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="font-bold">
                                            {formatPrice(selectedCombination.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Collar Selection (image-based) */}
            {dressType === "Shirt" && (
                <div className="flex flex-col gap-2 relative">
                    <label className="text-gray-700 font-medium">Collar Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-2">
                        {[
                            { label: "Regular", img: Regular },
                            { label: "Mandarin", img: Mandarin },
                            { label: "Button-Down", img: ButtonDown },
                            { label: "Spread", img: Spread },
                            { label: "LongPoint", img: LongPoint },
                        ].map((c) => (
                            <div
                                key={c.label}
                                onClick={() => setCollarType(c.label)}
                                className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 relative ${
                                    collarType === c.label ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <img
                                    src={c.img}
                                    alt={c.label}
                                    className="w-full h-28 object-contain"
                                    onError={(e) => {
                                        e.target.src = "/collars/default.png";
                                    }}
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center text-sm py-1">
                                    {c.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {showCollarInfo && (
                        <div className="mt-3 p-3 bg-gray-50 border rounded-lg shadow-inner">
                            <h3 className="font-semibold mb-2 text-gray-700">Collar Types</h3>
                            <p className="text-sm text-gray-600">Click on an image to select the collar type.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Sleeve Type */}
            {dressType === "Shirt" && (
                <div className="flex flex-col gap-2 relative">
                    <label className="text-gray-700 font-medium">Sleeve Type</label>
                    <div className="flex items-center gap-2">
                        <select
                            value={sleeveType}
                            onChange={(e) => setSleeveType(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                        >
                            <option value="">Select Sleeve Type</option>
                            <option value="Half Sleeve">Half Sleeve</option>
                            <option value="Full Sleeve">Full Sleeve</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => setShowSleeveInfo(!showSleeveInfo)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            i
                        </button>
                    </div>

                    {showSleeveInfo && (
                        <div className="mt-3 p-3 bg-gray-50 border rounded-lg shadow-inner">
                            <h3 className="font-semibold mb-2 text-gray-700">Sleeve Types</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Half Sleeve", desc: "Short sleeves ending at mid-arm" },
                                    { label: "Full Sleeve", desc: "Long sleeves ending at wrists" },
                                ].map((s) => (
                                    <div
                                        key={s.label}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                            sleeveType === s.label
                                                ? "bg-blue-100 border-blue-500"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setSleeveType(s.label)}
                                    >
                                        <div className="font-medium">{s.label}</div>
                                        <div className="text-sm text-gray-600">{s.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Button Type (optional)</label>
                    <select
                        value={buttonType}
                        onChange={(e) => setButtonType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option value="">Select Button Type</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Wooden">Wooden</option>
                        <option value="Metal">Metal</option>
                        <option value="Pearl">Pearl</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Button Color (optional)</label>
                    <input
                        type="text"
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        placeholder="e.g., White, Black, Gold"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition text-lg font-bold flex items-center gap-2"
                >
                    ← Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!material || !color}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-yellow-500 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-yellow-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Measurements
                </button>
            </div>
        </div>
    );
}
