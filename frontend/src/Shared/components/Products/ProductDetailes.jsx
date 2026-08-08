import React, { useState, useMemo, useEffect } from "react";
import style from "./ProductDetailes.module.css";
import api from "../../../Api/Axios";
import { useParams } from "react-router-dom";
import AddToCart from "../CartComponents/AddToCart";
import CreateOrder from "../Order/CreateOrder";



const ProductDetailes = () => {

  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [createOrderOpen, setCreateOrderOpen] = useState(false)


  useEffect(() => {

    let mounted = true;

    const fetchProductDetailes = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/v1/products/details/${slug}`);

        if (mounted) {
          setProduct(response.data.data);
        }
      } 
      catch (error) {
        console.log("failed to fetch product details", error.message);
      } 
      finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchProductDetailes();
    }

    return () => {mounted = false;};

  }, [slug]);


  useEffect(() => {
    if (!product) return;

    const imageList = [product.coverImage, ...(product.images || [])].filter(Boolean,);

    setActiveImage(imageList[0] || "");

    if (product.variants?.length > 0) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
    }

    setQuantity(1);
  }, [product]);

  // IMPORTANT: Never place hooks below conditional returns

  const {
    _id,
    productName,
    shortDescription,
    description,
    brand,
    category,
    subCategory,
    price,
    salePrice,
    coverImage,
    images = [],
    variants = [],
    tags = [],
  } = product || {};

  const allImages = [coverImage, ...images].filter(Boolean);

  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color))],
    [variants],
  );

  const sizesForColor = useMemo(
    () => variants.filter((v) => v.color === selectedColor),
    [variants, selectedColor],
  );

  const selectedVariant = useMemo(
    () => variants.find((v) => v.color === selectedColor && v.size === selectedSize,),
    [variants, selectedColor, selectedSize],
  );

  const inStock = selectedVariant?.stock > 0;

  const maxStock = selectedVariant?.stock || 0;

  const discountPercent =price && salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const firstVariant = variants.find((v) => v.color === color);
    setSelectedSize(firstVariant?.size || "");
    setQuantity(1);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxStock) return maxStock;
      return next;
    });
  };




  const handleAddToCart = async() => {
    try{
       const CartPayload = {
          productId: product._id,
          variantId: selectedVariant?._id,
          quantity:quantity
        }

        const response = await api.post('/v1/cart/add',CartPayload)

        if(response.data.success){
          alert('Product Add To Cart')
        }

    }
    catch(error){
      console.log('failed to add to cart ',error.response)
      alert(`${error.response.data.message}`)
    }
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    console.log('seting open true')
    setCreateOrderOpen(true)
  };

  // AFTER ALL HOOKS

  if (loading) {
    return <div className={style.loading}>Loading...</div>;
  }

  if (!product) {
    return <div className={style.error}>Product not found</div>;
  }

  return (
    <div className={style.container}>
      {/* Images Section */}
      <div className={style.imageSection}>
        <div className={style.mainImageWrapper}>
          <img
            src={
              activeImage?.url || "https://via.placeholder.com/600x600?text=No+Image"
            }
            alt={productName}
            className={style.mainImage}
          />
        </div>

        <div className={style.thumbnailRow}>
          {allImages.map((image, index) => (
            <img
              key={index}
              src={image?.url}
              alt={`${productName}-${index}`}
              className={`${style.thumbnail} ${
                activeImage === image ? style.thumbnailActive : ""
              }`}
              onClick={() => setActiveImage(image)}
            />
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className={style.detailsSection}>

        <h1 className={style.productName}>{productName}</h1>
        <p className={style.brand}>{brand}</p>

        <p className={style.categoryPath}>
          {category} / {subCategory}
        </p>

        <p className={style.shortDescription}>{shortDescription}</p>

        {/* Price */}
        <div className={style.priceRow}>
          {salePrice ? (
            <>
              <span className={style.salePrice}>₹{salePrice}</span>

              <span className={style.mrp}>₹{price}</span>

              <span className={style.discount}>{discountPercent}% OFF</span>
            </>
          ) : (
            <span className={style.salePrice}>₹{price}</span>
          )}
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className={style.optionGroup}>
            <p className={style.optionLabel}>Color: {selectedColor}</p>

            <div className={style.optionRow}>
              {colors.map((color) => (
                <button
                  key={color}
                  className={`${style.colorSwatch} ${
                    selectedColor === color ? style.optionActive : ""
                  }`}
                  onClick={() => handleColorChange(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizesForColor.length > 0 && (
          <div className={style.optionGroup}>
            <p className={style.optionLabel}>Size: {selectedSize}</p>

            <div className={style.optionRow}>
              {sizesForColor.map((variant) => (
                <button
                  key={variant._id}
                  disabled={variant.stock === 0}
                  className={`${style.sizeBox} ${
                    selectedSize === variant.size ? style.optionActive : ""
                  } ${variant.stock === 0 ? style.optionDisabled : ""}`}
                  onClick={() => {
                    setSelectedSize(variant.size);
                    setQuantity(1);
                  }}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock */}
        <p className={inStock ? style.inStock : style.outOfStock}>
          {selectedVariant
            ? inStock
              ? `In Stock (${maxStock} available)`
              : "Out Of Stock"
            : "Select Variant"}
        </p>

        {/* Quantity */}
        {inStock && (
          <div className={style.quantityRow}>
            <span className={style.optionLabel}>Quantity</span>

            <div className={style.quantityControl}>
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxStock}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={style.actionRow}>
          <button
            className={style.addToCartBtn}
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

          <button
            className={style.buyNowBtn}
            disabled={!inStock}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>

        {/* Description */}
        <div className={style.descriptionSection}>
          <h3>Description</h3>
          <p className={style.description}>{description}</p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className={style.tagRow}>
            {tags.map((tag) => (
              <span key={tag} className={style.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {createOrderOpen && <CreateOrder products={[
        { 
          product,
          quantity: quantity,
          selectedVariant: {
            color: selectedColor,
            size: selectedSize
          }
        }
      ]} onClose={()=>{setCreateOrderOpen(false)}}></CreateOrder>}
      
    </div>
  );
};

export default ProductDetailes;
