import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ Added

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const [feedbackOrderId, setFeedbackOrderId] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);

  const [returnOrderId, setReturnOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [customReturnReason, setCustomReturnReason] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate(); // ✅ hook for navigation

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "Order Accepted": "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    "Out for Delivery": "bg-orange-100 text-orange-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Returned: "bg-orange-100 text-orange-800",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // ✅ redirect if not logged in
          return;
        }
        const res = await axios.get("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const toggleDetails = (id) =>
    setExpandedOrderId(expandedOrderId === id ? null : id);

  // --- rest of your code is unchanged (cancellation, feedback, return, PDF) ---


  // Cancel Order
  const handleCancelClick = (orderId) => {
    setCancelOrderId(cancelOrderId === orderId ? null : orderId);
    setCancelReason("");
  };

  const submitCancellation = async (orderId) => {
    if (!cancelReason.trim()) return alert("Please provide a reason for cancellation");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: "Cancelled", cancelReason } : o)
      );
      setCancelOrderId(null);
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order. Try again.");
    }
  };

  // Feedback
  const openFeedbackModal = (orderId) => {
    setFeedbackOrderId(orderId);
    setFeedbackText("");
    setRating(0);
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim() && rating === 0) return alert("Please provide feedback and a rating before submitting.");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/orders/${feedbackOrderId}/feedback`,
        { feedback: feedbackText, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev =>
        prev.map(o => o.id === feedbackOrderId ? { ...o, feedback: { text: feedbackText, rating } } : o)
      );
      setFeedbackOrderId(null);
      setFeedbackText("");
      setRating(0);
      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Try again.");
    }
  };

  // Return
  const openReturnModal = (orderId) => {
    setReturnOrderId(orderId);
    setReturnReason("");
    setCustomReturnReason("");
  };

  const submitReturn = async (orderId) => {
    if (!returnReason) return alert("Please select a reason for return.");
    const reasonToSend = returnReason === "Other" ? customReturnReason.trim() : returnReason;
    if (!reasonToSend) return alert("Please provide a reason for return.");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/orders/${orderId}/return`,
        { reason: reasonToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: "Returned", returnReason: reasonToSend } : o))
      );
      setReturnOrderId(null);
      alert("Order returned successfully!");
    } catch (err) {
      console.error("Error returning order:", err);
      alert("Failed to return order. Try again.");
    }
  };

  // Download PDF
  const downloadBillPDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Order Invoice", 105, 20, null, null, "center");

    let startY = 30;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Customer: ${order.User?.name || "N/A"}`, 20, startY);
    doc.text(`Order ID: ${order.id}`, 20, startY + 8);
    doc.text(`Status: ${order.status}`, 20, startY + 16);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, startY + 24);

    const measurements = order.items?.measurements
      ? Object.entries(order.items.measurements).map(([k, v]) => [k.replace(/_/g, " "), v.toString()])
      : [];

    if (measurements.length > 0) {
      autoTable(doc, {
        startY: startY + 35,
        head: [["Measurement", "Value (cm)"]],
        body: measurements,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
        styles: { cellPadding: 4, fontSize: 11, halign: "center", valign: "middle" },
        columnStyles: { 0: { halign: "left" }, 1: { halign: "center" } },
      });
    }

    const finalY = measurements.length > 0 ? doc.lastAutoTable.finalY + 15 : startY + 60;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ₹${order.totalAmount}`, 105, finalY, null, null, "center");

    doc.save(`Order_${order.id}_Invoice.pdf`);
  };

  if (loading) return <p className="text-gray-500 text-center mt-20">Loading orders...</p>;
  if (!orders.length) return <p className="text-gray-500 text-center mt-20">No orders found.</p>;

  const filteredOrders = orders
    .filter(o => statusFilter === "All" || o.status === statusFilter)
    .filter(o => o.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toString().includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-24">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">My Orders</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Order Accepted", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"].map(status => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full font-medium border ${statusFilter === status ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-indigo-500 hover:text-white transition`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by customer or order ID"
          className="border px-4 py-2 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-8">
        {[...filteredOrders].reverse().map((order, index) => (
          <div key={order.id} className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300 w-full border border-gray-200">

            {/* Main Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
              onClick={() => toggleDetails(order.id)}>
              <div className="mb-4 md:mb-0">
                <p className="text-xl font-semibold text-gray-800 mb-1">Order #{index + 1}</p>
                <p className="text-gray-600 mb-1">Customer: {order.User?.name}</p>
                <p className="text-gray-600 mb-1">Dress: <span className="font-medium">{order.items?.dress_type}</span></p>
                <p className="text-gray-500 mb-1">Received: {new Date(order.createdAt).toLocaleDateString()}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full font-semibold text-sm ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <button className="text-indigo-600 underline font-medium">
                  {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                </button>
                <button
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-md hover:from-blue-500 hover:to-indigo-600 transition-all"
                  onClick={() => downloadBillPDF(order)}
                >
                  <FaDownload /> Download Bill
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrderId === order.id && (
              <div className="mt-6 border-t pt-6 text-gray-700 space-y-4">
                <p><strong>Material:</strong> {order.items?.material}</p>
                <p><strong>Color:</strong> {order.items?.color}</p>
                <p><strong>Extras:</strong> {order.items?.extras || "None"}</p>
                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

                <div>
                  <p className="font-semibold mb-2">Measurements:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-300 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-2 text-left">Measurement</th>
                          <th className="border px-4 py-2 text-left">Value (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items?.measurements &&
                          Object.entries(order.items.measurements).map(([key, val]) => (
                            <tr key={key}>
                              <td className="border px-4 py-2 capitalize">{key.replace(/_/g, " ")}</td>
                              <td className="border px-4 py-2">{val}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cancel */}
                {order.status === "Pending" && (
                  <div className="mt-4">
                    {cancelOrderId === order.id ? (
                      <div className="space-y-3">
                        <textarea
                          className="w-full border rounded-lg p-3"
                          placeholder="Enter cancellation reason..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 shadow-md"
                            onClick={() => submitCancellation(order.id)}
                          >
                            Confirm Cancel
                          </button>
                          <button
                            className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400"
                            onClick={() => setCancelOrderId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="mt-3 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 shadow-md"
                        onClick={() => handleCancelClick(order.id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                )}

                {/* Feedback & Return */}
                {order.status === "Delivered" && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    {!order.feedback && (
                      <button
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 shadow-md"
                        onClick={() => openFeedbackModal(order.id)}
                      >
                        Give Feedback
                      </button>
                    )}
                    {!order.returnReason && (
                      <button
                        className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 shadow-md"
                        onClick={() => openReturnModal(order.id)}
                      >
                        Return Order
                      </button>
                    )}
                  </div>
                )}

                {order.feedback && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold">Your Feedback:</p>
                    <p>Rating: {order.feedback.rating} / 5</p>
                    <p>Feedback: {order.feedback.text}</p>
                  </div>
                )}

                {order.returnReason && (
                  <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p><strong>Return Reason:</strong> {order.returnReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {feedbackOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 md:p-12 shadow-lg space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Submit Feedback</h3>
            <div className="flex items-center justify-center space-x-4 text-4xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="w-full border rounded-xl p-4 h-36 resize-none text-gray-700 placeholder-gray-400"
              placeholder="Write your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <div className="flex justify-end gap-6">
              <button
                className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 font-medium"
                onClick={() => setFeedbackOrderId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-medium"
                onClick={submitFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {returnOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 md:p-12 shadow-lg space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Return Order</h3>
            <select
              className="border px-4 py-2 rounded-lg w-full"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
            >
              <option value="">Select reason for return</option>
              <option value="Wrong Size">Wrong Size</option>
              <option value="Defective Product">Defective Product</option>
              <option value="Changed Mind">Changed Mind</option>
              <option value="Other">Other</option>
            </select>
            {returnReason === "Other" && (
              <textarea
                className="w-full border rounded-lg p-3 mt-2"
                placeholder="Enter your reason"
                value={customReturnReason}
                onChange={(e) => setCustomReturnReason(e.target.value)}
              />
            )}
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 font-medium"
                onClick={() => setReturnOrderId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 font-medium"
                onClick={() => submitReturn(returnOrderId)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
