import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../config";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    if (!token) {
      toast.error("Admin not logged in!");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`${serverUrl}/api/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setOrders(data.orders || []);
      else toast.error(data.message || "Failed to fetch orders");
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    if (!token) {
      toast.error("Admin not logged in!");
      return;
    }
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/order`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message || "Order status updated");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else toast.error(data.message || "Failed to update status");
    } catch (err) {
      console.error("Update Status Error:", err);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">All Orders</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="font-semibold text-lg">Order ID:</h3>
                <p className="text-gray-700 text-sm">{order._id}</p>

                <h3 className="font-semibold mt-2 text-lg">User:</h3>
                <p className="text-gray-700 text-sm">
                  {order.userId || "N/A"}
                </p>

                <h3 className="font-semibold mt-2 text-lg">Total Amount:</h3>
                <p className="text-gray-700 text-sm">
                  ${order.totalPrice || order.totalAmount || 0}
                </p>

                <h3 className="font-semibold mt-2 text-lg">Status:</h3>
                <p
                  className={`text-sm font-medium mt-1 ${
                    order.status === "Completed"
                      ? "text-green-600"
                      : order.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {order.status !== "Completed" && (
                  <button
                    onClick={() => updateStatus(order._id, "Completed")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition cursor-pointer"
                  >
                    Complete
                  </button>
                )}
                {order.status !== "Cancelled" && (
                  <button
                    onClick={() => updateStatus(order._id, "Cancelled")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
                  >
                    Decline
                  </button>
                )}
                {order.status !== "Processing" && order.status !== "Completed" && (
                  <button
                    onClick={() => updateStatus(order._id, "Processing")}
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition cursor-pointer"
                  >
                    Processing
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
