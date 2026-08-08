import React, { useState } from "react";
import api from "../../../../Api/Axios";
import styles from "./OrderDetails.module.css";




const OrderDetails = ({ order, onClose, refreshOrders }) => {

  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [loading, setLoading] = useState(false);
  const orderSteps = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

  const currentStep = orderSteps.indexOf(orderStatus);

  const UpdateOrder = async () => {
    try {
      setLoading(true);

      const [orderRes, paymentRes] = await Promise.all([
        api.patch(`/v1/order/admin/status/${order._id}`, { orderStatus }),

        api.patch(`/v1/order/admin/payment-status/${order._id}`, {
          paymentStatus,
        }),
      ]);

      if (orderRes.data.success && paymentRes.data.success) {
        alert("Order updated successfully");

        refreshOrders();

        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header */}
        
        <div className={styles.header}>
          <div>
            <h2>{order.orderNumber}</h2>

            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Progress Bar */}

        <div className={styles.progressContainer}>
          {orderSteps.map((step, index) => (
            <div key={step} className={styles.stepWrapper}>
              <div
                className={`${styles.stepCircle} ${
                  index <= currentStep ? styles.activeStep : ""
                }`}
              >
                {index + 1}
              </div>

              <span>{step}</span>

              {index !== orderSteps.length - 1 && (
                <div
                  className={`${styles.stepLine} ${
                    index < currentStep ? styles.activeLine : ""
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Products */}

        <div className={styles.section}>
          <h3>Products</h3>

          <div className={styles.products}>
            {order.items.map((item, index) => (
              <div key={index} className={styles.productCard}>
                <img
                  src={item.coverImage.url}
                  alt={item.productName}
                  className={styles.productImage}
                />

                <div className={styles.productInfo}>
                  <h4>{item.productName}</h4>

                  <p>
                    Color:
                    {item.selectedVariant?.color}
                  </p>

                  <p>
                    Size:
                    {item.selectedVariant?.size}
                  </p>

                  <p>
                    Qty:
                    {item.quantity}
                  </p>

                  <strong>₹{item.totalPrice}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer */}

        <div className={styles.section}>
          <h3>Shipping Address</h3>

          <div className={styles.address}>
            <p>{order.shippingAddress.fullName}</p>

            <p>{order.shippingAddress.phone}</p>

            <p>{order.shippingAddress.addressLine1}</p>

            <p>{order.shippingAddress.addressLine2}</p>

            <p>
              {order.shippingAddress.city},{order.shippingAddress.state}
            </p>

            <p>{order.shippingAddress.postalCode}</p>
          </div>
        </div>

        {/* Summary */}

        <div className={styles.summary}>
          <div>
            <span>Total Amount</span>

            <strong>₹{order.totalAmount}</strong>
          </div>

          <div>
            <span>Payment Method</span>

            <strong>{order.paymentMethod}</strong>
          </div>
        </div>

        {/* Update Section */}

        <div className={styles.updateSection}>
          <div>
            <label>Order Status</label>

            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>

              <option value="Confirmed">Confirmed</option>

              <option value="Packed">Packed</option>

              <option value="Shipped">Shipped</option>

              <option value="Delivered">Delivered</option>

              <option value="Cancelled">Cancelled</option>

              <option value="Returned">Returned</option>
            </select>
          </div>

          <div>
            <label>Payment Status</label>

            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>

              <option value="Paid">Paid</option>

              <option value="Failed">Failed</option>

              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.updateBtn}
            onClick={UpdateOrder}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Order"}
          </button>

          <button className={styles.closeActionBtn} onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
