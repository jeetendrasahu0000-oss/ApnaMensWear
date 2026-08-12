import React, { useEffect, useState } from "react";
import { FiPackage, FiEye } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/Axios";
import styles from "./MyOrder.module.css";




const MyOrder = () => {

  console.log("Order component mounted");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    GetOrders();
  }, []);

  const GetOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/v1/order");

      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const HandleTrackOrder = (order) => {
    console.log("Track Order", order);
    // navigate(`/track-order/${order._id}`)
  };

  const HandleViewDetails = (order) => {
    console.log("View Details", order);
    // navigate(`/order/${order._id}`)
  };

  const HandleCancelOrder = async (order) => {
    try {
      const confirmCancel = window.confirm(
        `Cancel Order ${order.orderNumber}?`
      );

      if (!confirmCancel) return;

      // await api.patch(`/v1/order/cancel/${order._id}`);

      alert("Cancel order API call here");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.stateContainer}>
        Loading Orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className={styles.stateContainer}>
        <FiPackage size={50} />

        <h3>No Orders Found</h3>

        <p>
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2>My Orders</h2>

        <span>
          {orders.length} Order
          {orders.length > 1 ? "s" : ""}
        </span>
      </div>

      {orders.map((order) => (
        <div
          key={order._id}
          className={styles.orderCard}
        >
          {/* Order Header */}

          <div className={styles.orderHeader}>
            <div>
              <h4>{order.orderNumber}</h4>

              <p>
                {new Date(
                  order.placedAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className={styles.orderMeta}>
              <span
                className={`${styles.badge} ${
                  styles[
                    order.orderStatus?.toLowerCase()
                  ]
                }`}
              >
                {order.orderStatus}
              </span>

              <span
                className={styles.paymentBadge}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Products */}

          <div className={styles.products}>
            {order.items.map((item, index) => (
              <div
                key={index}
                className={styles.productCard}
                onClick={() =>
                  navigate(
                    `/product/${item.product}`
                  )
                }
              >
                <img
                  src={item.coverImage.url}
                  alt={item.productName}
                  className={styles.productImage}
                />

                <div
                  className={styles.productInfo}
                >
                  <h5>{item.productName}</h5>

                  <div
                    className={
                      styles.variantRow
                    }
                  >
                    <span>
                      Color:{" "}
                      {
                        item
                          .selectedVariant
                          ?.color
                      }
                    </span>

                    <span>
                      Size:{" "}
                      {
                        item
                          .selectedVariant
                          ?.size
                      }
                    </span>
                  </div>

                  <div
                    className={
                      styles.productBottom
                    }
                  >
                    <span>
                      Qty: {item.quantity}
                    </span>

                    <strong>
                      ₹
                      {
                        item.priceAtPurchase
                      }
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}

          <div className={styles.summary}>
            <div>
              <span>Total</span>

              <strong>
                ₹{order.totalAmount}
              </strong>
            </div>

            <div>
              <span>Payment</span>

              <strong>
                {order.paymentMethod}
              </strong>
            </div>

            <div>
              <span>Items</span>

              <strong>
                {order.items.length}
              </strong>
            </div>
          </div>

          {/* Delivery */}

          <div className={styles.deliveryInfo}>
            Deliver to{" "}
            <strong>
              {
                order.shippingAddress
                  .fullName
              }
            </strong>{" "}
            •{" "}
            {order.shippingAddress.city},{" "}
            {
              order.shippingAddress
                .state
            }
          </div>

          {/* Actions */}

          {/* <div className={styles.actions}>
            <button
              className={styles.trackBtn}
              onClick={() =>
                HandleTrackOrder(order)
              }
            >
              <TbTruckDelivery />
              Track
            </button>

            <button
              className={styles.detailsBtn}
              onClick={() =>
                HandleViewDetails(order)
              }
            >
              <FiEye />
              Details
            </button>

            {[
              "Pending",
              "Processing",
            ].includes(
              order.orderStatus
            ) && (
              <button
                className={
                  styles.cancelBtn
                }
                onClick={() =>
                  HandleCancelOrder(
                    order
                  )
                }
              >
                <MdOutlineCancel />
                Cancel
              </button>
            )}
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default MyOrder;



