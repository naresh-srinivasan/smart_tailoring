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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                  Promo Code Management
                </h1>
                <p className="text-slate-600 text-lg">Create and manage promotional discount codes</p>
              </div>
              <div className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-[#286fad] to-[#3a7bc0] p-4 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-white font-semibold text-lg">Total: {promoList.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800 font-medium">{success}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Promo Form */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#286fad] to-[#3a7bc0] px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Promo Code
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Promo Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter code"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#286fad] focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Discount % *</label>
                  <input
                    type="number"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleChange}
                    placeholder="0-100"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#286fad] focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#286fad] focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#286fad] focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className={`w-full px-6 py-3 bg-gradient-to-r from-[#d6ba73] to-[#e6ca83] text-slate-800 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-[#d6ba73]/30 ${formLoading ? "opacity-50 cursor-not-allowed hover:scale-100" : "hover:from-[#e6ca83] hover:to-[#f0d493]"}`}
                  >
                    {formLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </div>
                    ) : (
                      "Add Promo"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Promo Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#286fad] to-[#3a7bc0] px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Active Promo Codes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Valid Until</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Usage Limit</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Used Count</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="animate-spin w-8 h-8 text-[#286fad] mb-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-slate-600 text-lg">Loading promo codes...</span>
                      </div>
                    </td>
                  </tr>
                ) : promoList.length ? (
                  promoList.map((promo, index) => (
                    <tr key={promo.id} className={`hover:bg-slate-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#286fad]/10 text-[#286fad] border border-[#286fad]/20">
                          {promo.code || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-900 font-semibold text-lg">{promo.discountPercentage || 0}%</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {promo.validTo ? new Date(promo.validTo).toLocaleDateString() : "No expiry"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {promo.usageLimit ?? "Unlimited"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                          {promo.usedCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-[#d6ba73] bg-[#d6ba73]/10 border border-[#d6ba73]/20 rounded-lg hover:bg-[#d6ba73]/20 hover:border-[#d6ba73]/30 transition-all duration-200 focus:ring-2 focus:ring-[#d6ba73]/30"
                            onClick={() => handleEdit(promo)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:ring-2 focus:ring-red-300"
                            onClick={() => handleDelete(promo.id)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <h3 className="text-lg font-medium text-slate-600 mb-2">No promo codes found</h3>
                        <p className="text-slate-500">Create your first promo code using the form above.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingPromo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#286fad] to-[#3a7bc0] px-6 py-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Promo Code
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Promo Code</label>
                  <input
                    type="text"
                    name="code"
                    value={editingPromo.code}
                    onChange={handleEditChange}
                    placeholder="Promo Code"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#286fad] focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Discount Percentage</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={editingPromo.discountPercentage}
                    onChange={handleEditChange}
                    placeholder="Discount %"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#286fad] focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={editingPromo.expiryDate || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#286fad] focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={editingPromo.usageLimit ?? ""}
                    onChange={handleEditChange}
                    placeholder="Usage Limit"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#286fad] focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    className="px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium"
                    onClick={() => setEditingPromo(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-[#d6ba73] to-[#e6ca83] text-slate-800 rounded-xl hover:from-[#e6ca83] hover:to-[#f0d493] transition-all duration-200 transform hover:scale-105 font-semibold focus:ring-4 focus:ring-[#d6ba73]/30"
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
