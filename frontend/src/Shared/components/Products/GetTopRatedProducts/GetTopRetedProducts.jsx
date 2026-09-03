// GetTopRetedProducts.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../../../Api/Axios';
import ProductDesign from '../ProductDesign';
import styles from './GetTopRetedProducts.module.css';

const LIMIT = 10;           // ek baar me kitne products load honge
const STAGGER_DELAY = 150;  // har product ke beech ka gap (ms)
const SCROLL_THROTTLE = 300; // scroll event throttle gap (ms)
const SCROLL_THRESHOLD = 200; // bottom se kitna door reh jaye to next batch fetch ho (px)

const GetTopRetedProducts = () => {
  const [products, setProducts] = useState([]);       // fetched but not yet revealed
  const [visibleProducts, setVisibleProducts] = useState([]); // actually rendered (staggered)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const isFetchingRef = useRef(false);   // guard against duplicate calls
  const throttleRef = useRef(null);      // throttle timer id
  const staggerTimeouts = useRef([]);    // to clear on unmount

  // ---------------- Fetch products ----------------
  const fetchProducts = useCallback(async (pageNum, isInitial = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      isInitial ? setInitialLoading(true) : setLoadingMore(true);

      const response = await api.get('/v1/products/top-rated', {
        params: { page: pageNum, limit: LIMIT },
      });

      const raw = response?.data?.products || response?.data?.data || response?.data || [];
      const newProducts = Array.isArray(raw) ? raw : [];

      // agar backend hasMore bhejta hai to wo use karo, warna length se andaza lagao
      const backendHasMore = response?.data?.hasMore;
      const computedHasMore =
        typeof backendHasMore === 'boolean' ? backendHasMore : newProducts.length === LIMIT;

      setHasMore(computedHasMore);
      setError(null);

      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        revealStaggered(newProducts);
      }
    } catch (err) {
      console.error('Error fetching top rated products:', err);
      setError('Failed to load products. Please try again later.');
      if (isInitial) setProducts([]);
    } finally {
      isInitial ? setInitialLoading(false) : setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, []);

  // ---------------- Stagger reveal (ek ek product delay se dikhana) ----------------
  const revealStaggered = (batch) => {
    batch.forEach((product, i) => {
      const timeoutId = setTimeout(() => {
        setVisibleProducts((prev) => [...prev, product]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  // ---------------- Initial load ----------------
  useEffect(() => {
    fetchProducts(1, true);

    return () => {
      staggerTimeouts.current.forEach(clearTimeout);
    };
  }, [fetchProducts]);

  // ---------------- Throttled scroll listener for infinite load ----------------
  useEffect(() => {
    const handleScroll = () => {
      if (throttleRef.current) return; // throttle: ek baar me ek hi call chalne do

      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;

        const scrollBottom = window.innerHeight + window.scrollY;
        const docHeight = document.documentElement.scrollHeight;

        if (
          docHeight - scrollBottom < SCROLL_THRESHOLD &&
          hasMore &&
          !isFetchingRef.current &&
          !initialLoading
        ) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchProducts(nextPage, false);
            return nextPage;
          });
        }
      }, SCROLL_THROTTLE);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleRef.current) clearTimeout(throttleRef.current);
    };
  }, [hasMore, initialLoading, fetchProducts]);

  const handleRetry = () => {
    setError(null);
    setProducts([]);
    setVisibleProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  };

  // ---------------- Skeleton card ----------------
  const SkeletonCard = ({ delay = 0 }) => (
    <div className={styles.skeletonCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonLine} style={{ width: '80%' }} />
      <div className={styles.skeletonLine} style={{ width: '55%' }} />
      <div className={styles.skeletonLine} style={{ width: '40%', height: '18px', marginTop: '8px' }} />
    </div>
  );

  // ---------------- Initial loading -> skeleton grid ----------------
  if (initialLoading && visibleProducts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>⭐ Featured Products</h2>
          <p className={styles.subtitle}>Top rated products loved by our customers</p>
        </div>
        <div className={styles.productGrid}>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 60} />
          ))}
        </div>
      </div>
    );
  }

  // ---------------- Error state (only when nothing loaded yet) ----------------
  if (error && visibleProducts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={handleRetry} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ---------------- Empty state ----------------
  if (!initialLoading && visibleProducts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No top rated products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>⭐ Featured Products</h2>
        <p className={styles.subtitle}>Top rated products loved by our customers</p>
      </div>

      <div className={styles.productGrid}>
        {visibleProducts.map((product, index) => (
          <div
            key={product?._id || index}
            className={styles.productItem}
            style={{ animationDelay: `${(index % LIMIT) * 0.08}s` }}
          >
            <ProductDesign product={product} />
          </div>
        ))}

        {/* Jab agla batch load ho raha ho tab skeleton cards dikhao */}
        {loadingMore &&
          Array.from({ length: LIMIT }).map((_, i) => (
            <SkeletonCard key={`loading-${i}`} delay={i * 60} />
          ))}
      </div>

      {!hasMore && visibleProducts.length > 0 && (
        <p className={styles.endMessage}>You've seen all our top rated products 🎉</p>
      )}

      {error && visibleProducts.length > 0 && (
        <div className={styles.inlineError}>
          <p>{error}</p>
          <button onClick={handleRetry} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GetTopRetedProducts;