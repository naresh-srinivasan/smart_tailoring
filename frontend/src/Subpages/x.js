import React, { useState } from "react";
import { FaUser, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function MeasurementProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    height: "",
    chest: "",
    waist: "",
    hips: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProfile = () => {
    if (!formData.name) return alert("Name is required!");
    setProfiles([...profiles, { ...formData, id: Date.now() }]);
    setFormData({ name: "", gender: "", height: "", chest: "", waist: "", hips: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Measurement Profiles</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus /> Add Profile
        </button>
      </div>

      {/* Profiles Grid */}
      {profiles.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <FaUser className="text-blue-600 w-6 h-6" />
                <h3 className="font-semibold text-lg">{profile.name}</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><b>Gender:</b> {profile.gender}</p>
                <p><b>Height:</b> {profile.height} cm</p>
                <p><b>Chest:</b> {profile.chest} cm</p>
                <p><b>Waist:</b> {profile.waist} cm</p>
                <p><b>Hips:</b> {profile.hips} cm</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 flex-1 flex items-center justify-center gap-1">
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex-1 flex items-center justify-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No profiles yet. Add one to get started.</p>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Measurement Profile</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Profile Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                name="chest"
                placeholder="Chest (cm)"
                value={formData.chest}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                name="waist"
                placeholder="Waist (cm)"
                value={formData.waist}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                name="hips"
                placeholder="Hips (cm)"
                value={formData.hips}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
