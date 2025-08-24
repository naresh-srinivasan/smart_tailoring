import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFilePdf,
  FaCommentDots,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaUser,
} from "react-icons/fa";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    feedback: null,
  });
  const [customerModal, setCustomerModal] = useState({ open: false });
  const [customerinfo, setCustomerinfo] = useState({});

  const statusOptions = [
    "Pending",
    "Order Accepted",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "Order Accepted": "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    "Out for Delivery": "bg-orange-100 text-orange-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    Pending: <FaClock className="inline mr-1" />,
    "Order Accepted": <FaCheckCircle className="inline mr-1" />,
    Shipped: <FaTruck className="inline mr-1" />,
    "Out for Delivery": <FaBoxOpen className="inline mr-1" />,
    Delivered: <FaCheckCircle className="inline mr-1" />,
    Cancelled: <FaTimesCircle className="inline mr-1" />,
  };

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDress, setFilterDress] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedOrders = res.data.orders.sort((a, b) => a.id - b.id);
      const ordersWithNumber = sortedOrders.map((o, idx) => ({
        ...o,
        fixedOrderNumber: idx + 1,
        feedback: o.feedback_text
          ? { text: o.feedback_text, rating: o.feedback_rating }
          : null,
        inputOtp: "", // Initialize OTP input field
      }));

      setOrders(ordersWithNumber);
      setFilteredOrders(ordersWithNumber);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleCustomerClick = (order) => {
    setCustomerModal({ open: true });
    setCustomerinfo(order);
  };

  const updateStatus = async (orderId, newStatus, otp = null) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOrder = res.data.order;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, ...updatedOrder, User: o.User, feedback: o.feedback, inputOtp: "" }
            : o
        )
      );

      setFilteredOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, ...updatedOrder, User: o.User, feedback: o.feedback, inputOtp: "" }
            : o
        )
      );

      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    // For non-delivered status, update immediately
    if (newStatus !== "Delivered") {
      updateStatus(orderId, newStatus);
    } else {
      // For delivered status, just update the local state to show the OTP field
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
      setFilteredOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    }
  };

  const handleOtpChange = (orderId, otp) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, inputOtp: otp } : o
      )
    );
    setFilteredOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, inputOtp: otp } : o
      )
    );
  };

  const applyFiltersAndSort = () => {
    let temp = [...orders];

    if (filterStatus) temp = temp.filter((o) => o.status === filterStatus);
    if (filterDress) temp = temp.filter((o) => o.items?.dress_type === filterDress);

    if (sortOption === "dateAsc")
      temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortOption === "dateDesc")
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortOption === "amountAsc")
      temp.sort((a, b) => a.totalAmount - b.totalAmount);
    else if (sortOption === "amountDesc")
      temp.sort((a, b) => b.totalAmount - a.totalAmount);
    else temp.sort((a, b) => a.id - b.id);

    setFilteredOrders(temp);
  };

  useEffect(applyFiltersAndSort, [filterStatus, filterDress, sortOption, orders]);

  const dressTypes = [...new Set(orders.map((o) => o.items?.dress_type))];

  const downloadBillPDF = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Order Invoice", 105, 20, null, null, "center");

    let startY = 30;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${order.id}`, 20, startY);
    doc.text(`Customer: ${order.User?.name || "N/A"}`, 20, startY + 8);
    doc.text(`Status: ${order.status}`, 20, startY + 16);

    if (order.status === "Cancelled" && order.cancelReason) {
      doc.text(`Cancel Reason: ${order.cancelReason}`, 20, startY + 24);
      startY += 8;
    }

    doc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      20,
      startY + 24
    );
    doc.text(`Total Amount: ₹${order.totalAmount}`, 20, startY + 32);

    const measurements = order.items?.measurements
      ? Object.entries(order.items.measurements).map(([key, val]) => [
        key.replace(/_/g, " "),
        val.toString(),
      ])
      : [];

    if (measurements.length > 0) {
      autoTable(doc, {
        startY: startY + 40,
        head: [["Measurement", "Value"]],
        body: measurements,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { cellPadding: 4, fontSize: 11, halign: "center", valign: "middle" },
        columnStyles: { 0: { halign: "left" }, 1: { halign: "center" } },
      });
    }

    doc.save(`Order_${order.id}_Invoice.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-5 rounded-xl shadow-sm">
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Dress Type</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={filterDress}
            onChange={(e) => setFilterDress(e.target.value)}
          >
            <option value="">All</option>
            {dressTypes.map(
              (d) =>
                d && (
                  <option key={d} value={d}>
                    {d}
                  </option>
                )
            )}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Sort By</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Default</option>
            <option value="dateAsc">Date ↑</option>
            <option value="dateDesc">Date ↓</option>
            <option value="amountAsc">Amount ↑</option>
            <option value="amountDesc">Amount ↓</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-xl p-6 border-l-4 border-indigo-500 transition hover:shadow-lg"
            >
              {/* Summary */}
              <div
                className="flex justify-between items-start cursor-pointer"
                onClick={() => toggleDetails(order.id)}
              >
                <div>
                  <p className="font-bold text-lg">
                    {order.User?.name || "Unknown Customer"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Order #{order.fixedOrderNumber} •{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* Material + Color summary */}
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-700">
                    <span>
                      <strong>Material:</strong> {order.items?.material || "N/A"}
                    </span>
                    {order.items?.color && (
                      <span className="flex items-center gap-1">
                        <span
                          className="w-4 h-4 rounded-full border shadow"
                          style={{ backgroundColor: order.items.color }}
                        ></span>
                        {order.items.color}
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]
                      }`}
                  >
                    {statusIcons[order.status]} {order.status}
                  </span>
                </div>

                <div
                  className="flex gap-3 items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="text-indigo-600 underline font-medium">
                    {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                    onClick={() => downloadBillPDF(order)}
                  >
                    <FaFilePdf /> Download
                  </button>

                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                    onClick={() => handleCustomerClick(order)}
                  >
                    <FaUser /> Customer
                  </button>

                  {order.feedback && (
                    <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md flex items-center gap-1"
                      onClick={() =>
                        setFeedbackModal({ open: true, feedback: order.feedback })
                      }
                    >
                      <FaCommentDots /> Feedback
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrderId === order.id && (
                <div className="mt-4 border-t pt-4 space-y-3 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <strong>Dress Type:</strong>{" "}
                      {order.items?.dress_type || "N/A"}
                    </p>
                    <p>
                      <strong>Material:</strong> {order.items?.material || "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <strong>Color:</strong>{" "}
                      {order.items?.color ? (
                        <>
                          <span
                            className="w-4 h-4 rounded-full border shadow"
                            style={{ backgroundColor: order.items.color }}
                          ></span>
                          {order.items.color}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p>
                      <strong>Extras:</strong> {order.items?.extras || "None"}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ₹{order.totalAmount}
                    </p>
                  </div>

                  {order.items?.measurements && (
                    <div className="overflow-x-auto">
                      <table className="w-full border rounded-lg mt-2 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-3 py-1 text-left">
                              Measurement
                            </th>
                            <th className="border px-3 py-1 text-left">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(order.items.measurements).map(
                            ([k, v]) => (
                              <tr key={k} className="even:bg-gray-50">
                                <td className="border px-3 py-1 capitalize">
                                  {k.replace(/_/g, " ")}
                                </td>
                                <td className="border px-3 py-1">{v}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Status Update Section */}
                  <div className="mt-3">
                    <label className="block font-medium mb-1">Update Status</label>

                    {order.status === "Cancelled" ? (
                      <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg">
                        {order.status}{" "}
                        {order.cancelReason ? `(Reason: ${order.cancelReason})` : ""}
                      </div>
                    ) : (
                      <>
                        {/* Status Dropdown */}
                        <select
                          className="border border-gray-300 rounded-md px-3 py-2 w-full"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {/* OTP Section: Only show when status is Delivered and OTP exists */}
                        {order.status === "Delivered" && order.delivery_otp && (
                          <div className="mt-2">
                            <label className="block font-medium mb-1">Enter OTP</label>
                            <input
                              type="text"
                              className="border border-gray-300 rounded-md px-3 py-2 w-full"
                              value={order.inputOtp || ""}
                              onChange={(e) => handleOtpChange(order.id, e.target.value)}
                              placeholder="Enter delivery OTP"
                            />
                            <button
                              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                              onClick={() =>
                                updateStatus(order.id, "Delivered", order.inputOtp)
                              }
                              disabled={!order.inputOtp}
                            >
                              Confirm Delivery
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaCommentDots /> Customer Feedback
            </h3>
            <p className="text-gray-700">
              <strong>Rating:</strong> {feedbackModal.feedback.rating} / 5
            </p>
            <p className="text-gray-700">
              <strong>Feedback:</strong> {feedbackModal.feedback.text}
            </p>
            <button
              className="mt-4 bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400 font-medium"
              onClick={() =>
                setFeedbackModal({ open: false, feedback: null })
              }
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      {customerModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser /> Customer Details
            </h3>
            <p>
              <strong>Name:</strong> {customerinfo.User?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {customerinfo.User?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {customerinfo.User?.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {customerinfo?.delivery_address ||
                customerinfo.User?.address ||
                "N/A"}
            </p>
            <button
              className="mt-4 bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400 font-medium"
              onClick={() => setCustomerModal({ open: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}