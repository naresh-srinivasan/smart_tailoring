import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload, FaEdit, FaEye, FaEyeSlash, FaSearch, FaFilter, FaCalendarAlt, FaTimes, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const [feedbackOrderId, setFeedbackOrderId] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);

  const [returnOrderId, setReturnOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [customReturnReason, setCustomReturnReason] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const statusColors = {
    Pending: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
    "Order Accepted": "bg-gradient-to-r from-blue-400 to-blue-500 text-white",
    Shipped: "bg-gradient-to-r from-purple-400 to-purple-500 text-white",
    "Out for Delivery": "bg-gradient-to-r from-orange-400 to-orange-500 text-white",
    Delivered: "bg-gradient-to-r from-green-400 to-green-500 text-white",
    Cancelled: "bg-gradient-to-r from-red-400 to-red-500 text-white",
    Returned: "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Sort orders by creation date (latest first)
        const sortedOrders = (res.data.orders || []).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setOrders(sortedOrders);
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
  const openFeedbackModal = (orderId, existingFeedback = null) => {
    setFeedbackOrderId(orderId);
    if (existingFeedback) {
      setFeedbackText(existingFeedback.text || "");
      setRating(existingFeedback.rating || 0);
      setIsEditingFeedback(true);
    } else {
      setFeedbackText("");
      setRating(0);
      setIsEditingFeedback(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim() && rating === 0) {
      return alert("Please provide feedback and a rating before submitting.");
    }
    try {
      const token = localStorage.getItem("token");
      const endpoint = isEditingFeedback 
        ? `http://localhost:5000/api/orders/${feedbackOrderId}/feedback/update`
        : `http://localhost:5000/api/orders/${feedbackOrderId}/feedback`;
      
      const method = isEditingFeedback ? 'put' : 'post';
      
      await axios[method](
        endpoint,
        { feedback: feedbackText, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(prev =>
        prev.map(o => o.id === feedbackOrderId ? { ...o, feedback: { text: feedbackText, rating } } : o)
      );
      
      setFeedbackOrderId(null);
      setFeedbackText("");
      setRating(0);
      setIsEditingFeedback(false);
      
      alert(isEditingFeedback ? "Feedback updated successfully!" : "Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Try again.");
    }
  };

  const closeFeedbackModal = () => {
    setFeedbackOrderId(null);
    setFeedbackText("");
    setRating(0);
    setIsEditingFeedback(false);
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
    const doc = new jsPDF("p", "mm", "a4");
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("WeaveNest - Order Invoice", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Customer Details
    doc.text(`Customer Name: ${order.User?.name || "N/A"}`, 20, 35);
    doc.text(`Order ID: ${order.id}`, 20, 43);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 51);
    doc.text(`Status: ${order.status}`, 20, 59);
    
    // Table of Measurements
    const measurements = order.items?.measurements
      ? Object.entries(order.items.measurements).map(([k, v]) => [k.replace(/_/g, " "), v.toString()])
      : [];
    
    if (measurements.length > 0) {
      autoTable(doc, {
        startY: 70,
        head: [["Measurement", "Value (cm)"]],
        body: measurements,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 11, halign: "center" },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: { 0: { halign: "left" }, 1: { halign: "center" } },
      });
    }

    const finalY = measurements.length > 0 ? doc.lastAutoTable.finalY + 15 : 85;

    // Order Summary Box
    doc.setDrawColor(41, 128, 185);
    doc.setFillColor(230, 245, 255);
    doc.rect(20, finalY, 170, 25, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${order.totalAmount}`, 105, finalY + 15, null, null, "center");

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for shopping with WeaveNest!", 105, 290, null, null, "center");
    doc.text("Contact: +91-XXXXXXXXXX | Email: support@weavenest.com", 105, 295, null, null, "center");
    
    doc.save(`Order_${order.id}_Invoice.pdf`);
  };

  // Helper function to render star rating
  const renderStarRating = (rating, interactive = false, onRate = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FaStar
            key={i}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} text-yellow-400 transition-all duration-200`}
            onClick={interactive ? () => onRate(i) : undefined}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className={`${interactive ? 'cursor-pointer hover:scale-110 hover:text-yellow-300' : ''} text-gray-300 transition-all duration-200`}
            onClick={interactive ? () => onRate(i) : undefined}
          />
        );
      }
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-xl text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl text-gray-400 mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800">No Orders Found</h2>
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  const filteredOrders = orders
    .filter(o => statusFilter === "All" || o.status === statusFilter)
    .filter(o => o.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toString().includes(searchTerm));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Enhanced Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto lg:mx-0">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or order ID..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {["All", "Pending", "Order Accepted", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"].map(status => (
              <button
                key={status}
                className={`px-6 py-2 rounded-full font-medium border-2 transition-all duration-300 transform hover:scale-105 ${
                  statusFilter === status 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleDetails(order.id)}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {orders.length - index}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Order #{orders.length - index}</h3>
                        <p className="text-gray-600">Customer: <span className="font-semibold">{order.User?.name}</span></p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-600">Dress:</span>
                        <span className="font-semibold text-gray-800">{order.items?.dress_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="text-gray-600">Ordered:</span>
                        <span className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50">
                      {expandedOrderId === order.id ? <FaEyeSlash /> : <FaEye />}
                      {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                    </button>
                    <button
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadBillPDF(order);
                      }}
                    >
                      <FaDownload />
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrderId === order.id && (
                <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">Material & Design</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Material:</span> <span className="font-medium">{order.items?.material}</span></p>
                        <p><span className="text-gray-600">Color:</span> <span className="font-medium">{order.items?.color}</span></p>
                        <p><span className="text-gray-600">Extras:</span> <span className="font-medium">{order.items?.extras || "None"}</span></p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
                      <div className="text-2xl font-bold text-green-600">₹{order.totalAmount}</div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>

                    {order.feedback && (
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h4 className="font-semibold text-gray-800 mb-2">Your Rating</h4>
                        <div className="flex items-center gap-2">
                          {renderStarRating(order.feedback.rating)}
                          <span className="text-sm text-gray-600">({order.feedback.rating}/5)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Measurements Table */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
                      <h4 className="font-semibold">Measurements</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measurement</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.items?.measurements &&
                            Object.entries(order.items.measurements).map(([key, val]) => {
                              let displayValue;
                              if (typeof val === 'object' && val !== null) {
                                if (val.type && val.color) {
                                  displayValue = `${val.type} - ${val.color}`;
                                } else {
                                  displayValue = JSON.stringify(val);
                                }
                              } else {
                                displayValue = val;
                              }
                              
                              return (
                                <tr key={key} className="hover:bg-gray-50 transition-colors duration-200">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                    {key.replace(/_/g, " ")}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {displayValue}
                                  </td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status === "Pending" && (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      {cancelOrderId === order.id ? (
                        <div className="space-y-4">
                          <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            placeholder="Please provide a reason for cancellation..."
                            rows="3"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                          <div className="flex gap-3">
                            <button
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                              onClick={() => submitCancellation(order.id)}
                            >
                              Confirm Cancellation
                            </button>
                            <button
                              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                              onClick={() => setCancelOrderId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleCancelClick(order.id)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  )}

                  {order.status === "Delivered" && (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="flex flex-wrap gap-3">
                        {!order.feedback ? (
                          <button
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            onClick={() => openFeedbackModal(order.id)}
                          >
                            <FaStar />
                            Give Feedback
                          </button>
                        ) : (
                          <button
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            onClick={() => openFeedbackModal(order.id, order.feedback)}
                          >
                            <FaEdit />
                            Edit Feedback
                          </button>
                        )}
                        {!order.returnReason && (
                          <button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => openReturnModal(order.id)}
                          >
                            Return Order
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Feedback Display */}
                  {order.feedback && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FaStar className="text-yellow-400" />
                        Your Feedback
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          {renderStarRating(order.feedback.rating)}
                          <span className="text-sm font-medium text-gray-600">({order.feedback.rating}/5 stars)</span>
                        </div>
                        <p className="text-gray-700 bg-white p-3 rounded-lg">{order.feedback.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Return Reason Display */}
                  {order.returnReason && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                      <h4 className="font-semibold text-gray-800 mb-2">Return Reason</h4>
                      <p className="text-gray-700">{order.returnReason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Feedback Modal */}
      {feedbackOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {isEditingFeedback ? "Edit Your Feedback" : "Share Your Experience"}
                </h3>
                <button
                  onClick={closeFeedbackModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Rating Section */}
              <div className="text-center space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Rate Your Experience</h4>
                <div className="flex items-center justify-center gap-2">
                  {renderStarRating(rating, true, setRating)}
                </div>
                <p className="text-gray-600">
                  {rating > 0 ? `You rated ${rating} star${rating > 1 ? 's' : ''}` : "Click on stars to rate"}
                </p>
              </div>

              {/* Feedback Text */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800">Your Feedback</label>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-xl p-4 h-32 resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Tell us about your experience with this order..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  onClick={closeFeedbackModal}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={submitFeedback}
                >
                  {isEditingFeedback ? "Update Feedback" : "Submit Feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Return Modal */}
      {returnOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Return Order</h3>
                <button
                  onClick={() => setReturnOrderId(null)}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800">Reason for Return</label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                >
                  <option value="">Select a reason for return</option>
                  <option value="Wrong Size">Wrong Size</option>
                  <option value="Defective Product">Defective Product</option>
                  <option value="Changed Mind">Changed Mind</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {returnReason === "Other" && (
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-800">Please specify</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-4 h-24 resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Please provide your reason for return..."
                    value={customReturnReason}
                    onChange={(e) => setCustomReturnReason(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  onClick={() => setReturnOrderId(null)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() => submitReturn(returnOrderId)}
                >
                  Submit Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
