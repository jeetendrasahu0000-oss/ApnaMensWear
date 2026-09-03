// CategoryWiseProducts.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./CategoryWiseProducts.module.css";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const STAGGER_DELAY = 150; // har product ke beech gap (ms)

const CategoryWiseProducts = ({ category, limit = 10 }) => {

  const navigate = useNavigate();
  const [visibleProducts, setVisibleProducts] = useState([]); // staggered reveal
  const [loading, setLoading] = useState(true);
  const [hasProducts, setHasProducts] = useState(true); // avoid flash of "null" before first fetch resolves

  const staggerTimeouts = useRef([]);
  const requestIdRef = useRef(0); // stale fetch calls ko ignore karne ke liye

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const revealStaggered = (batch, requestId) => {
    batch.forEach((product, i) => {
      const timeoutId = setTimeout(() => {
        // agar iske beech mein koi naya fetch shuru ho chuka hai, to ye purana batch add na ho
        if (requestIdRef.current !== requestId) return;
        setVisibleProducts((prev) => [...prev, product]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  const fetchProducts = async () => {
    const currentRequestId = ++requestIdRef.current; // is fetch ka unique id

    try {
      setLoading(true);
      clearStaggerTimeouts();
      setVisibleProducts([]);

      const response = await api.get(
        `/v1/products/category/${category}?limit=${limit}&page=1`
      );

      // agar iske beech koi naya fetch shuru ho gaya (StrictMode remount / category change), to ye result discard karo
      if (requestIdRef.current !== currentRequestId) return;

      const fetched = response.data.data.products || [];

      setHasProducts(fetched.length > 0);

      if (fetched.length > 0) {
        revealStaggered(fetched, currentRequestId);
      }
    } catch (error) {
      if (requestIdRef.current !== currentRequestId) return;
      console.log("Failed to fetch products", error);
      setHasProducts(false);
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();

    return () => {
      // is effect instance ko "cancel" kar do — StrictMode ke double-invoke se bachne ke liye
      requestIdRef.current += 1;
      clearStaggerTimeouts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // ---------------- Skeleton card ----------------
  const SkeletonCard = ({ delay = 0 }) => (
    <div className={styles.skeletonItem} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonLine} style={{ width: "80%" }} />
      <div className={styles.skeletonLine} style={{ width: "50%" }} />
    </div>
  );

  // ---------------- Skeleton loading state ----------------
  if (loading && visibleProducts.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.heading}>{category}</h2>
        </div>
        <div className={styles.productRow}>
          {Array.from({ length: Math.min(limit, 6) }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 60} />
          ))}
        </div>
      </section>
    );
  }

  // agar fetch complete ho chuka hai aur products nahi hain, to poora section hide
  if (!loading && !hasProducts) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{category}</h2>
        <h3 onClick={() => { navigate(`/filtered/${category}`); }}>
          View All <FaArrowRight />
        </h3>
      </div>

      <div className={styles.productRow}>
        {visibleProducts.map((product) => (
          <div key={product._id} className={styles.productItem}>
            <ProductDesign product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryWiseProducts;