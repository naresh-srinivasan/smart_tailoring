import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaArrowLeft, FaArrowRight, FaCreditCard, FaRuler, FaShoppingCart, FaCalculator, FaTags, FaGift, FaCheck, FaCog, FaUser, FaChevronDown, FaSpinner } from "react-icons/fa";
import axios from "axios";

export default function MeasurementsForm({
  gender,
  dressType,
  measurementsData,
  measurementUnit,
  setMeasurementUnit,
  currency,
  setCurrency,
  formData,
  setFormData,
  showInstructions,
  toggleInstruction,
  handleExtraChange,
  materialNeeded,
  materialCosts,
  material,
  color,
  pattern,
  collarType,
  sleeveType,
  buttonType,
  buttonColor,
  totalCost,
  conversionRate = 1,
  DELIVERY_CHARGE,
  LABOUR_CHARGE,
  INTERNET_HANDLING_FEES,
  onBack,
  onSubmit,
}) {
  const [availableCurrencies, setAvailableCurrencies] = useState(["INR"]);
  const [suggestion, setSuggestion] = useState("");
  const [selectedComplementary, setSelectedComplementary] = useState("");
  
  const [useSavedProfile, setUseSavedProfile] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  
  const fields = measurementsData[gender]?.[dressType]?.measurements || [];

  const suggestionsMap = {
    Shirt: "Pant",
    Kurta: "Dupatta", 
    Saree: "Blouse",
    Lehenga: "Choli",
    Pant: "Shirt",
    Trouser: "Shirt"
  };

  // Enhanced suggestions for all dress types
  const getSuggestedOptions = (dressType) => {
    const suggestionsByType = {
      "Shirt": [
        { name: "Matching Pant", image: "https://via.placeholder.com/100x100.png?text=Pant", cost: 500, originalCost: 550 },
        { name: "Formal Trouser", image: "https://via.placeholder.com/100x100.png?text=Trouser", cost: 600, originalCost: 670 },
      ],
      "Pant": [
        { name: "Matching Shirt", image: "https://via.placeholder.com/100x100.png?text=Shirt", cost: 450, originalCost: 500 },
        { name: "Casual T-Shirt", image: "https://via.placeholder.com/100x100.png?text=TShirt", cost: 300, originalCost: 350 },
      ],
      "Kurta": [
        { name: "Matching Dupatta", image: "https://via.placeholder.com/100x100.png?text=Dupatta", cost: 250, originalCost: 300 },
        { name: "Churidar", image: "https://via.placeholder.com/100x100.png?text=Churidar", cost: 400, originalCost: 450 },
      ],
      "Saree": [
        { name: "Matching Blouse", image: "https://via.placeholder.com/100x100.png?text=Blouse", cost: 350, originalCost: 400 },
        { name: "Petticoat", image: "https://via.placeholder.com/100x100.png?text=Petticoat", cost: 200, originalCost: 250 },
      ],
      "Lehenga": [
        { name: "Matching Choli", image: "https://via.placeholder.com/100x100.png?text=Choli", cost: 550, originalCost: 600 },
        { name: "Dupatta", image: "https://via.placeholder.com/100x100.png?text=Dupatta", cost: 300, originalCost: 350 },
      ],
      "Trouser": [
        { name: "Formal Shirt", image: "https://via.placeholder.com/100x100.png?text=FormalShirt", cost: 500, originalCost: 550 },
        { name: "Blazer", image: "https://via.placeholder.com/100x100.png?text=Blazer", cost: 800, originalCost: 900 },
      ],
    };
    
    return suggestionsByType[dressType] || [];
  };

  const suggestedOptions = getSuggestedOptions(dressType);

  useEffect(() => {
    if (dressType && suggestionsMap[dressType]) {
      setSuggestion(suggestionsMap[dressType]);
      setFormData(prevData => ({ 
        ...prevData, 
        complementaryItem: suggestionsMap[dressType] 
      }));
      setSelectedComplementary(suggestionsMap[dressType]);
    }
  }, [dressType]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/INR");
        const data = await res.json();
        if (data && data.rates) setAvailableCurrencies(Object.keys(data.rates));
      } catch (err) {
        console.error("Failed to fetch currencies:", err);
      }
    };
    fetchCurrencies();
  }, []);

  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    if (useSavedProfile) {
      fetchUserProfiles();
    } else {
      setUserProfiles([]);
      setSelectedProfile("");
      const clearedForm = { ...formData };
      fields.forEach(field => {
        delete clearedForm[field.name];
      });
      setFormData(clearedForm);
    }
  }, [useSavedProfile]);

  const fetchUserProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/measurements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfiles(res.data); 
      console.log('Fetched user profiles from API:', res.data);
    } catch (err) {
      console.error("Error fetching user profiles:", err);
      setUserProfiles([]);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const loadProfileMeasurements = (profileId) => {
    console.log('Loading profile with ID:', profileId);
    console.log('Available profiles:', userProfiles);
    
    const profile = userProfiles.find(p => String(p.id) === String(profileId));
    
    console.log('Found profile:', profile);
    
    if (profile && profile.data) {
      console.log('Profile data before loading:', profile.data);
      console.log('Current formData before merge:', formData);
      console.log('Available measurement fields:', fields.map(f => f.name));
      
      let measurementData = profile.data;
      if (typeof profile.data === 'string') {
        try {
          measurementData = JSON.parse(profile.data);
          console.log('Parsed measurement data:', measurementData);
        } catch (e) {
          console.error('Failed to parse measurement data:', e);
          alert('Error loading profile data. Please try again.');
          return;
        }
      }
      
      const mappedData = {};
      fields.forEach(field => {
        const fieldName = field.name;
        if (measurementData[fieldName]) {
          mappedData[fieldName] = measurementData[fieldName];
        } else {
          const dbKey = Object.keys(measurementData).find(
            key => key.toLowerCase() === fieldName.toLowerCase()
          );
          if (dbKey) {
            mappedData[fieldName] = measurementData[dbKey];
          } else {
            const variations = [
              fieldName.toLowerCase(),
              fieldName.toUpperCase(),
              fieldName.replace(/\s+/g, '_').toLowerCase(),
              fieldName.replace(/\s+/g, '').toLowerCase()
            ];
            
            for (const variation of variations) {
              const matchedKey = Object.keys(measurementData).find(
                key => key.toLowerCase() === variation
              );
              if (matchedKey) {
                mappedData[fieldName] = measurementData[matchedKey];
                break;
              }
            }
          }
        }
      });
      
      console.log('Mapped measurement data:', mappedData);
      
      setFormData(prevData => {
        const clearedData = { ...prevData };
        fields.forEach(field => {
          delete clearedData[field.name];
        });
        
        const newFormData = {
          ...clearedData,
          ...mappedData
        };
        
        console.log('Updated formData after merge:', newFormData);
        return newFormData;
      });
      
    } else if (profile && !profile.data) {
      console.log('Profile found but no measurements available');
      alert('Selected profile has no measurements saved.');
    } else {
      console.log('No profile found with ID:', profileId);
      console.log('Profile search - ID type:', typeof profileId);
      console.log('Available profile IDs:', userProfiles.map(p => ({ id: p.id, type: typeof p.id })));
      alert('Profile not found. Please try again.');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(value * conversionRate);
  };

  const onInputChange = (e) => {
    console.log('Input change:', e.target.name, '=', e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleComplementarySelect = (option) => {
    console.log('Complementary item selected:', option.name, 'Cost:', option.cost);
    setSelectedComplementary(option.name);
    const discountedCost = option.cost * 0.9; // 10% discount
    
    setFormData(prevData => ({
      ...prevData,
      complementaryItem: option.name,
      complementaryItemCost: discountedCost,
    }));
  };

  // Remove complementary item
  const removeComplementaryItem = () => {
    setSelectedComplementary("");
    setFormData(prevData => {
      const newData = { ...prevData };
      delete newData.complementaryItem;
      delete newData.complementaryItemCost;
      return newData;
    });
  };

  const handleSavedProfileChange = (e) => {
    setUseSavedProfile(e.target.checked);
  };

  const handleProfileSelect = (e) => {
    const profileId = e.target.value;
    console.log('Profile selected from dropdown:', profileId);
    setSelectedProfile(profileId);
    if (profileId) {
      loadProfileMeasurements(profileId);
    } else {
      const clearedForm = { ...formData };
      fields.forEach(field => {
        delete clearedForm[field.name];
      });
      setFormData(clearedForm);
    }
  };

  return (

    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto max-w-6xl px-4 py-4">
      {material && (
  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex items-start justify-between">
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Your Selected Fabric & Style
      </h3>
      <ul className="space-y-1 text-sm text-gray-700">
        <li><strong>Material:</strong> {material}</li>
        <li><strong>Color:</strong> {color}</li>
        <li><strong>Pattern:</strong> {pattern}</li>
        <li><strong>Collar:</strong> {collarType}</li>
        <li><strong>Sleeve:</strong> {sleeveType}</li>
        <li><strong>Button Type:</strong> {buttonType}</li>
        <li><strong>Button Color:</strong> {buttonColor}</li>
      </ul>
    </div>

    {/* ✅ Change button to go back */}
    <button
      onClick={onBack} 
      className="ml-4 px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
    >
      Change
    </button>
  </div>
)}
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md mb-4">
            <FaRuler className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Custom Measurements for {dressType}
          </h1>
          <p className="text-gray-600 text-base">
            Provide precise measurements for the perfect fit
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            {/* Left Column - Form Sections (3/4 width) */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Configuration & Profiles Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Configuration Panel - Compact */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
                        <FaCog className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Configuration</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Measurement Unit
                      </label>
                      <select
                        value={measurementUnit}
                        onChange={(e) => setMeasurementUnit(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                      >
                        <option value="cm">Centimeters (cm)</option>
                        <option value="inches">Inches (in)</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Saved Profiles - Enhanced */}
                <section className="bg-white rounded-lg shadow-md border-2 border-emerald-200 overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Load Saved Profile</h3>
                        <p className="text-xs text-emerald-700">Auto-fill measurements</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="useSavedProfile"
                          checked={useSavedProfile}
                          onChange={handleSavedProfileChange}
                          className="w-4 h-4 text-emerald-600 border border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="useSavedProfile" className="text-sm font-medium text-gray-700 cursor-pointer">
                          Use saved measurements profile
                        </label>
                      </div>

                      {useSavedProfile && (
                        <div className="mt-3 space-y-3">
                          {loadingProfiles ? (
                            <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                              <FaSpinner className="w-5 h-5 text-emerald-500 animate-spin mr-2" />
                              <span className="text-sm text-gray-600 font-medium">Loading your saved profiles...</span>
                            </div>
                          ) : userProfiles.length > 0 ? (
                            <div className="relative">
                              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Select Profile
                              </label>
                              <select
                                value={selectedProfile}
                                onChange={handleProfileSelect}
                                className="w-full px-3 py-2 text-sm border-2 border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700 appearance-none"
                              >
                                <option value="">Choose a saved profile...</option>
                                {userProfiles.map((profile) => (
                                  <option key={profile.id} value={profile.id}>
                                    {profile.person_name}
                                  </option>
                                ))}
                              </select>
                              <FaChevronDown className="absolute right-3 top-8 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                          ) : (
                            <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600">No saved profiles found</p>
                              <p className="text-xs text-gray-500 mt-1">Save a profile first to use this feature</p>
                            </div>
                          )}

                          {selectedProfile && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <FaCheck className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-green-800">
                                    Profile Loaded Successfully!
                                  </h4>
                                  <p className="text-xs text-green-700 mt-1">
                                    Measurements from <strong>"{userProfiles.find(p => p.id === selectedProfile)?.person_name}"</strong> have been loaded into the form below.
                                  </p>
                                  <p className="text-xs text-green-600 mt-1">
                                    You can modify any values if needed.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* Body Measurements - Enhanced with Better Visual Hierarchy */}
              <section className="bg-white rounded-lg shadow-lg border-2 border-blue-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center shadow-sm">
                        <FaRuler className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Body Measurements</h2>
                        <p className="text-sm text-gray-700">Enter precise measurements for perfect fit</p>
                      </div>
                    </div>
                    {selectedProfile && (
                      <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                        Profile Loaded
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {fields.map((m) => {
                      const fieldValue = formData[m.name];
                      console.log(`Rendering input for ${m.name}:`, fieldValue);
                      
                      return (
                        <div key={m.name} className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            {m.name}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              name={m.name}
                              value={fieldValue || ""}
                              onChange={onInputChange}
                              placeholder={fieldValue ? "" : `Enter ${m.name}`}
                              className={`w-full px-3 py-2 pr-8 text-sm border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium transition-all duration-200 ${
                                fieldValue ? 'border-blue-300 bg-blue-50 text-blue-900 font-semibold' : 'border-gray-200 bg-white'
                              }`}
                              step="0.1"
                              min="0"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => toggleInstruction(m.name)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-all duration-200"
                              aria-label={`Instructions for ${m.name}`}
                            >
                              <FaInfoCircle className="w-4 h-4" />
                            </button>
                          </div>
                          {showInstructions[m.name] && (
                            <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg text-xs shadow-sm">
                              <p className="text-blue-800 font-medium">{m.instruction}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Show measurement count and completion status */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                      <span>
                        {fields.length} measurements required
                      </span>
                      <span>•</span>
                      <span className={`font-medium ${
                        Object.keys(formData).filter(key => formData[key] && fields.some(f => f.name === key)).length === fields.length 
                        ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {Object.keys(formData).filter(key => formData[key] && fields.some(f => f.name === key)).length} completed
                      </span>
                      {selectedProfile && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">
                            Loaded from profile
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Suggested Products - Now shown for ALL dress types */}
              {suggestedOptions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Suggested Products Section */}
                  <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-purple-50 px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-md bg-purple-500 flex items-center justify-center">
                          <FaGift className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">Suggested with {dressType}</h4>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="space-y-2">
                        {suggestedOptions.map((option) => (
                          <div
                            key={option.name}
                            onClick={() => handleComplementarySelect(option)}
                            className={`cursor-pointer p-2 rounded-md border transition-all ${
                              selectedComplementary === option.name 
                                ? "border-blue-500 bg-blue-50" 
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {selectedComplementary === option.name && (
                                <FaCheck className="w-3 h-3 text-blue-600" />
                              )}
                              <div className="w-8 h-8 rounded-md overflow-hidden">
                                <img src={option.image} alt={option.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-xs font-semibold text-gray-900">{option.name}</h5>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-500 line-through">{formatCurrency(option.originalCost)}</span>
                                  <span className="font-bold text-green-600">{formatCurrency(option.cost * 0.9)}</span>
                                  <span className="bg-red-100 text-red-600 px-1 rounded text-xs">
                                    10% OFF
                                  </span>
                                </div>
                              </div>
                              {selectedComplementary === option.name && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeComplementaryItem();
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Premium Add-ons */}
                  {measurementsData[gender]?.[dressType]?.extras?.length > 0 && (
                    <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-pink-50 px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-md bg-pink-500 flex items-center justify-center">
                            <FaTags className="w-3 h-3 text-white" />
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900">Premium Add-ons</h4>
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="space-y-2">
                          {measurementsData[gender][dressType].extras.map((ex, idx) => (
                            <label
                              key={ex.name}
                              className={`cursor-pointer block p-2 rounded-md border transition-all ${
                                ex.selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={!!ex.selected}
                                  onChange={() => handleExtraChange(idx)}
                                  className="w-3 h-3 text-blue-600 border border-gray-300 rounded"
                                />
                                <div className="flex-1">
                                  <h5 className="text-xs font-semibold text-gray-900">{ex.name}</h5>
                                  <p className="text-xs font-bold text-green-600">+ {formatCurrency(ex.cost)}</p>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              )}

              {/* Special Instructions - Compact */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-indigo-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center">
                      <FaInfoCircle className="w-3 h-3 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Special Instructions</h4>
                  </div>
                </div>

                <div className="p-3">
                  <textarea
                    name="otherInstructions"
                    value={formData.otherInstructions || ""}
                    onChange={onInputChange}
                    rows="3"
                    placeholder="Any specific requirements..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
                  />
                </div>
              </section>
            </div>

            {/* Right Column - Currency, Material & Summary (1/4 width) */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Currency Selection - Compact */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-green-50 px-3 py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center">
                      <FaCreditCard className="w-3 h-3 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Currency</h4>
                  </div>
                </div>
                
                <div className="p-3">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                  >
                    {availableCurrencies.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {/* Material Information - Compact */}
              {materialNeeded > 0 && (
                <section className="bg-blue-50 rounded-lg border border-blue-200 p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaRuler className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Material</h4>
                  </div>
                  <div className="bg-white rounded-md p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{materialNeeded}m</div>
                    <p className="text-xs text-gray-600">Required fabric</p>
                  </div>
                </section>
              )}

              {/* Order Summary - Medium Size, Enhanced Visibility */}
              <section className="bg-white rounded-lg shadow-lg border-2 border-blue-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-md bg-white bg-opacity-20 flex items-center justify-center">
                      <FaCalculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">Order Summary</h3>
                      <p className="text-xs text-blue-100">Cost breakdown</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {/* Base Costs */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">Base Costs</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">Base</span>
                          <span className="font-semibold">
                            {formatCurrency(measurementsData[gender]?.[dressType]?.baseCost || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">Material</span>
                          <span className="font-semibold">
                            {formatCurrency(
                              material && materialCosts[material]
                                ? materialCosts[material] * (materialNeeded || 0)
                                : 0
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">Labour</span>
                          <span className="font-semibold">{formatCurrency(LABOUR_CHARGE)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Charges */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">Additional</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">Delivery</span>
                          <span className="font-semibold">{formatCurrency(DELIVERY_CHARGE)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">Handling</span>
                          <span className="font-semibold">{formatCurrency(INTERNET_HANDLING_FEES)}</span>
                        </div>
                        {formData.complementaryItemCost && formData.complementaryItem && (
                          <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded">
                            <span className="text-gray-700 text-xs font-medium">
                              {formData.complementaryItem} <span className="text-green-600">(10% OFF)</span>
                            </span>
                            <span className="font-semibold text-green-700">{formatCurrency(formData.complementaryItemCost)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add-ons */}
                    {measurementsData[gender]?.[dressType]?.extras
                      ?.filter((ex) => ex.selected).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">Add-ons</h4>
                        <div className="space-y-1">
                          {measurementsData[gender][dressType].extras
                            .filter((ex) => ex.selected)
                            .map((ex) => (
                              <div key={ex.name} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700 text-xs">{ex.name}</span>
                                <span className="font-semibold text-xs">{formatCurrency(ex.cost)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-2 border-t-2 border-gray-200">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold">Total</span>
                          <span className="text-lg font-bold">{formatCurrency(totalCost)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Navigation - Compact */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Proceed to Summary
              <FaArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
