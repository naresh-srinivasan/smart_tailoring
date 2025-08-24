// import React from "react";
// import { useActivePage } from "../Components/ActivePage";


// export default function ProfilePage() {
//   const {setActivePage} = useActivePage();
//   const options = [
//     {
//       title: "Dashboard / Home",
//       description: "Overview of orders, promotions, notifications",
//       page: "home",
//     },
//     {
//       title: "Profile",
//       description: "View and edit personal info, measurements, preferences",
//       page: "profile",
//     },
//     {
//       title: "Measurement Guide",
//       description: "Help customers measure themselves correctly",
//       page: "measurement-guide",
//     },
//     {
//       title: "Place New Order",
//       description: "Select fabric, style, measurements, customization options",
//       page: "place-order",
//     },
//     {
//       title: "Order Tracking",
//       description: "Track status of current orders (cutting, stitching, delivery)",
//       page: "order-tracking",
//     },
//     {
//       title: "Order History",
//       description: "List of past orders with details and feedback options",
//       page: "order-history",
//     },
//     {
//       title: "Support / Contact Us",
//       description: "Customer support chat, FAQs, or ticket system",
//       page: "contact",
//     },
//   ];

//   const handleOptionClick = (page) => {
//     setActivePage("dashboard");
//   };

//   return (
//     <div className="min-h-[90vh] bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-10 px-6">
//       <div className="max-w-6xl w-full">
//         <h1
//           className="text-5xl font-extrabold text-[#286fad] mb-10 text-center drop-shadow-md"
//           style={{ fontFamily: "'Dancing Script', cursive" }}
//         >
//           Customer Profile
//         </h1>

//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//           {options.map(({ title, description, page }) => (
//             <div
//               key={page}
//               onClick={handleOptionClick}
//               className="cursor-pointer group border border-[#d6ba73] rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex flex-col justify-between"
//             >
//               <h2 className="text-2xl font-semibold text-[#286fad] group-hover:text-white transition">
//                 {title}
//               </h2>
//               <p className="mt-3 text-gray-600 text-sm group-hover:text-white transition">
//                 {description}
//               </p>
//               <div className="mt-5">
//                 <span className="inline-block px-4 py-2 text-sm font-medium text-[#286fad] group-hover:text-white border border-[#286fad] group-hover:border-white rounded-full transition">
//                   Go →
//                 </span>
//               </div>
//               {/* Hover overlay color */}
//               <div className="absolute inset-0 rounded-2xl bg-[#d6ba73] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
