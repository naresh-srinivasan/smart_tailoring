import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import measurementsData from "../data/Booking.json";
import materialCosts from "../data/Material.json";
import { calculateMaterialNeeded } from "./MaterialsCalculation";

import StepIndicator from "./Booking/stepIndicator";
import GenderSelection from "./Booking/genderSelection";
import DressTypeSelection from "./Booking/dressTypeSelection";
import StyleAndMaterialStep from "./Booking/styleandMaterialstep";
import MeasurementsForm from "./Booking/MeasurementsForm";
import OrderSummary from "./Booking/ordeSummary";
import OrderCompleted from "./Booking/orderCompleted";

export default function BookNow() {
  /* ---------------- States ---------------- */
  const [step, setStep] = useState(1);

  const [gender, setGender] = useState("");
  const [dressType, setDressType] = useState("");

  const [formData, setFormData] = useState({});
  const [showInstructions, setShowInstructions] = useState({});

  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [pattern, setPattern] = useState("");
  const [collarType, setCollarType] = useState("");
  const [sleeveType, setSleeveType] = useState("");
  const [buttonType, setButtonType] = useState("");
  const [buttonColor, setButtonColor] = useState("");

  const [measurementUnit, setMeasurementUnit] = useState("cm");
  const [materialNeeded, setMaterialNeeded] = useState(0);
  
  // Add new state for material price per meter from inventory
  const [materialPricePerMeter, setMaterialPricePerMeter] = useState(0);

  const [currency, setCurrency] = useState("INR");
  const [conversionRates, setConversionRates] = useState({ INR: 1 });

  const [inventory, setInventory] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [expectedDate, setExpectedDate] = useState("");

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const [showCollarInfo, setShowCollarInfo] = useState(false);
  const [showSleeveInfo, setShowSleeveInfo] = useState(false);

  /* ---------------- Constants ---------------- */
  const DELIVERY_CHARGE = 50;
  const LABOUR_CHARGE = 100;
  const INTERNET_HANDLING_FEES = 30;
  const API_BASE = "http://localhost:5000/api";

  /* ---------------- Fetch user profile ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetch(`${API_BASE}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUserProfile(data))
      .catch(console.error);
  }, []);

  /* ---------------- Fetch inventory ---------------- */
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`${API_BASE}/inventory`);
        const data = await res.json();
        setInventory(data.items || []);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
        setInventory([]);
      }
    };
    fetchInventory();
  }, []);

  /* ---------------- Fetch conversion rates ---------------- */
  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/INR`);
        const data = await res.json();
        setConversionRates(data.rates || { INR: 1 });
      } catch (err) {
        console.error("Failed to fetch conversion rates:", err);
        setConversionRates({ INR: 1 });
      }
    };
    fetchConversionRates();
  }, []);

  /* ---------------- Update Material Price when Material/Color Changes ---------------- */
  useEffect(() => {
    if (material && color && inventory.length > 0) {
      const selectedInventoryItem = inventory.find(
        (item) =>
          item.material_name?.toLowerCase() === material.toLowerCase() &&
          item.color?.toLowerCase() === color.toLowerCase()
      );
      
      if (selectedInventoryItem) {
        setMaterialPricePerMeter(selectedInventoryItem.price || 0);
        console.log(`Material price updated: ${selectedInventoryItem.price}/meter for ${material} - ${color}`);
      } else {
        setMaterialPricePerMeter(0);
        console.log(`No inventory item found for ${material} - ${color}`);
      }
    } else {
      setMaterialPricePerMeter(0);
    }
  }, [material, color, inventory]);

  /* ---------------- Step Handlers ---------------- */
  const handleGenderSelect = (g) => {
    setGender(g);
    setDressType("");
    setMaterial("");
    setColor("");
    setPattern("");
    setCollarType("");
    setSleeveType("");
    setButtonType("");
    setButtonColor("");
    setFormData({});
    setMaterialPricePerMeter(0);
    setStep(2);
  };

  const handleDressTypeSelect = (type) => {
    setDressType(type);
    const initialData = {};
    const measurements = measurementsData[gender]?.[type]?.measurements;
    if (!measurements) return alert("No measurements found!");

    measurements.forEach((m) => (initialData[m.name] = ""));
    setFormData(initialData);
    setMaterialNeeded(0);
    setMaterialPricePerMeter(0);
    setStep(3);
  };

  /* ---------------- Calculate Material Needed ---------------- */
  useEffect(() => {
    if (dressType && formData && Object.keys(formData).length > 0) {
      try {
        const needed = calculateMaterialNeeded(dressType, formData, measurementUnit);
        setMaterialNeeded(parseFloat(needed) || 0);
      } catch (error) {
        console.error("Error calculating material needed:", error);
        setMaterialNeeded(0);
      }
    }
  }, [formData, dressType, measurementUnit]);

  /* ---------------- Promo Code ---------------- */
  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/orders/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setPromoError(data.message || "Invalid promo code");
        setDiscount(0);
        return;
      }
      setDiscount(data.discountPercentage || 0);
      setPromoError("");
    } catch (err) {
      console.error("Promo code error:", err);
      setPromoError(err.message || "Invalid promo code");
      setDiscount(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePromoCode = () => {
    setDiscount(0);
    setPromoError("");
    setPromoCode("");
  };

  /* ---------------- Calculate Total Cost ---------------- */
  const totalCost = useMemo(() => {
    if (!dressType || !gender) return 0;
    const base = measurementsData[gender][dressType]?.baseCost || 0;
    const extrasSum =
      (measurementsData[gender][dressType]?.extras || [])
        .filter((ex) => ex.selected)
        .reduce((sum, ex) => sum + ex.cost, 0) || 0;

    // Use dynamic material price from selected inventory item
    const materialPrice = materialPricePerMeter * parseFloat(materialNeeded || 0);

    // Include complementary item cost from formData
    const complementaryCost = formData.complementaryItemCost ? parseFloat(formData.complementaryItemCost) : 0;

    let total = base + extrasSum + materialPrice + DELIVERY_CHARGE + LABOUR_CHARGE + INTERNET_HANDLING_FEES + complementaryCost;
    if (discount > 0) total = total - total * (discount / 100);
    
    console.log('Total Cost Calculation:', {
      base,
      extrasSum,
      materialPrice: `${materialPricePerMeter} × ${materialNeeded} = ${materialPrice}`,
      complementaryCost,
      DELIVERY_CHARGE,
      LABOUR_CHARGE,
      INTERNET_HANDLING_FEES,
      discount,
      total
    });
    
    return total;
  }, [materialNeeded, materialPricePerMeter, dressType, gender, discount, formData.complementaryItemCost]);

  /* ---------------- UI Helpers ---------------- */
  const toggleInstruction = (name) =>
    setShowInstructions((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleExtraChange = (index) => {
    const extras = [...(measurementsData[gender][dressType]?.extras || [])];
    extras[index] = { ...extras[index], selected: !extras[index].selected };
    measurementsData[gender][dressType].extras = extras;
    setFormData({ ...formData }); // trigger re-render
  };

  const proceedFromStyleToMeasurements = () => {
    if (!material || !color) return alert("Please select material and color");
    if (dressType === "Shirt" && (!collarType || !sleeveType))
      return alert("Please select collar and sleeve type");
    setStep(4);
  };

  const proceedToSummary = (e) => {
    e.preventDefault();
    const measurements = measurementsData[gender]?.[dressType]?.measurements || [];
    const missing = measurements.filter(
      (m) => !formData[m.name] || String(formData[m.name]).trim() === ""
    );
    if (missing.length > 0)
      return alert(`Please fill all measurements: ${missing.map((m) => m.name).join(", ")}`);
    setStep(5);
  };

  /* ---------------- Submit Order ---------------- */
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    if (!expectedDate) return alert("Select expected date");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      // check inventory
      const inventoryItem = inventory.find(
        (item) =>
          item.material_name?.toLowerCase() === material.toLowerCase() &&
          item.color?.toLowerCase() === color.toLowerCase()
      );
      if (!inventoryItem) throw new Error("Material/color not available");
      if (materialNeeded > inventoryItem.total_quantity)
        throw new Error(
          `Insufficient stock. Required: ${materialNeeded}m, Available: ${inventoryItem.total_quantity}m`
        );

      const extrasSelected =
        (measurementsData[gender]?.[dressType]?.extras || [])
          .filter((ex) => ex.selected)
          .map((ex) => ex.name) || [];

      const orderData = {
        gender,
        dress_type: dressType,
        measurements: {
          ...formData,
          unit: measurementUnit,
          collar_type: dressType === "Shirt" ? collarType : undefined,
          sleeve_type: dressType === "Shirt" ? sleeveType : undefined,
          buttons: {
            type: buttonType || undefined,
            color: buttonColor || undefined,
          },
        },
        material,
        color,
        pattern,
        material_needed: materialNeeded,
        material_price_per_meter: materialPricePerMeter,
        total_material_cost: materialPricePerMeter * materialNeeded,
        extras: extrasSelected,
        delivery_address: deliveryAddress,
        expected_date: expectedDate,
        delivery_charge: DELIVERY_CHARGE,
        promo_code: promoCode || null,
        discount_percentage: discount || 0,
        totalAmount: totalCost,
      };

      // create order
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Failed to submit order");

      const orderResult = await response.json();
      await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: `New order placed by ${userProfile.name || "Customer"} for ${dressType}`,
        }),
      });

      // update inventory
      await fetch(`${API_BASE}/inventory/${inventoryItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          total_quantity: inventoryItem.total_quantity - materialNeeded,
        }),
      });

      setSubmittedOrder(orderData);
      setOrderCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // refresh inventory
      try {
        const updatedInventory = await fetch(`${API_BASE}/inventory`);
        const invData = await updatedInventory.json();
        setInventory(invData.items || []);
      } catch { }
    } catch (err) {
      alert(err.message || "Failed to submit order");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- Reset Form ---------------- */
  const resetForm = () => {
    setStep(1);
    setGender("");
    setDressType("");
    setFormData({});
    setShowInstructions({});
    setMaterial("");
    setColor("");
    setPattern("");
    setCollarType("");
    setSleeveType("");
    setButtonType("");
    setButtonColor("");
    setMeasurementUnit("cm");
    setMaterialNeeded(0);
    setMaterialPricePerMeter(0);
    setDeliveryAddress("");
    setExpectedDate("");
    setUseProfileAddress(false);
    setShowCollarInfo(false);
    setShowSleeveInfo(false);
    setOrderCompleted(false);
    setSubmittedOrder(null);
    setShowConfetti(false);
    setIsSubmitting(false);
    setPromoCode("");
    setPromoError("");
    setDiscount(0);
  };

  const stepTitles = useMemo(
    () => ["Gender", "Dress Type", "Style & Options", "Measurements", "Summary"],
    []
  );

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: {
        duration: 0.3
      }
    }
  };

  /* ---------------- Render ---------------- */
  if (orderCompleted && submittedOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <OrderCompleted
          showConfetti={showConfetti}
          submittedOrder={submittedOrder}
          resetForm={resetForm}
        />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-100/30 to-purple-100/30 rounded-full blur-2xl"></div>
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Create Your Perfect Garment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of tailoring with our smart design process. Every stitch crafted to perfection.
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-indigo-600">Step {step} of 5</span>
              <span className="text-sm font-medium text-gray-500">{Math.round((step/5) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step/5) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Step Indicator */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-8 py-6 border-b border-indigo-100/50">
            <StepIndicator step={step} titles={stepTitles} />
          </div>

          {/* Step Content */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Style</h2>
                      <p className="text-lg text-gray-600">Let's start by selecting the gender style for your garment</p>
                    </div>
                    <GenderSelection onSelect={handleGenderSelect} />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Select Garment Type</h2>
                      <p className="text-lg text-gray-600">Choose the type of {gender} garment you'd like to create</p>
                    </div>
                    <DressTypeSelection
                      gender={gender}
                      onBack={() => setStep(1)}
                      onSelect={handleDressTypeSelect}
                      measurementsData={measurementsData}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Style & Materials</h2>
                      <p className="text-lg text-gray-600">Customize your {dressType} with premium materials and styling options</p>
                    </div>
                    <StyleAndMaterialStep
                      gender={gender}
                      dressType={dressType}
                      measurementsData={measurementsData}
                      material={material}
                      setMaterial={setMaterial}
                      color={color}
                      setColor={setColor}
                      pattern={pattern}
                      setPattern={setPattern}
                      collarType={collarType}
                      setCollarType={setCollarType}
                      sleeveType={sleeveType}
                      setSleeveType={setSleeveType}
                      buttonType={buttonType}
                      setButtonType={setButtonType}
                      buttonColor={buttonColor}
                      setButtonColor={setButtonColor}
                      showCollarInfo={showCollarInfo}
                      setShowCollarInfo={setShowCollarInfo}
                      showSleeveInfo={showSleeveInfo}
                      setShowSleeveInfo={setShowSleeveInfo}
                      onBack={() => setStep(2)}
                      onNext={proceedFromStyleToMeasurements}
                    />
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Perfect Measurements</h2>
                      <p className="text-lg text-gray-600">Provide your measurements for a perfect fit</p>
                    </div>
                    <MeasurementsForm
                      gender={gender}
                      dressType={dressType}
                      measurementsData={measurementsData}
                      measurementUnit={measurementUnit}
                      setMeasurementUnit={setMeasurementUnit}
                      formData={formData}
                      setFormData={setFormData}
                      showInstructions={showInstructions}
                      toggleInstruction={toggleInstruction}
                      handleExtraChange={handleExtraChange}
                      materialNeeded={materialNeeded}
                      materialCosts={materialCosts}
                      material={material}
                      color={color}
                      materialPricePerMeter={materialPricePerMeter}
                      totalCost={totalCost}
                      currency={currency}
                      pattern={pattern}
                      setCurrency={setCurrency}
                      conversionRate={conversionRates[currency] || 1}
                      DELIVERY_CHARGE={DELIVERY_CHARGE}
                      LABOUR_CHARGE={LABOUR_CHARGE}
                      collarType={collarType}
                      sleeveType={sleeveType}
                      inventory={inventory}
                      buttonType={buttonType}
                      buttonColor={buttonColor}
                      INTERNET_HANDLING_FEES={INTERNET_HANDLING_FEES}
                      onBack={() => setStep(3)}
                      onSubmit={proceedToSummary}
                    />
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Summary</h2>
                      <p className="text-lg text-gray-600">Review your custom garment details and complete your order</p>
                    </div>
                    <OrderSummary
                      gender={gender}
                      dressType={dressType}
                      material={material}
                      color={color}
                      pattern={pattern}
                      measurementUnit={measurementUnit}
                      materialNeeded={materialNeeded}
                      materialPricePerMeter={materialPricePerMeter}
                      collarType={collarType}
                      sleeveType={sleeveType}
                      buttonType={buttonType}
                      buttonColor={buttonColor}
                      formData={formData}
                      measurementsData={measurementsData}
                      promoCode={promoCode}
                      setPromoCode={setPromoCode}
                      promoError={promoError}
                      discount={discount}
                      applyPromoCode={applyPromoCode}
                      removePromoCode={removePromoCode}
                      totalCost={totalCost}
                      userProfile={userProfile}
                      useProfileAddress={useProfileAddress}
                      setUseProfileAddress={setUseProfileAddress}
                      deliveryAddress={deliveryAddress}
                      setDeliveryAddress={setDeliveryAddress}
                      expectedDate={expectedDate}
                      setExpectedDate={setExpectedDate}
                      currency={currency}
                      setCurrency={setCurrency}
                      conversionRate={conversionRates[currency] || 1}
                      isSubmitting={isSubmitting}
                      onBack={() => setStep(4)}
                      onSubmit={handleFinalSubmit}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Progress */}
          <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 px-8 py-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Weave Nest • Smart Tailoring</span>
              <span>Secure & Encrypted Process 🔒</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          className="text-center mt-8 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm">
            Need help? Contact our support team at{" "}
            <span className="text-indigo-600 font-medium">support@weavenest.com</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
