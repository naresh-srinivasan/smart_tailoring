import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useAuth } from "../Context/AuthContext";

const SOCKET_SERVER_URL = "http://localhost:5000";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      console.log("Fetching notifications for user:", user.id);
      
      const res = await axios.get(`${SOCKET_SERVER_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Notifications response:", res.data);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${SOCKET_SERVER_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  useEffect(() => {
    console.log("Notifications component mounted, user:", user);
    fetchNotifications();

    if (!user) return;

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling']
    });

    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socket.on(`notification-${user.id}`, (notification) => {
      console.log("New notification received:", notification);
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Notifications</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Notifications</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button 
            onClick={fetchNotifications}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Notifications</h2>
        <p className="text-gray-500">Please log in to view notifications.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
        <button
          onClick={fetchNotifications}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notifications yet.</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for updates!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-600 mb-4">
            You have {notifications.filter(n => !n.read).length} unread notifications
          </p>
          
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`relative border p-4 rounded-lg shadow-sm bg-white hover:shadow-md cursor-pointer transition-all ${
                !n.read ? "border-blue-400 bg-blue-50" : "border-gray-200"
              }`}
            >
              {!n.read && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
              <div className="pr-6">
                <p className={`font-semibold ${!n.read ? "text-blue-800" : "text-gray-800"}`}>
                  {n.title}
                </p>
                <p className="text-gray-600 mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}