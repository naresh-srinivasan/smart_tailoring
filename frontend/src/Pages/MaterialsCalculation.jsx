export const calculateMaterialNeeded = (dressType, measurements, unit = "cm") => {
  let total = 0;

  const getValue = (key) => {
    let val = parseFloat(measurements[key] || 0);
    if (unit === "inches") val *= 2.54; // convert inches → cm
    return val;
  };

  switch (dressType) {
    case "Shirt":
      const shirtLength = getValue("Shirt Length");
      const sleeve = getValue("Sleeve Length");
      const shoulder = getValue("Shoulder");
      const waist = getValue("Waist");
      const neck = getValue("Neck");
      const chest = getValue("Chest");

      // realistic estimate: front+back + sleeves + extra allowance
      total = shirtLength * 2 + sleeve * 2 + shoulder + chest + waist + neck + 20;
      break;

    case "Pant":
      const waistP = getValue("Waist");
      const inseam = getValue("Inseam");
      total = waistP + inseam + 20;
      break;

    case "Kurta":
      const kurtaLength = getValue("Kurta Length");
      const kurtaSleeve = getValue("Sleeve Length");
      const bust = getValue("Bust");
      total = kurtaLength + kurtaSleeve + bust + 20;
      break;

    case "Lehenga":
      const lehengaLength = getValue("Lehenga Length");
      const lehengaWaist = getValue("Waist");
      total = lehengaLength + lehengaWaist + 20;
      break;

    default:
      total = 0;
  }

  return (total / 100).toFixed(2); // cm → meters
};

export default calculateMaterialNeeded;