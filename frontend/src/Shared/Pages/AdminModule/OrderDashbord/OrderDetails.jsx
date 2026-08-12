import React, { useState } from "react";
import api from "../../../../Api/Axios";
import styles from "./OrderDetails.module.css";



const OrderDetails = ({ order, onClose, refreshOrders }) => {

  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({
      length: 20,
      breadth: 20,
      height: 5,
      weight: 0.5,
  });
  const orderSteps = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

  const currentStep = orderSteps.indexOf(orderStatus);

  const UpdateOrder = async () => {
    try {
      setLoading(true);
      const payload = {orderStatus};

      if (orderStatus === "Packed") {
        payload.dimensions = dimensions;
      }

      const [orderRes, paymentRes] = await Promise.allSettled([
        api.post(`/v1/order/admin/status/${order._id}`, payload),
      ]);

      console.log("orderRes", orderRes);
      if (orderRes.value.data.success) {
        alert("Order updated successfully");
        refreshOrders();
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order");
      console.log("error=>", error);
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
        {/* 



        {/* Order Information */}

        <div className={styles.section}>
          <h3>Order Information</h3>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <strong>Order ID</strong>
              <p>{order._id}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Order Number</strong>
              <p>{order.orderNumber}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>User ID</strong>
              <p>{order.user}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Order Status</strong>
              <p>{order.orderStatus}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Placed At</strong>
              <p>{new Date(order.placedAt).toLocaleString()}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Created At</strong>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Updated At</strong>
              <p>{new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}

        <div className={styles.section}>
          <h3>Payment Information</h3>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <strong>Payment ID</strong>
              <p>{order.paymentId}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Payment Method</strong>
              <p>{order.paymentMethod}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Payment Status</strong>

              <span
                className={`${styles.statusBadge} ${
                  styles[order.paymentStatus?.toLowerCase()]
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Amount Details */}

        <div className={styles.section}>
          <h3>Amount Details</h3>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <strong>Subtotal</strong>
              <p>₹{order.subtotal}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Shipping Charge</strong>
              <p>₹{order.shippingCharge}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Discount</strong>
              <p>₹{order.discount}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Total Amount</strong>
              <p>₹{order.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* Shiprocket Information */}

        <div className={styles.section}>
          <h3>Shipping Information</h3>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <strong>Shiprocket Order ID</strong>

              <p>{order?.shipping?.shiprocketOrderId || "Not Created"}</p>
            </div>

            <div className={styles.infoCard}>
              <strong>Shipment ID</strong>

              <p>{order?.shipping?.shipmentId || "Not Created"}</p>
            </div>
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
        </div>

        {orderStatus === "Packed" && (
          <div className={styles.dimensionSection}>
            <h4>Package Dimensions</h4>

            <div className={styles.dimensionGrid}>
              <div>
                <label>Length (cm)</label>

                <input
                  type="number"
                  min="1"
                  value={dimensions.length}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      length: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label>Breadth (cm)</label>

                <input
                  type="number"
                  min="1"
                  value={dimensions.breadth}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      breadth: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label>Height (cm)</label>

                <input
                  type="number"
                  min="1"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      height: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label>Weight (kg)</label>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={dimensions.weight}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      weight: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}

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
