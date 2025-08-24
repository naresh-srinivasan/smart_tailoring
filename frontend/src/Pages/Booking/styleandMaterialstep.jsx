import React, { useEffect, useState } from "react";

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

    // ✅ Fetch inventory from backend
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/inventory");
                const data = await response.json();

                if (Array.isArray(data.items)) {
                    setInventory(data.items);
                } else {
                    setInventory([]);
                }
            } catch (err) {
                console.error("Error fetching inventory:", err);
            }
        };
        fetchInventory();
    }, []);

    // ✅ Unique materials
    const allowedMaterials = [...new Set(inventory.map((item) => item.material_name))];

    // ✅ Get available color and pattern combinations for selected material
    const getAvailableCombinations = () => {
        if (!material) return [];
        
        return inventory
            .filter((item) => item.material_name === material)
            .map((item) => ({
                id: item.id,
                color: item.color,
                pattern: item.pattern || 'Solid',
                material: item.material_name,
                image: item.image_url || null, // assuming you have image URLs
                price: item.price || 0,
                stock: item.stock || 0
            }));
    };

    const availableCombinations = getAvailableCombinations();

    // ✅ Handle combination selection
    const handleCombinationSelect = (combination) => {
        setSelectedCombination(combination);
        setColor(combination.color);
        setPattern(combination.pattern);
    };

    // ✅ Create visual preview for combination
    const createPatternPreview = (color, pattern) => {
        const baseStyle = {
            width: '100%',
            height: '80px',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color.startsWith("#") ? color : '#f3f4f6',
        };

        switch (pattern?.toLowerCase()) {
            case 'stripes':
            case 'striped':
                return (
                    <div style={baseStyle}>
                        <div className="w-full h-full relative overflow-hidden rounded-md">
                            <div 
                                className="absolute inset-0"
                                style={{
                                    background: `repeating-linear-gradient(
                                        45deg,
                                        ${color.startsWith("#") ? color : '#3b82f6'},
                                        ${color.startsWith("#") ? color : '#3b82f6'} 10px,
                                        rgba(255,255,255,0.3) 10px,
                                        rgba(255,255,255,0.3) 20px
                                    )`
                                }}
                            />
                        </div>
                    </div>
                );
            
            case 'dots':
            case 'polka dots':
                return (
                    <div style={baseStyle}>
                        <div className="w-full h-full relative overflow-hidden rounded-md">
                            <div 
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: color.startsWith("#") ? color : '#3b82f6',
                                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 2px, transparent 2px)`,
                                    backgroundSize: '15px 15px'
                                }}
                            />
                        </div>
                    </div>
                );
            
            case 'checkered':
            case 'checks':
                return (
                    <div style={baseStyle}>
                        <div className="w-full h-full relative overflow-hidden rounded-md">
                            <div 
                                className="absolute inset-0"
                                style={{
                                    background: `conic-gradient(from 90deg at 50% 50%, 
                                        ${color.startsWith("#") ? color : '#3b82f6'} 90deg, 
                                        rgba(255,255,255,0.5) 90deg, 
                                        rgba(255,255,255,0.5) 180deg, 
                                        ${color.startsWith("#") ? color : '#3b82f6'} 180deg, 
                                        ${color.startsWith("#") ? color : '#3b82f6'} 270deg, 
                                        rgba(255,255,255,0.5) 270deg)`,
                                    backgroundSize: '20px 20px'
                                }}
                            />
                        </div>
                    </div>
                );
            
            case 'floral':
                return (
                    <div style={baseStyle}>
                        <div className="w-full h-full relative overflow-hidden rounded-md flex items-center justify-center">
                            <div style={{ backgroundColor: color.startsWith("#") ? color : '#3b82f6' }} className="absolute inset-0" />
                            <div className="text-white text-xl opacity-70">🌸</div>
                        </div>
                    </div>
                );
            
            case 'solid':
            default:
                return (
                    <div style={baseStyle}>
                        <span className="text-gray-500 font-medium">Solid</span>
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

            {/* Color and Pattern Combinations */}
            {material && availableCombinations.length > 0 && (
                <div className="flex flex-col gap-4">
                    <label className="text-gray-700 font-medium">
                        Available Color & Pattern Combinations
                    </label>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {availableCombinations.map((combination, index) => (
                            <div
                                key={`${combination.id}-${index}`}
                                onClick={() => handleCombinationSelect(combination)}
                                className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 hover:shadow-md ${
                                    selectedCombination?.id === combination.id
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                {/* Visual Preview */}
                                <div className="mb-3">
                                    {combination.image ? (
                                        <img
                                            src={combination.image}
                                            alt={`${combination.color} ${combination.pattern}`}
                                            className="w-full h-20 object-cover rounded-md border"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <div style={{ display: combination.image ? 'none' : 'block' }}>
                                        {createPatternPreview(combination.color, combination.pattern)}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                            style={{
                                                backgroundColor: combination.color.startsWith("#")
                                                    ? combination.color
                                                    : 'transparent',
                                                border: combination.color.startsWith("#") 
                                                    ? `2px solid ${combination.color}` 
                                                    : '2px solid #d1d5db'
                                            }}
                                        />
                                        <span className="text-sm font-medium text-gray-800 truncate">
                                            {combination.color}
                                        </span>
                                    </div>
                                    
                                    <div className="text-sm text-gray-600 capitalize">
                                        {combination.pattern || 'Solid'}
                                    </div>
                                    
                                    {combination.stock !== undefined && (
                                        <div className={`text-xs ${combination.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {combination.stock > 0 ? `${combination.stock} available` : 'Out of stock'}
                                        </div>
                                    )}
                                </div>

                                {/* Selection indicator */}
                                {selectedCombination?.id === combination.id && (
                                    <div className="mt-2 flex justify-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Selected combination display */}
                    {selectedCombination && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <h4 className="font-medium text-blue-900 mb-2">Selected Combination:</h4>
                            <div className="flex items-center gap-4 text-sm">
                                <span><strong>Material:</strong> {selectedCombination.material}</span>
                                <span><strong>Color:</strong> {selectedCombination.color}</span>
                                <span><strong>Pattern:</strong> {selectedCombination.pattern}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Collar + Sleeve only for Shirts */}
            {dressType === "Shirt" && (
                <>
                    {/* Collar */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-gray-700 font-medium">Collar Type</label>
                        <div className="flex items-center gap-2">
                            <select
                                value={collarType}
                                onChange={(e) => setCollarType(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                required
                            >
                                <option value="">Select Collar Type</option>
                                <option value="Regular">Regular</option>
                                <option value="Mandarin">Mandarin</option>
                                <option value="Button-Down">Button-Down</option>
                                <option value="Spread">Spread</option>
                                <option value="Cutaway">Cutaway</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => setShowCollarInfo(!showCollarInfo)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                i
                            </button>
                        </div>

                        {showCollarInfo && (
                            <div className="mt-3 p-3 bg-gray-50 border rounded-lg shadow-inner">
                                <h3 className="font-semibold mb-2 text-gray-700">Collar Types</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: "Regular", desc: "Standard shirt collar" },
                                        { label: "Mandarin", desc: "Stand-up collar without fold" },
                                        { label: "Button-Down", desc: "Collar with buttons" },
                                        { label: "Spread", desc: "Wide collar opening" },
                                        { label: "Cutaway", desc: "Very wide collar opening" },
                                    ].map((c) => (
                                        <div
                                            key={c.label}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                collarType === c.label
                                                    ? "bg-blue-100 border-blue-500"
                                                    : "hover:bg-gray-100"
                                            }`}
                                            onClick={() => setCollarType(c.label)}
                                        >
                                            <div className="font-medium">{c.label}</div>
                                            <div className="text-sm text-gray-600">{c.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sleeve */}
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
                </>
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