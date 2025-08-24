import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const perPage = 5;

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data.customers || res.data);
      } catch (err) {
        setError("Failed to fetch customers.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Open edit modal
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
  };

  // Open add modal
  const handleAdd = () => {
    setAddingCustomer(true);
    setFormData({ name: "", email: "", phone: "" });
  };

  // Close modal
  const handleCancel = () => {
    setEditingCustomer(null);
    setAddingCustomer(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  // Save edited customer
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/${editingCustomer.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...formData } : c
        )
      );
      handleCancel();
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer.");
    }
  };

  // Add new customer
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/admin",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomers((prev) => [...prev, res.data]);
      handleCancel();
    } catch (err) {
      console.error("Error creating customer:", err);
      alert("Failed to add customer.");
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Failed to delete customer.");
    }
  };

  // Filter and sort
  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredCustomers.length / perPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 relative">
      <h3 className="text-2xl font-bold mb-4 text-blue-600">Customers List</h3>

      {/* Search + Add */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Add Customer
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Loading */}
      {loading ? (
        <p className="text-center py-4">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                {["name", "email", "phone"].map((field) => (
                  <th
                    key={field}
                    className="py-2 px-4 text-left font-medium cursor-pointer"
                    onClick={() => handleSort(field)}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field
                      ? sortOrder === "asc"
                        ? " ▲"
                        : " ▼"
                      : ""}
                  </th>
                ))}
                <th className="py-2 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">{customer.name}</td>
                  <td className="py-2 px-4">{customer.email}</td>
                  <td className="py-2 px-4">{customer.phone}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(editingCustomer || addingCustomer) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {addingCustomer ? "Add Customer" : "Edit Customer"}
            </h2>

            <label className="block mb-2 text-sm">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded w-full px-3 py-2 mb-3"
            />

            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border rounded w-full px-3 py-2 mb-3"
            />

            <label className="block mb-2 text-sm">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="border rounded w-full px-3 py-2 mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={addingCustomer ? handleCreate : handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {addingCustomer ? "Create" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
