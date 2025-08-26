import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

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

  /* ---------------- Render ---------------- */
  if (orderCompleted && submittedOrder) {
    return (
      <OrderCompleted
        showConfetti={showConfetti}
        submittedOrder={submittedOrder}
        resetForm={resetForm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <motion.div
        className="max-w-6xl mx-auto bg-white rounded-3xl p-10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Book Now
        </h1>

        <StepIndicator step={step} titles={stepTitles} />

        {step === 1 && <GenderSelection onSelect={handleGenderSelect} />}

        {step === 2 && (
          <DressTypeSelection
            gender={gender}
            onBack={() => setStep(1)}
            onSelect={handleDressTypeSelect}
            measurementsData={measurementsData}
          />
        )}

        {step === 3 && (
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
        )}

        {step === 4 && (
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
            buttonType={buttonType}
            buttonColor={buttonColor}
            INTERNET_HANDLING_FEES={INTERNET_HANDLING_FEES}
            onBack={() => setStep(3)}
            onSubmit={proceedToSummary}
          />
        )}

        {step === 5 && (
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
        )}
      </motion.div>
    </div>
  );
}
