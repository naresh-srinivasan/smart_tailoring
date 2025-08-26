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
  FaFilter,
  FaSort,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaEye,
  FaEyeSlash,
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
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    "Order Accepted": "bg-blue-50 text-blue-700 border-blue-200",
    Shipped: "bg-purple-50 text-purple-700 border-purple-200",
    "Out for Delivery": "bg-orange-50 text-orange-700 border-orange-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const statusIcons = {
    Pending: <FaClock className="w-3 h-3" />,
    "Order Accepted": <FaCheckCircle className="w-3 h-3" />,
    Shipped: <FaTruck className="w-3 h-3" />,
    "Out for Delivery": <FaBoxOpen className="w-3 h-3" />,
    Delivered: <FaCheckCircle className="w-3 h-3" />,
    Cancelled: <FaTimesCircle className="w-3 h-3" />,
  };

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDress, setFilterDress] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc"); // Default to latest first

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort by date descending (latest first) by default
      const sortedOrders = res.data.orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const ordersWithNumber = sortedOrders.map((o, idx) => ({
        ...o,
        fixedOrderNumber: idx + 1,
        feedback: o.feedback_text
          ? { text: o.feedback_text, rating: o.feedback_rating }
          : null,
        inputOtp: "",
        pendingDelivery: false, // Add flag to track pending delivery
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
            ? { 
                ...o, 
                ...updatedOrder, 
                User: o.User, 
                feedback: o.feedback, 
                inputOtp: "",
                pendingDelivery: false // Reset pending delivery flag
              }
            : o
        )
      );

      setFilteredOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { 
                ...o, 
                ...updatedOrder, 
                User: o.User, 
                feedback: o.feedback, 
                inputOtp: "",
                pendingDelivery: false // Reset pending delivery flag
              }
            : o
        )
      );

      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update status");
      
      // Reset pending delivery flag on error
      if (newStatus === "Delivered") {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, pendingDelivery: false } : o
          )
        );
        setFilteredOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, pendingDelivery: false } : o
          )
        );
      }
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === "Delivered") {
      // Set pending delivery flag but don't update status yet
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, pendingDelivery: true } : o
        )
      );
      setFilteredOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, pendingDelivery: true } : o
        )
      );
    } else {
      // For other statuses, update immediately
      updateStatus(orderId, newStatus);
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
    else temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Default to latest first

    setFilteredOrders(temp);
  };

  useEffect(applyFiltersAndSort, [filterStatus, filterDress, sortOption, orders]);

  const dressTypes = [...new Set(orders.map((o) => o.items?.dress_type).filter(Boolean))];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 flex-shrink-0">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track all customer orders
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                {filteredOrders.length} Orders
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters & Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-500 w-4 h-4" />
            <h2 className="text-lg font-semibold text-gray-900">Filters & Sorting</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Dress Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Dress Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={filterDress}
                onChange={(e) => setFilterDress(e.target.value)}
              >
                <option value="">All Types</option>
                {dressTypes.map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSort className="inline w-3 h-3 mr-1" />
                Sort Orders
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="dateDesc">Date: Newest First (Default)</option>
                <option value="dateAsc">Date: Oldest First</option>
                <option value="amountAsc">Amount: Low to High</option>
                <option value="amountDesc">Amount: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 min-h-0">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center h-96 flex flex-col items-center justify-center">
              <div className="text-gray-400 mb-4">
                <FaBoxOpen className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <div className="space-y-4 pb-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Order Summary */}
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        {/* Left Section */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {order.User?.name || "Unknown Customer"}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                  order.pendingDelivery 
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200" 
                                    : statusColors[order.status] || "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {order.pendingDelivery ? (
                                  <>
                                    <FaClock className="w-3 h-3" />
                                    Pending Delivery Confirmation
                                  </>
                                ) : (
                                  <>
                                    {statusIcons[order.status] || <FaClock className="w-3 h-3" />}
                                    {order.status}
                                  </>
                                )}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{order.totalAmount}
                              </span>
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div>
                              <span className="font-medium text-gray-900">Order #</span>
                              <div>{order.fixedOrderNumber}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Date</span>
                              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Material</span>
                              <div className="truncate">{order.items?.material || "N/A"}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Color</span>
                              <div className="flex items-center gap-2">
                                {order.items?.color && (
                                  <span
                                    className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: order.items.color }}
                                  ></span>
                                )}
                                <span className="truncate">{order.items?.color || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0 lg:ml-6">
                          <button
                            onClick={() => toggleDetails(order.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          >
                            {expandedOrderId === order.id ? (
                              <>
                                <FaEyeSlash className="w-3 h-3" />
                                Hide
                              </>
                            ) : (
                              <>
                                <FaEye className="w-3 h-3" />
                                Details
                              </>
                            )}
                            {expandedOrderId === order.id ? (
                              <FaChevronUp className="w-3 h-3" />
                            ) : (
                              <FaChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            onClick={() => downloadBillPDF(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FaFilePdf className="w-3 h-3" />
                            <span className="hidden sm:inline">PDF</span>
                          </button>

                          <button
                            onClick={() => handleCustomerClick(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <FaUser className="w-3 h-3" />
                            <span className="hidden sm:inline">Customer</span>
                          </button>

                          {order.feedback && (
                            <button
                              onClick={() =>
                                setFeedbackModal({ open: true, feedback: order.feedback })
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                            >
                              <FaCommentDots className="w-3 h-3" />
                              <span className="hidden sm:inline">Feedback</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrderId === order.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
                        <div className="space-y-6">
                          {/* Order Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Dress Details</h4>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div><span className="font-medium">Type:</span> {order.items?.dress_type || "N/A"}</div>
                                <div><span className="font-medium">Material:</span> {order.items?.material || "N/A"}</div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Color:</span>
                                  {order.items?.color ? (
                                    <>
                                      <span
                                        className="w-4 h-4 rounded-full border border-gray-200"
                                        style={{ backgroundColor: order.items.color }}
                                      ></span>
                                      <span>{order.items.color}</span>
                                    </>
                                  ) : (
                                    <span>N/A</span>
                                  )}
                                </div>
                                <div><span className="font-medium">Extras:</span> {order.items?.extras || "None"}</div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div><span className="font-medium">Order ID:</span> {order.id}</div>
                                <div><span className="font-medium">Order Number:</span> #{order.fixedOrderNumber}</div>
                                <div><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</div>
                                <div><span className="font-medium text-lg text-green-600">Total: ₹{order.totalAmount}</span></div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Status Management</h4>
                              {order.status === "Cancelled" ? (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                  <div className="font-medium">Cancelled</div>
                                  {order.cancelReason && (
                                    <div className="text-xs mt-1">Reason: {order.cancelReason}</div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={order.pendingDelivery ? "Delivered" : order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  >
                                    {statusOptions.map((s) => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </select>

                                  {(order.pendingDelivery || order.status === "Delivered") && order.delivery_otp && (
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-700">
                                        Delivery OTP Verification
                                        {order.pendingDelivery && (
                                          <span className="text-yellow-600 text-xs ml-1">
                                            (Enter OTP to confirm delivery)
                                          </span>
                                        )}
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        value={order.inputOtp || ""}
                                        onChange={(e) => handleOtpChange(order.id, e.target.value)}
                                        placeholder="Enter delivery OTP"
                                      />
                                      <button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() =>
                                          updateStatus(order.id, "Delivered", order.inputOtp)
                                        }
                                        disabled={!order.inputOtp}
                                      >
                                        Confirm Delivery
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Measurements Table */}
                          {order.items?.measurements && (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h4 className="font-semibold text-gray-900">Measurements</h4>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-2 text-left font-medium text-gray-900">Measurement</th>
                                      <th className="px-4 py-2 text-left font-medium text-gray-900">Value</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {Object.entries(order.items.measurements).map(([k, v]) => (
                                      <tr key={k} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 font-medium text-gray-900 capitalize">
                                          {k.replace(/_/g, " ")}
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">
                                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaCommentDots className="text-amber-500" />
                Customer Feedback
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Rating:</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < feedbackModal.feedback.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    ({feedbackModal.feedback.rating}/5)
                  </span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-900 block mb-2">Feedback:</span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {feedbackModal.feedback.text}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                onClick={() => setFeedbackModal({ open: false, feedback: null })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      {customerModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Customer Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="font-semibold text-gray-900">Name:</span>
                <div className="text-gray-700 mt-1">{customerinfo.User?.name || "N/A"}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Email:</span>
                <div className="text-gray-700 mt-1">{customerinfo.User?.email || "N/A"}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Phone:</span>
                <div className="text-gray-700 mt-1">{customerinfo.User?.phone || "N/A"}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Address:</span>
                <div className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                  {customerinfo?.delivery_address ||
                    customerinfo.User?.address ||
                    "N/A"}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                onClick={() => setCustomerModal({ open: false })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}