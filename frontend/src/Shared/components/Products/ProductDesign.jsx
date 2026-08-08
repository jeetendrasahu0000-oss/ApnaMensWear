// import React from 'react'
// import style from './ProductDesign.module.css'

// const ProductDesign = () => {
//   return (
//     <div>ProductDesign</div>
//   )
// }

// export default ProductDesign




import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './ProductDesign.module.css';

const ProductDesign = ({ product }) => {
  const navigate = useNavigate();

  const totalStock = product.variants?.reduce(
    (total, variant) => total + variant.stock,
    0
  );

  const discountPercentage = Math.round(
    ((product.price - product.salePrice) / product.price) * 100
  );

  const handleClick = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <div
      className={style.card}
      onClick={handleClick}
    >
      <div className={style.imageContainer}>
        <img
          src={product.coverImage?.url}
          alt={product.productName}
          className={style.image}
        />

        {/* {discountPercentage > 0 && (
          <span className={style.discountBadge}>
            {discountPercentage}% OFF
          </span>
        )} */}
      </div>

      <div className={style.content}>
        <h3 className={style.productName}>
          {product.productName}
        </h3>

        <p className={style.brand}>
          {product.brand}
        </p>

        <div className={style.priceBox}>
          <span className={style.salePrice}>
            ₹{product.salePrice}
          </span>

          <span className={style.originalPrice}>
            ₹{product.price}
          </span>
        </div>

        <span
          className={
            totalStock > 0
              ? style.inStock
              : style.outOfStock
          }
        >
          {totalStock > 0
            ? 'In Stock'
            : 'Out Of Stock'}
        </span>
      </div>
    </div>
  );
};

export default ProductDesign;





// import React from "react";
// import { useNavigate } from "react-router-dom";
// import style from "./ProductDesign.module.css";

// const ProductDesign = ({ product }) => {
//   const navigate = useNavigate();

//   const totalStock =
//     product.variants?.reduce(
//       (total, variant) =>
//         total + variant.stock,
//       0
//     ) || 0;

//   const discountPercentage = Math.round(
//     ((product.price -
//       product.salePrice) /
//       product.price) *
//       100
//   );

//   const handleClick = () => {
//     navigate(
//       `/product/${product.slug}`
//     );
//   };

//   return (
//     <div
//       className={style.card}
//       onClick={handleClick}
//     >
//       <div
//         className={
//           style.imageContainer
//         }
//       >
//         <img
//           src={product.coverImage}
//           alt={product.productName}
//           className={style.image}
//         />

//         {discountPercentage >
//           0 && (
//           <span
//             className={
//               style.discountBadge
//             }
//           >
//             {discountPercentage}% OFF
//           </span>
//         )}

//         <div
//           className={
//             style.overlay
//           }
//         >
//           <button
//             className={
//               style.viewButton
//             }
//           >
//             View Details
//           </button>
//         </div>
//       </div>

//       <div className={style.content}>
//         <p className={style.brand}>
//           {product.brand}
//         </p>

//         <h3
//           className={
//             style.productName
//           }
//         >
//           {product.productName}
//         </h3>

//         <div
//           className={
//             style.priceBox
//           }
//         >
//           <span
//             className={
//               style.salePrice
//             }
//           >
//             ₹{product.salePrice}
//           </span>

//           <span
//             className={
//               style.originalPrice
//             }
//           >
//             ₹{product.price}
//           </span>
//         </div>

//         <div
//           className={
//             style.footer
//           }
//         >
//           <span
//             className={
//               totalStock > 0
//                 ? style.inStock
//                 : style.outOfStock
//             }
//           >
//             {totalStock > 0
//               ? "In Stock"
//               : "Out Of Stock"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDesign;

