// import React from "react";
// import { motion } from "framer-motion";

// // Sample images - replace with real images if available
// const sampleImages = {
//   shirt: "https://via.placeholder.com/150?text=Shirt",
//   pants: "https://via.placeholder.com/150?text=Pants",
//   dress: "https://via.placeholder.com/150?text=Dress"
// };

// export default function MeasurementGuide() {
//   const guides = [
//     {
//       type: "Shirt / Kurta",
//       image: sampleImages.shirt,
//       steps: [
//         "Neck: Measure around the base of the neck.",
//         "Chest: Measure around the fullest part of the chest.",
//         "Waist: Measure around the natural waistline.",
//         "Sleeve: Measure from shoulder to wrist.",
//         "Length: Measure from shoulder to desired shirt length."
//       ]
//     },
//     {
//       type: "Pants / Trousers",
//       image: sampleImages.pants,
//       steps: [
//         "Waist: Measure around your natural waistline.",
//         "Hip: Measure around the fullest part of the hips.",
//         "Inseam: Measure from crotch to ankle.",
//         "Length: Measure from waist to desired pant length."
//       ]
//     },
//     {
//       type: "Dress / Saree",
//       image: sampleImages.dress,
//       steps: [
//         "Bust: Measure around the fullest part of the bust.",
//         "Waist: Measure around natural waistline.",
//         "Hips: Measure around the fullest part of the hips.",
//         "Length: Measure from shoulder to desired dress length."
//       ]
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
//           How to Take Your Measurements
//         </h1>

//         <div className="grid md:grid-cols-3 gap-8">
//           {guides.map((guide) => (
//             <motion.div
//               key={guide.type}
//               className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               whileHover={{ scale: 1.05 }}
//             >
//               <img
//                 src={guide.image}
//                 alt={guide.type}
//                 className="w-32 h-32 object-cover rounded-full mb-6 border-4 border-blue-500"
//               />
//               <h2 className="text-2xl font-semibold mb-4 text-center">{guide.type}</h2>
//               <ol className="list-decimal list-inside text-gray-700 space-y-2">
//                 {guide.steps.map((step, idx) => (
//                   <li key={idx}>{step}</li>
//                 ))}
//               </ol>
//               <p className="mt-4 text-sm text-gray-400 text-center">
//                 Tip: Keep the measuring tape snug but not tight for accurate results.
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { motion } from "framer-motion";

// Sample images - replace with real images if available
const sampleImages = {
  shirt: "https://via.placeholder.com/150?text=Shirt",
  pants: "https://via.placeholder.com/150?text=Pants",
  dress: "https://via.placeholder.com/150?text=Dress"
};

export default function MeasurementGuide() {
  const guides = [
    {
      type: "Shirt / Kurta",
      image: sampleImages.shirt,
      steps: [
        "Neck: Measure around the base of the neck.",
        "Chest: Measure around the fullest part of the chest.",
        "Waist: Measure around the natural waistline.",
        "Sleeve: Measure from shoulder to wrist.",
        "Length: Measure from shoulder to desired shirt length."
      ]
    },
    {
      type: "Pants / Trousers",
      image: sampleImages.pants,
      steps: [
        "Waist: Measure around your natural waistline.",
        "Hip: Measure around the fullest part of the hips.",
        "Inseam: Measure from crotch to ankle.",
        "Length: Measure from waist to desired pant length."
      ]
    },
    {
      type: "Dress / Saree",
      image: sampleImages.dress,
      steps: [
        "Bust: Measure around the fullest part of the bust.",
        "Waist: Measure around natural waistline.",
        "Hips: Measure around the fullest part of the hips.",
        "Length: Measure from shoulder to desired dress length."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          How to Take Your Measurements
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <motion.div
              key={guide.type}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={guide.image}
                alt={guide.type}
                className="w-32 h-32 object-cover rounded-full mb-6 border-4 border-blue-500"
              />
              <h2 className="text-2xl font-semibold mb-4 text-center">{guide.type}</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                {guide.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-gray-400 text-center">
                Tip: Keep the measuring tape snug but not tight for accurate results.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
