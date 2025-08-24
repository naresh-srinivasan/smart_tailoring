// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminInventory() {
//   const [inventory, setInventory] = useState([]);
//   const [filteredInventory, setFilteredInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({
//     material_name: "",
//     color: "",
//     total_quantity: "",
//     price: "",
//     pattern: "",
//     material_type: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [filters, setFilters] = useState({
//     material: "",
//     color: "",
//     priceRange: "",
//     qtyRange: "",
//     pattern: "",
//     material_type: "",
//   });

//   // -------------------- Fetch inventory from API --------------------
//   const fetchInventory = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/inventory");
//       setInventory(res.data.items);
//       setFilteredInventory(res.data.items);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   // -------------------- Handle Form --------------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = {
//         material_name: form.material_name,
//         color: form.color,
//         total_quantity: Number(form.total_quantity),
//         price: Number(form.price),
//         pattern: form.pattern,
//         material_type: form.material_type,
//       };

//       if (editingId) {
//         await axios.put(`http://localhost:5000/api/inventory/${editingId}`, payload);
//       } else {
//         await axios.post("http://localhost:5000/api/inventory", payload);
//       }

//       setForm({ material_name: "", color: "", total_quantity: "", price: "", pattern: "", material_type: "" });
//       setEditingId(null);
//       fetchInventory();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setForm({
//       material_name: item.material_name,
//       color: item.color,
//       total_quantity: item.total_quantity,
//       price: item.price,
//       pattern: item.pattern,
//       material_type: item.material_type,
//     });
//     setEditingId(item.id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this material?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/inventory/${id}`);
//       fetchInventory();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // -------------------- Filters --------------------
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({ material: "", color: "", priceRange: "", qtyRange: "", pattern: "", material_type: "" });
//   };

//   useEffect(() => {
//     let filtered = [...inventory];

//     if (filters.material)
//       filtered = filtered.filter((item) =>
//         item.material_name.toLowerCase().includes(filters.material.toLowerCase())
//       );
//     if (filters.color)
//       filtered = filtered.filter((item) =>
//         item.color.toLowerCase().includes(filters.color.toLowerCase())
//       );
//     if (filters.pattern)
//       filtered = filtered.filter((item) =>
//         item.pattern.toLowerCase().includes(filters.pattern.toLowerCase())
//       );
//     if (filters.material_type)
//       filtered = filtered.filter((item) =>
//         item.material_type.toLowerCase().includes(filters.material_type.toLowerCase())
//       );

//     if (filters.priceRange) {
//       if (filters.priceRange === "lt50") filtered = filtered.filter((i) => i.price < 50);
//       if (filters.priceRange === "50to100")
//         filtered = filtered.filter((i) => i.price >= 50 && i.price <= 100);
//       if (filters.priceRange === "gt100") filtered = filtered.filter((i) => i.price > 100);
//     }

//     if (filters.qtyRange) {
//       if (filters.qtyRange === "lt10") filtered = filtered.filter((i) => i.total_quantity < 10);
//       if (filters.qtyRange === "10to50")
//         filtered = filtered.filter((i) => i.total_quantity >= 10 && i.total_quantity <= 50);
//       if (filters.qtyRange === "gt50") filtered = filtered.filter((i) => i.total_quantity > 50);
//     }

//     setFilteredInventory(filtered);
//   }, [filters, inventory]);

//   // -------------------- JSX --------------------
//   return (
//     <div className="bg-gray-50 min-h-screen p-8">
//       <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">
//         <h2 className="text-3xl font-bold mb-6 text-blue-700">Inventory Management</h2>

//         {/* ---------- Form ---------- */}
//         <form
//           onSubmit={handleSubmit}
//           className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
//         >
//           <input
//             name="material_name"
//             placeholder="Material Name"
//             value={form.material_name}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             name="color"
//             placeholder="Color (Hex or Name)"
//             value={form.color}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             name="total_quantity"
//             type="number"
//             placeholder="Quantity"
//             value={form.total_quantity}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             name="price"
//             type="number"
//             placeholder="Price / m"
//             value={form.price}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             name="pattern"
//             placeholder="Pattern"
//             value={form.pattern}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             name="Material Type"
//             placeholder="Material Type"
//             value={form.material_type}
//             onChange={handleChange}
//             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             type="submit"
//             disabled={submitting}
//             className="col-span-1 md:col-span-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
//           >
//             {submitting ? "Saving..." : editingId ? "Update Material" : "Add Material"}
//           </button>
//         </form>

//         {/* ---------- Filters ---------- */}
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
//           <input
//             placeholder="Material"
//             name="material"
//             value={filters.material}
//             onChange={handleFilterChange}
//             className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             placeholder="Color"
//             name="color"
//             value={filters.color}
//             onChange={handleFilterChange}
//             className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             placeholder="Pattern"
//             name="pattern"
//             value={filters.pattern}
//             onChange={handleFilterChange}
//             className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             placeholder="Material"
//             name="Material Type"
//             value={filters.material_type}
//             onChange={handleFilterChange}
//             className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <select
//             name="priceRange"
//             value={filters.priceRange}
//             onChange={handleFilterChange}
//             className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             <option value="">All Prices</option>
//             <option value="lt50">Below ₹50</option>
//             <option value="50to100">₹50 – ₹100</option>
//             <option value="gt100">Above ₹100</option>
//           </select>
//           <select
//             name="qtyRange"
//             value={filters.qtyRange}
//             onChange={handleFilterChange}
//             className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             <option value="">All Quantities</option>
//             <option value="lt10">Below 10</option>
//             <option value="10to50">10 – 50</option>
//             <option value="gt50">Above 50</option>
//           </select>
//           <button
//             onClick={resetFilters}
//             type="button"
//             className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-all"
//           >
//             Reset Filters
//           </button>
//         </div>

//         {/* ---------- Inventory Table ---------- */}
//         {loading ? (
//           <p className="text-gray-500 text-center py-6">Loading inventory...</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow">
//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-sm font-medium">S.No</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium">Material</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium">Color</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium">Pattern</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium">Material Type</th>
//                   <th className="px-6 py-3 text-right text-sm font-medium">Quantity</th>
//                   <th className="px-6 py-3 text-right text-sm font-medium">Price/m</th>
//                   <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredInventory.map((item, index) => (
//                   <tr key={item.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">{index + 1}</td>
//                     <td className="px-6 py-4">{item.material_name}</td>
//                     <td className="px-6 py-4">{item.color}</td>
//                     <td className="px-6 py-4">{item.pattern}</td>
//                     <td className="px-6 py-4">{item.material_type}</td>
//                     <td className="px-6 py-4 text-right">{item.total_quantity}</td>
//                     <td className="px-6 py-4 text-right">₹{item.price.toFixed(2)}</td>
//                     <td className="px-6 py-4 text-center space-x-2">
//                       <button
//                         onClick={() => handleEdit(item)}
//                         className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition-all"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item.id)}
//                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {!filteredInventory.length && (
//                   <tr>
//                     <td colSpan={8} className="text-center py-4 text-gray-500">
//                       No materials found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/Subpages/AdminInventory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    material_name: "",
    color: "",
    material_type: "",
    price: "",
  });
  const [filters, setFilters] = useState({
    material_name: "",
    color: "",
    material_type: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, inventory]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/inventory");
      const data = res.data?.items || res.data || [];
      setInventory(Array.isArray(data) ? data : []);
      setFilteredInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setInventory([]);
      setFilteredInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    let filtered = [...inventory];
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filtered = filtered.filter((item) =>
          item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });
    setFilteredInventory(filtered);
  };

  const resetFilters = () => {
    setFilters({ material_name: "", color: " ", material_type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/inventory/${editingId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/inventory", form);
      }
      setForm({ material_name: "", color: "", material_type: "", price: "" });
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      console.error("Error saving item:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      material_name: item.material_name || "",
      color: item.color || "",
      material_type: item.material_type || "",
      price: item.price || "",
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading inventory...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Inventory Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <input
          placeholder="Material Name"
          name="material_name"
          value={filters.material_name}
          onChange={handleFilterChange}
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Color"
          name="color"
          value={filters.color}
          onChange={handleFilterChange}
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Material Type"
          name="material_type"
          value={filters.material_type}
          onChange={handleFilterChange}
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={resetFilters}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 bg-white p-6 rounded-lg shadow-md"
      >
        <input
          name="material_name"
          placeholder="Material Name"
          value={form.material_name}
          onChange={handleChange}
          required
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="color"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
          required
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="material_type"
          placeholder="Material Type"
          value={form.material_type}
          onChange={handleChange}
          required
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={submitting}
          className="col-span-1 sm:col-span-2 lg:col-span-5 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {submitting ? "Saving..." : editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Material Name</th>
              <th className="px-6 py-3 text-left">Color</th>
              <th className="px-6 py-3 text-left">Material Type</th>
              <th className="px-6 py-3 text-right">Price (₹)</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length ? (
              filteredInventory.map((item, idx) => (
                <tr key={item._id || idx} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{item.material_name}</td>
                  <td className="px-6 py-4">{item.color}</td>
                  <td className="px-6 py-4">{item.material_type}</td>
                  <td className="px-6 py-4 text-right">₹{Number(item.price || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
