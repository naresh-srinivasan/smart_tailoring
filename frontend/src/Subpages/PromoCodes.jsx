// src/Subpages/PromoCodes.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

export default function AdminPromoPage() {
  const { user } = useAuth();
  const token = user?.token;

  const [promoList, setPromoList] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: "",
    expiryDate: "",
    usageLimit: "",
  });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingPromo, setEditingPromo] = useState(null);

  // Fetch all promo codes
  const fetchPromos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/promo/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromoList(res.data.promos || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load promo codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromos(); }, [token]);

  // Auto-clear messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(""); setError(""); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPromo(prev => ({ ...prev, [name]: value }));
  };

  // Add promo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!formData.code || !formData.discountPercent) {
      setError("Promo code and discount are required.");
      return;
    }

    try {
      setFormLoading(true);
      const payload = {
        code: formData.code,
        discountPercentage: Number(formData.discountPercent),
        validFrom: new Date(),
        validTo: formData.expiryDate ? new Date(formData.expiryDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      };
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/promo/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Promo code added successfully!");
      setFormData({ code: "", discountPercent: "", expiryDate: "", usageLimit: "" });
      fetchPromos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add promo code.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete promo
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/promo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromoList(prev => prev.filter(p => p.id !== id));
      setSuccess("Promo code deleted successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete promo code.");
    }
  };

  // Edit promo
  const handleEdit = (promo) => {
    setEditingPromo({
      ...promo,
      expiryDate: promo.validTo ? new Date(promo.validTo).toISOString().slice(0, 10) : "",
    });
  };

  const handleUpdate = async () => {
    if (!editingPromo.code || !editingPromo.discountPercentage) {
      setError("Promo code and discount are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/promo/${editingPromo.id}`, {
        code: editingPromo.code,
        discountPercentage: Number(editingPromo.discountPercentage),
        validTo: editingPromo.expiryDate ? new Date(editingPromo.expiryDate) : null,
        usageLimit: editingPromo.usageLimit ? Number(editingPromo.usageLimit) : null,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setPromoList(prev => prev.map(p => p.id === editingPromo.id ? editingPromo : p));
      setEditingPromo(null);
      setSuccess("Promo updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update promo code.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Promo Codes</h1>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow space-y-4">
        {error && <p className="text-red-500 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Promo Code" className="border p-2 rounded" required />
          <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} placeholder="Discount %" className="border p-2 rounded" required />
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="border p-2 rounded" />
          <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="Usage Limit" className="border p-2 rounded" />
          <button type="submit" disabled={formLoading} className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${formLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {formLoading ? "Adding..." : "Add Promo"}
          </button>
        </div>
      </form>

      {/* Promo Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border text-left">Code</th>
              <th className="p-3 border text-left">Discount %</th>
              <th className="p-3 border text-left">Valid To</th>
              <th className="p-3 border text-left">Usage Limit</th>
              <th className="p-3 border text-left">Used Count</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>
            ) : promoList.length ? (
              promoList.map(promo => (
                <tr key={promo.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border">{promo.code || "-"}</td>
                  <td className="p-3 border">{promo.discountPercentage || 0}</td>
                  <td className="p-3 border">{promo.validTo ? new Date(promo.validTo).toLocaleDateString() : "-"}</td>
                  <td className="p-3 border">{promo.usageLimit ?? "Unlimited"}</td>
                  <td className="p-3 border">{promo.usedCount || 0}</td>
                  <td className="p-3 border flex gap-2">
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={() => handleEdit(promo)}>Edit</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(promo.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center p-4">No promo codes found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Edit Promo Code</h3>

            <input type="text" name="code" value={editingPromo.code} onChange={handleEditChange} placeholder="Promo Code" className="w-full border p-2 rounded" />
            <input type="number" name="discountPercentage" value={editingPromo.discountPercentage} onChange={handleEditChange} placeholder="Discount %" className="w-full border p-2 rounded" />
            <input type="date" name="expiryDate" value={editingPromo.expiryDate || ""} onChange={handleEditChange} className="w-full border p-2 rounded" />
            <input type="number" name="usageLimit" value={editingPromo.usageLimit ?? ""} onChange={handleEditChange} placeholder="Usage Limit" className="w-full border p-2 rounded" />

            <div className="flex justify-end gap-3 mt-2">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setEditingPromo(null)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
