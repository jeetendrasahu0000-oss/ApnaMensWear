// ProductDesign.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './ProductDesign.module.css';

const ProductDesign = ({ product }) => {
  const navigate = useNavigate();

  // Safe access with optional chaining and fallback
  const totalStock = product?.variants?.reduce(
    (total, variant) => total + (variant?.stock || 0),
    0
  ) || 0;

  // Safe discount calculation
  const discountPercentage = product?.price && product?.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleClick = () => {
    if (product?.slug) {
      navigate(`/product/${product.slug}`);
    }
  };

  // If product is missing, show nothing
  if (!product) {
    return null;
  }

  // Get image URL safely
  const imageUrl = product?.coverImage?.url || product?.coverImage || '';

  return (
    <div className={style.card} onClick={handleClick}>
      <div 
        className={style.imageContainer}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Gradient overlay from bottom - creates the shadow effect */}
        <div className={style.gradientOverlay}></div>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className={style.discountBadge}>
            {discountPercentage}% OFF
          </span>
        )}

        {/* Content overlay on image */}
        <div className={style.content}>
          <h3 className={style.productName}>
            {product?.productName || 'Product'}
          </h3>
          
          <p className={style.brand}>
            {product?.brand || ''}
          </p>

          <div className={style.priceBox}>
            <span className={style.salePrice}>
              ₹{product?.salePrice || 0}
            </span>
            {product?.price && product?.price > (product?.salePrice || 0) && (
              <span className={style.originalPrice}>
                ₹{product?.price || 0}
              </span>
            )}
          </div>

          <span className={totalStock > 0 ? style.inStock : style.outOfStock}>
            {totalStock > 0 ? 'In Stock' : 'Out Of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDesign;