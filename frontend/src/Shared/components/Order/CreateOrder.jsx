import React, { useMemo, useState } from "react";
import styles from "./CreateOrder.module.css";
import api from "../../../Api/Axios";
import { loadRazorpay } from "../../../Utils/RazorpayUtils";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";




const CreateOrder = ({ products = [], onClose }) => {

  const [addressType, setAddressType] = useState("saved");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [user,setUser] = useState({})
  const [verifiedPaymentInfo,setVerifiedPaymentInfo] = useState({})
  const navigate = useNavigate()

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

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))

    if(addressType === 'saved' && user){
      ;
      setShippingAddress(
        {
          fullName: user.firstName+" "+user.lastName ,
          phone:user.phone,
          addressLine1:user.address.addressLine1,
          addressLine2: user.address.addressLine2,
          city: user.address.city,
          state:user.address.state,
          postalCode:user.address.pinCode,
          country: user.address.country,
        }
      )
      setUser(user)
    }
  },[])

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

  const HandleCreateOrder = async (paymentId) => {

    console.log(paymentId)

    const payload = {
      products: products.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
      })),

      paymentId:paymentId,
      addressType,
      shippingAddress:shippingAddress,
      paymentMethod,
    };

    console.log("Order Payload =>", payload);

    try{
      const response = await api.post('/v1/order/create',payload)
      
      if(response.status){
        console.log('response')
        alert(response.data.message)
        return true
      }
    }
    catch(error){
      console.log('failed to create order ',error)
      alert(error.response.data.message)
      console.log('comming error response =>',error.response.data)
      return false
    }
};

  const CreateOrderInRazorpay = async()=>{
     try{
      console.log('Call CreateOrderInRazorpay api..')

      const payload= {products:products}
      console.log('payload =',payload)

      const response = await api.post('/v1/payment/create-order',payload)
      
      if(response.data.success){
        console.log('successfully create order =>',response.data)
        return response.data.data
      }
    }
    catch(error){
      console.log('failed to handel CreateOrderInRazorpay',error)
      return null
    }
  }

  const HandlePaymentSuccess =async(paymentData)=>{
     try{
      console.log('Call HandlePaymentSuccess api..')

      console.log('comming response for verification ',paymentData)

      const response = await api.post('/v1/payment/verify',paymentData)
      
      if(response.data.success && response.data.data.isVerified){
        console.log('successfully create order =>',response.data)
        if(response.data.data.isVerified){
          const result = await HandleCreateOrder(response.data.data.paymentId)
          if(!result){
            alert(`Payment successful.We received your payment, but we're having trouble creating your order.Our team will process it shortly.`)
            navigate('/contact')
            return
          }
          alert('payment successfully done  and order created...')
          console.log('Before navigate');
          navigate('/order');
          console.log('After navigate');
          alert('After navigate')
          return
        }
      }
    }
    catch(error){
      console.log('failed to handel HandlePaymentSuccess',error)
      return null
    }
  }

  const HandlePlaceOrder = async () => {
    try{
      console.log('HandlePlaceOrder')

      const razorpayOrderData = await CreateOrderInRazorpay()

      const loaded = await loadRazorpay()

      if(!loaded){
        alert("Failed to load Razorpay");
        return;
      }

      const options = {

        key: import.meta.env.VITE_RAZORPAY_KEY,

        name: "Apna Mens Wear",
        description: "Order Payment",
        // image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZz72QrjVtlo40v1Z-KjdzXGusjChm4qH9wA9pI_EmXE2sn5j7FwpArJWH&s=10",

        order_id:razorpayOrderData.razorpayOrderId,
        amount:razorpayOrderData.amount,
        currency:razorpayOrderData.currency,



        handler:HandlePaymentSuccess

      };

      const razorpay =new window.Razorpay(options);

      razorpay.open();

    }
    catch(error){
      console.log('fialed to handel HandlePlaceOrder')
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

              {/* <label className={styles.radio}>
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash On Delivery
              </label> */}

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



// logo for ApnaMensWear


