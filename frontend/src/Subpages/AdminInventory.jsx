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
    total_quantity: "",
  });

  const [filters, setFilters] = useState({
    material_name: "",
    color: "",
    material_type: "",
  });

  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Apply filters whenever filters or inventory changes
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
    setFilters({ material_name: "", color: "", material_type: "" });
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingItem(null);
    setForm({
      material_name: "",
      color: "",
      material_type: "",
      price: "",
      total_quantity: "",
    });
  };

  const handleEditClick = (item) => {
    if (!item?.id) return alert("Cannot edit item: invalid ID");
    setEditingItem(item);
    setForm({
      material_name: item.material_name || "",
      color: item.color || "",
      material_type: item.material_type || "",
      price: item.price || "",
      total_quantity: item.total_quantity || "",
    });
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/inventory/${editingItem.id}`, form);
      } else {
        await axios.post("http://localhost:5000/api/inventory", form);
      }
      setForm({
        material_name: "",
        color: "",
        material_type: "",
        price: "",
        total_quantity: "",
      });
      setEditingItem(null);
      setShowAddForm(false);
      fetchInventory();
    } catch (err) {
      console.error("Error saving item:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return alert("Invalid ID");
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

      {/* Filters + Add button */}
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
        <button
          type="button"
          onClick={handleAddClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Add Item
        </button>
      </div>

      {/* Add / Edit Form */}
      {(showAddForm || editingItem) && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 bg-white p-6 rounded-lg shadow-md"
        >
          <input
            name="material_name"
            placeholder="Material Name"
            value={form.material_name}
            onChange={(e) => setForm({ ...form, material_name: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="material_type"
            placeholder="Material Type"
            value={form.material_type}
            onChange={(e) => setForm({ ...form, material_type: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="price"
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="total_quantity"
            type="number"
            placeholder="Quantity"
            value={form.total_quantity}
            onChange={(e) => setForm({ ...form, total_quantity: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="col-span-1 sm:col-span-2 lg:col-span-5 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {submitting ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
          </button>
        </form>
      )}

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Material Name</th>
              <th className="px-6 py-3 text-left">Color</th>
              <th className="px-6 py-3 text-left">Material Type</th>
              <th className="px-6 py-3 text-right">Price (₹)</th>
              <th className="px-6 py-3 text-right">Quantity</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length ? (
              filteredInventory.map((item, idx) => (
                <tr key={item.id || idx} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{item.material_name}</td>
                  <td className="px-6 py-4">{item.color}</td>
                  <td className="px-6 py-4">{item.material_type}</td>
                  <td className="px-6 py-4 text-right">₹{Number(item.price || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">{item.total_quantity}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
