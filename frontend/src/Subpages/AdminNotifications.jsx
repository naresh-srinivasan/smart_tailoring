import React, { useEffect, useState } from "react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <li key={notification.id} className="py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{notification.title}</h2>
              <small className="text-gray-500">{notification.timestamp}</small>
            </div>
            <p className="text-lg">{notification.message}</p>
            <div className="flex justify-end mt-2">
              <button onClick={() => markAsRead(notification.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Mark as read
              </button>
              <button onClick={() => deleteNotification(notification.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
