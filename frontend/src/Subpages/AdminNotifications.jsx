import React, { useEffect, useState } from "react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error("Unexpected notifications response:", data);
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#286fad]">Order Notifications</h1>

      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-lg shadow-md transition ${
                n.read ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              <p className="text-lg font-medium">{n.title || "Notification"}</p>
              <p className="text-gray-700">{n.message}</p>
              <small className="text-gray-500 block mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </small>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="mt-2 inline-block text-sm text-blue-600 underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
