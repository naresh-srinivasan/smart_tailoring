// src/pages/MeasurementGuide.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const API_BASE = "http://localhost:5000/api/measurements";

// Measurement configurations based on your JSON - combined all measurements per gender
const measurementConfig = {
  Men: [
    // From Shirt measurements
    {name: "Neck", placeholder: "Enter neck size in inches", instruction: "Measure around the base of the neck comfortably."},
    {name: "Shoulder", placeholder: "Enter shoulder width in inches", instruction: "Measure from one shoulder edge to the other across the back."},
    {name: "Chest", placeholder: "Enter chest size in inches", instruction: "Measure around the fullest part of the chest."},
    {name: "Waist", placeholder: "Enter waist size in inches", instruction: "Measure around the natural waistline."},
    {name: "Sleeve Length", placeholder: "Enter sleeve length in inches", instruction: "Measure from shoulder seam to wrist."},
    {name: "Shirt Length", placeholder: "Enter shirt length in inches", instruction: "Measure from shoulder seam to desired shirt bottom."},
    // From Pant measurements
    {name: "Hip", placeholder: "Enter hip size in inches", instruction: "Measure around the fullest part of the hips."},
    {name: "Inseam", placeholder: "Enter inseam length in inches", instruction: "Measure from crotch to bottom of ankle."},
    {name: "Outseam", placeholder: "Enter outseam length in inches", instruction: "Measure from waistband to bottom of pant."}
  ],
  Women: [
    // From Kurta measurements
    {name: "Shoulder", placeholder: "Enter shoulder width in inches", instruction: "Measure from one shoulder edge to the other."},
    {name: "Bust", placeholder: "Enter bust size in inches", instruction: "Measure around the fullest part of the bust."},
    {name: "Waist", placeholder: "Enter waist size in inches", instruction: "Measure around natural waistline."},
    {name: "Hip", placeholder: "Enter hip size in inches", instruction: "Measure around the fullest part of the hips."},
    {name: "Kurta Length", placeholder: "Enter desired kurta length", instruction: "Measure from shoulder seam to desired kurta bottom."},
    {name: "Sleeve Length", placeholder: "Enter sleeve length in inches", instruction: "Measure from shoulder seam to wrist."},
    // From Lehenga measurements  
    {name: "Lehenga Length", placeholder: "Enter lehenga length", instruction: "Measure from waist to desired hemline."}
  ]
};

export default function MeasurementGuide() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    person_name: "",
    gender: "",
    data: {},
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState({});

  // Create axios instance with auth token
  const createAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Get measurements for selected gender
  const getCurrentMeasurements = () => {
    if (!form.gender || !measurementConfig[form.gender]) {
      return [];
    }
    return measurementConfig[form.gender];
  };

  // Fetch profiles on load
  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  // Reset measurements when gender changes
  useEffect(() => {
    if (form.gender) {
      setForm(prev => ({
        ...prev,
        data: {}
      }));
    }
  }, [form.gender]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(API_BASE, createAuthHeaders());
      setProfiles(res.data);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError("Failed to fetch measurement profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.person_name || !form.gender) {
      setError("Please fill in person name and gender");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, form, createAuthHeaders());
      } else {
        await axios.post(API_BASE, form, createAuthHeaders());
      }
      
      setForm({ person_name: "", gender: "", data: {} });
      setEditingId(null);
      setShowInstructions({});
      await fetchProfiles();
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save measurement profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile) => {
    setForm({
      person_name: profile.person_name || "",
      gender: profile.gender,
      data: profile.data || {},
    });
    setEditingId(profile.id);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await axios.delete(`${API_BASE}/${id}`, createAuthHeaders());
      await fetchProfiles();
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError("Failed to delete measurement profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ person_name: "", gender: "", data: {} });
    setEditingId(null);
    setError("");
    setShowInstructions({});
  };

  const handleMeasurementChange = (measurementName, value) => {
    setForm({
      ...form,
      data: { ...form.data, [measurementName.toLowerCase().replace(/\s+/g, '_')]: value },
    });
  };

  const toggleInstructions = (measurementName) => {
    setShowInstructions(prev => ({
      ...prev,
      [measurementName]: !prev[measurementName]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Please log in to access measurement profiles
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Measurement Profiles
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Profile Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Profile" : "Add New Profile"}
          </h2>

          {/* Person Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Person Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter person's name"
              value={form.person_name}
              onChange={(e) => setForm({ ...form, person_name: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Gender Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>

          {/* Dress Type Selection */}
          {/* Removed - No longer needed */}

          {/* Dynamic Measurement Fields */}
          {form.gender && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">
                Measurements for {form.gender}
              </h3>
              
              {getCurrentMeasurements().map((measurement) => {
                const fieldName = measurement.name.toLowerCase().replace(/\s+/g, '_');
                return (
                  <div key={measurement.name} className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium">
                        {measurement.name} (inches)
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleInstructions(measurement.name)}
                        className="text-blue-500 text-sm hover:text-blue-700"
                      >
                        {showInstructions[measurement.name] ? 'Hide' : 'Show'} Guide
                      </button>
                    </div>
                    
                    {showInstructions[measurement.name] && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm text-blue-800">
                        📏 {measurement.instruction}
                      </div>
                    )}
                    
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={measurement.placeholder}
                      value={form.data[fieldName] || ""}
                      onChange={(e) => handleMeasurementChange(measurement.name, e.target.value)}
                      disabled={loading}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={loading || !form.person_name || !form.gender}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : editingId ? "Update Profile" : "Save Profile"}
            </button>
            {editingId && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profiles List */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Saved Profiles</h2>

          {loading && profiles.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No profiles saved yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Create your first measurement profile using the form
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 ${
                    editingId === profile.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {profile.person_name || "Unnamed Person"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {profile.gender}
                      </p>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        {profile.data && Object.keys(profile.data).length > 0 ? (
                          Object.entries(profile.data)
                            .filter(([key, value]) => value && value.trim() !== "")
                            .map(([key, value]) => (
                              <p key={key}>
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value}"
                              </p>
                            ))
                        ) : (
                          <p className="text-gray-400 italic">
                            No measurements recorded
                          </p>
                        )}
                      </div>
                      
                      {profile.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(profile)}
                        disabled={loading}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 disabled:bg-gray-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        disabled={loading}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}