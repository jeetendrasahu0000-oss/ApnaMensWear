// import React, { useEffect, useState } from "react";
// import api from "../../../Api/Axios";
// import styles from "./ViewCartProduct.module.css";
// import CreateOrder from "../Order/CreateOrder";

// const ViewCartProduct = ({ onClose }) => {

//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [removeItem, setRemoveItem] = useState(null);
//   const [removing, setRemoving] = useState(false);

//   const [createOrderOpen, setCreateOrderOpen] = useState(false)
//   const [selectedProduct,setSelectedProduct] = useState({})

//   useEffect(() => {
//     GetCartProducts();
//   }, []);

//   const GetCartProducts = async () => {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/v1/cart");

//       if (data.success) {
//         console.log('api comming data for cart => ',data.data)
//         setCartItems(data.data?.items || []);
//       }
//     } catch (error) {
//       console.log(error);

//       setError(
//         error.response?.data?.message || "Failed to fetch cart products",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const HandleRemove = async (variantId) => {
//     try {
//       setRemoving(true);

//       const { data } = await api.delete(`/v1/cart/remove/${variantId}`);

//       if (data.success) {
//         alert(data.message)
//         setCartItems((prev) =>
//           prev.filter((item) => item.variantId !== variantId),
//         );

//         setRemoveItem(null);
//       }
//     }
//     catch (error) {
//       alert(error.response?.data?.message || "Failed to remove item");
//     }
//     finally {
//       setRemoving(false);
//     }
//   };

//   const HandleBuyNow = (item) => {
//     setSelectedProduct(prev=>item)
//     setCreateOrderOpen(true)
//   };

//   // console.log('cart',cartItems)

//   return (
//     <div className={styles.overlay} onClick={onClose}>
//       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.header}>
//           <h2 className={styles.heading}>My Cart</h2>

//           <button className={styles.closeBtn} onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         {loading && <div className={styles.loading}>Loading Cart...</div>}

//         {error && <div className={styles.error}>{error}</div>}

//         {!loading && !error && cartItems.length === 0 && (
//           <div className={styles.empty}>Your cart is empty</div>
//         )}

//         {!loading && !error && cartItems.length > 0 && (

//           <div className={styles.products}>

//             {cartItems.map((item) => {
//               const product = item.productId;
//               // console.log('item = >', item)
//               const selectedVariant = product.variants.find(
//                 (variant) =>
//                   variant._id.toString() === item.variantId.toString(),
//               );

//               return (
//                 <div key={item._id} className={styles.card}>

//                   <div className={styles.imageWrapper}>
//                     <img
//                       src={product.coverImage.url}
//                       alt={product.productName}
//                       className={styles.image}
//                     />
//                   </div>

//                   <div className={styles.content}>
//                     <h3 className={styles.productName}>
//                       {product.productName}
//                     </h3>

//                     <div className={styles.variantInfo}>
//                       <span>Color: {selectedVariant?.color}</span>

//                       <span>Size: {selectedVariant?.size}</span>
//                     </div>

//                     <div className={styles.priceRow}>
//                       <span className={styles.salePrice}>
//                         ₹{product.salePrice}
//                       </span>

//                       <span className={styles.price}>₹{product.price}</span>
//                     </div>

//                     <div className={styles.quantity}>
//                       Quantity: {item.quantity}
//                     </div>

//                     <div className={styles.total}>
//                       Total: ₹{product.salePrice * item.quantity}
//                     </div>

//                     <div className={styles.actions}>
//                       <button
//                         className={styles.buyBtn}
//                         onClick={() => HandleBuyNow(item)}
//                       >
//                         Buy Now
//                       </button>

//                       <button
//                         className={styles.removeBtn}
//                         onClick={() => setRemoveItem(item)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {removeItem && (
//           <div className={styles.confirmOverlay}>
//             <div className={styles.confirmBox}>
//               <h3>Remove Product</h3>

//               <p>Are you sure you want to remove this item from your cart?</p>

//               <div className={styles.confirmActions}>
//                 <button
//                   className={styles.cancelBtn}
//                   onClick={() => setRemoveItem(null)}
//                   disabled={removing}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   className={styles.confirmRemoveBtn}
//                   onClick={() => HandleRemove(removeItem.variantId)}
//                   disabled={removing}
//                 >
//                   {removing ? "Removing..." : "Remove"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {createOrderOpen && <CreateOrder products={[
//             {
//               product:selectedProduct.productId,
//               quantity: selectedProduct.quantity,
//               selectedVariant: selectedProduct.productId.variants.find(item => item._id.toString() === selectedProduct.variantId.toString())
//             }
//           ]} onClose={()=>{setCreateOrderOpen(false) }}  />
//         }
//       </div>
//     </div>
//   );
// };

// export default ViewCartProduct;

import React, { useEffect, useState } from "react";
import api from "../../../Api/Axios";
import styles from "./ViewCartProduct.module.css";
import CreateOrder from "../Order/CreateOrder";

const ViewCartProduct = ({ onClose }) => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removeItem, setRemoveItem] = useState(null);
  const [removing, setRemoving] = useState(false);

  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    GetCartProducts();
  }, []);

  const GetCartProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/v1/cart");

      if (data.success) {
        setCartItems(data.data?.items || []);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch cart products",
      );
    } finally {
      setLoading(false);
    }
  };

  const HandleRemove = async (variantId) => {
    try {
      setRemoving(true);

      const { data } = await api.delete(`/v1/cart/remove/${variantId}`);

      if (data.success) {
        alert(data.message);

        setCartItems((prev) =>
          prev.filter((item) => item.variantId !== variantId),
        );

        setRemoveItem(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item");
    } finally {
      setRemoving(false);
    }
  };

  const HandleBuyNow = (item) => {
    const selectedVariant = item.productId.variants.find(
      (variant) => variant._id.toString() === item.variantId.toString(),
    );

    setOrderProducts([
      {
        product: item.productId,
        quantity: item.quantity,
        selectedVariant,
      },
    ]);

    setCreateOrderOpen(true);
  };

  const HandleBuyAll = () => {
    const products = cartItems.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      selectedVariant: item.productId.variants.find(
        (variant) => variant._id.toString() === item.variantId.toString(),
      ),
    }));

    setOrderProducts(products);
    setCreateOrderOpen(true);
  };

  const totalProducts = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total +
      (item.productId.salePrice || item.productId.price) * item.quantity,
    0,
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.heading}>My Cart</h2>

          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {loading && <div className={styles.loading}>Loading Cart...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && cartItems.length === 0 && (
          <div className={styles.empty}>Your cart is empty</div>
        )}

        {!loading && !error && cartItems.length > 0 && (
          <>
            
            <div className={styles.products}>
              {cartItems.map((item) => {
                const product = item.productId;

                const selectedVariant = product.variants.find(
                  (variant) =>
                    variant._id.toString() === item.variantId.toString(),
                );

                return (
                  <div key={item._id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={product.coverImage.url}
                        alt={product.productName}
                        className={styles.image}
                      />
                    </div>

                    <div className={styles.content}>
                      <h3 className={styles.productName}>
                        {product.productName}
                      </h3>

                      <div className={styles.variantInfo}>
                        <span>Color: {selectedVariant?.color}</span>

                        <span>Size: {selectedVariant?.size}</span>
                      </div>

                      <div className={styles.priceRow}>
                        <span className={styles.salePrice}>
                          ₹{product.salePrice}
                        </span>

                        <span className={styles.price}>₹{product.price}</span>
                      </div>

                      <div className={styles.quantity}>
                        Quantity: {item.quantity}
                      </div>

                      <div className={styles.total}>
                        Total: ₹{product.salePrice * item.quantity}
                      </div>

                      <div className={styles.actions}>
                        <button
                          className={styles.buyBtn}
                          onClick={() => HandleBuyNow(item)}
                        >
                          Buy Now
                        </button>

                        <button
                          className={styles.removeBtn}
                          onClick={() => setRemoveItem(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryCard}>
                <span>Total Products</span>
                <strong>{totalProducts}</strong>
              </div>

              <div className={styles.summaryCard}>
                <span>Total Amount</span>
                <strong>₹{totalAmount}</strong>
              </div>

              <button className={styles.buyAllBtn} onClick={HandleBuyAll}>
                Buy All
              </button>
            </div>
            
          </>
        )}


        {removeItem && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmBox}>
              <h3>Remove Product</h3>

              <p>Are you sure you want to remove this item from your cart?</p>

              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setRemoveItem(null)}
                  disabled={removing}
                >
                  Cancel
                </button>

                <button
                  className={styles.confirmRemoveBtn}
                  onClick={() => HandleRemove(removeItem.variantId)}
                  disabled={removing}
                >
                  {removing ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        )}

        {createOrderOpen && (
          <CreateOrder
            products={orderProducts}
            onClose={() => setCreateOrderOpen(false)}
          />
        )}

      </div>
    </div>
  );
};

export default ViewCartProduct;
