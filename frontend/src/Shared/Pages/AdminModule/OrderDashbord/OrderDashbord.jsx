import React, { useEffect, useMemo, useState } from "react";
import api from "../../../../Api/Axios";
import { FiEye } from "react-icons/fi";
import styles from "./OrderDashbord.module.css";
import OrderDetails from "./OrderDetails";




const OrderDashbord = () => {


  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetOrders();
  }, []);

  const GetOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/v1/order/admin");

      if (data.success) {
        setOrders(data.data.orders || []);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      totalOrders: orders.length,

      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),

      pendingOrders: orders.filter((order) => order.orderStatus === "Pending")
        .length,

      deliveredOrders: orders.filter(
        (order) => order.orderStatus === "Delivered",
      ).length,

      cancelledOrders: orders.filter(
        (order) => order.orderStatus === "Cancelled",
      ).length,
    };
  }, [orders]);

  if (loading) {
    return <div className={styles.loading}>Loading Orders...</div>;
  }




  return (
    
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Order Dashboard</h2>
      </div>

      {/* Stats */}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Total Orders</span>
          <h3>{stats.totalOrders}</h3>
        </div>

        <div className={styles.statCard}>
          <span>Revenue</span>
          <h3>₹{stats.totalRevenue}</h3>
        </div>

        <div className={styles.statCard}>
          <span>Pending</span>
          <h3>{stats.pendingOrders}</h3>
        </div>

        <div className={styles.statCard}>
          <span>Delivered</span>
          <h3>{stats.deliveredOrders}</h3>
        </div>

        <div className={styles.statCard}>
          <span>Cancelled</span>
          <h3>{stats.cancelledOrders}</h3>
        </div>
      </div>

      {/* Desktop Table */}

      <div className={styles.desktopView}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Products</th>
                <th>Order No</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div className={styles.tableImages}>
                      {order.items.slice(0, 3).map((item, index) => (
                        <img key={index} src={item.coverImage?.url} alt="" />
                      ))}
                    </div>
                  </td>

                  <td>{order.orderNumber}</td>

                  <td>{order.shippingAddress?.fullName}</td>

                  <td>{order.items.length}</td>

                  <td>₹{order.totalAmount}</td>

                  <td>{order.paymentStatus}</td>

                  <td>{order.orderStatus}</td>

                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}

      <div className={styles.mobileView}>
        {orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <div>
                <h4>{order.orderNumber}</h4>

                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <button
                className={styles.viewBtn}
                onClick={() => setSelectedOrder(order)}
              >
                <FiEye />
              </button>
            </div>

            <div className={styles.imagesRow}>
              {order.items.slice(0, 4).map((item, index) => (
                <img
                  key={index}
                  src={item.coverImage?.url}
                  alt={item.productName}
                  className={styles.productImage}
                />
              ))}

              {order.items.length > 4 && (
                <div className={styles.moreImages}>
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            <div className={styles.infoGrid}>
              <div>
                <label>Customer</label>

                <p>{order.shippingAddress?.fullName}</p>
              </div>

              <div>
                <label>Items</label>

                <p>{order.items.length}</p>
              </div>

              <div>
                <label>Total</label>

                <p>₹{order.totalAmount}</p>
              </div>

              <div>
                <label>Payment</label>

                <p>{order.paymentMethod}</p>
              </div>
            </div>

            <div className={styles.statusRow}>
              <span
                className={`${styles.badge} ${
                  styles[order.orderStatus.toLowerCase()]
                }`}
              >
                {order.orderStatus}
              </span>

              <span
                className={`${styles.badge} ${
                  styles[order.paymentStatus.toLowerCase()]
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          refreshOrders={GetOrders}
        />
      )}

    </div>
  );
};

export default OrderDashbord;
