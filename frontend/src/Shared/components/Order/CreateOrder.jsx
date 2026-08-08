import React, { useMemo, useState } from "react";
import styles from "./CreateOrder.module.css";
import api from "../../../Api/Axios";

const CreateOrder = ({ products = [], user = {}, onClose }) => {

  const [addressType, setAddressType] = useState("saved");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  console.log('comming product ',products)

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const subtotal = useMemo(() => {
    return products.reduce((total, item) => {
      const price =
        item.product?.salePrice > 0
          ? item.product.salePrice
          : item.product?.price || 0;

      return total + price * item.quantity;
    }, 0);
  }, [products]);

  const shippingCharge = 0;
  const totalAmount = subtotal + shippingCharge;

  const HandleChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandlePlaceOrder = async () => {

    const payload = {
      products: products.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
      })),

      addressType,
      shippingAddress:addressType === "saved" ? user?.address : shippingAddress,
      paymentMethod,
    };

    console.log("Order Payload =>", payload);

    try{
      const response = await api.post('/v1/order/create',payload)
      
      if(response.status){
        console.log('response')
        alert(response.data.message)
      }
    }
    catch(error){
      console.log('failed to create order ',error)
      console.log('comming error response =>',error.response.data)
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* HEADER*/}
        <div className={styles.header}>
          <h2>Checkout</h2>

          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* LEFT SECTION */}
          <div className={styles.leftSection}>
            {/* PRODUCTS */}
            <div className={styles.card}>
              <h3>Products ({products.length})</h3>

              <div className={styles.productList}>
                {products.map((item, index) => {
                  const price =
                    item.product?.salePrice > 0
                      ? item.product.salePrice
                      : item.product?.price;

                  return (
                    <div key={index} className={styles.productCard}>
                      <img
                        src={item.product?.coverImage?.url}
                        alt={item.product?.productName}
                      />

                      <div className={styles.productInfo}>
                        <h4>{item.product?.productName}</h4>

                        <p>Color: {item.selectedVariant?.color}</p>

                        <p>Size: {item.selectedVariant?.size}</p>

                        <p>Qty: {item.quantity}</p>

                        <h5>₹{price}</h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ADDRESS */}
            <div className={styles.card}>
              <h3>Delivery Address</h3>

              <div className={styles.addressSelector}>
                <label className={styles.addressOption}>
                  <input
                    type="radio"
                    checked={addressType === "saved"}
                    onChange={() => setAddressType("saved")}
                  />
                  Use Saved Address
                </label>

                <label className={styles.addressOption}>
                  <input
                    type="radio"
                    checked={addressType === "custom"}
                    onChange={() => setAddressType("custom")}
                  />
                  Use Custom Address
                </label>
              </div>

              {addressType === "saved" ? (
                <div className={styles.savedAddress}>
                  <h4>
                    {user?.firstName} {user?.lastName}
                  </h4>

                  <p>{user?.phone}</p>

                  <p>{user?.address?.addressLine1}</p>

                  {user?.address?.addressLine2 && (
                    <p>{user?.address?.addressLine2}</p>
                  )}

                  <p>
                    {user?.address?.city}, {user?.address?.state}
                  </p>

                  <p>{user?.address?.postalCode}</p>

                  <p>{user?.address?.country}</p>
                </div>
              ) : (
                <div className={styles.formGrid}>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={shippingAddress.fullName}
                    onChange={HandleChange}
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={shippingAddress.phone}
                    onChange={HandleChange}
                  />

                  <input
                    type="text"
                    name="addressLine1"
                    placeholder="Address Line 1"
                    value={shippingAddress.addressLine1}
                    onChange={HandleChange}
                  />

                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Address Line 2"
                    value={shippingAddress.addressLine2}
                    onChange={HandleChange}
                  />

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={HandleChange}
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={HandleChange}
                  />

                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={shippingAddress.postalCode}
                    onChange={HandleChange}
                  />

                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={HandleChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className={styles.rightSection}>
            {/* PAYMENT */}
            <div className={styles.card}>
              <h3>Payment Method</h3>

              <label className={styles.radio}>
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash On Delivery
              </label>

              <label className={styles.radio}>
                <input
                  type="radio"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                />
                Razorpay
              </label>
            </div>

            {/* SUMMARY */}
            <div className={styles.card}>
              <h3>Order Summary</h3>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>₹{shippingCharge}</span>
              </div>

              <div className={`${styles.summaryRow} ${styles.total}`}>
                <strong>Total</strong>

                <strong>₹{totalAmount}</strong>
              </div>

              <button
                className={styles.placeOrderBtn}
                onClick={HandlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
