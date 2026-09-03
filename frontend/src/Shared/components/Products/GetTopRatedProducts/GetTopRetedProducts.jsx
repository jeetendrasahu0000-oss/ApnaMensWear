// GetTopRetedProducts.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../../../Api/Axios';
import ProductDesign from '../ProductDesign';
import styles from './GetTopRetedProducts.module.css';

const LIMIT = 10;
const STAGGER_DELAY = 150;
const SCROLL_THROTTLE = 300;
const SCROLL_THRESHOLD = 200;

const GetTopRetedProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const isFetchingRef = useRef(false);
  const throttleRef = useRef(null);
  const staggerTimeouts = useRef([]);
  const fetchedPagesRef = useRef(new Set()); // Track which pages are already fetched
  const currentPageRef = useRef(1); // Track current page without closure issues

  // ---------------- Fetch products ----------------
  const fetchProducts = useCallback(async (pageNum, isInitial = false) => {
    // Check if this page is already fetched
    if (fetchedPagesRef.current.has(pageNum)) {
      console.log(`Page ${pageNum} already fetched, skipping...`);
      return;
    }

    if (isFetchingRef.current) {
      console.log('Already fetching, skipping...');
      return;
    }

    isFetchingRef.current = true;
    fetchedPagesRef.current.add(pageNum);

    try {
      isInitial ? setInitialLoading(true) : setLoadingMore(true);

      const response = await api.get('/v1/products/top-rated', {
        params: { page: pageNum, limit: LIMIT },
      });

      const raw = response?.data?.products || response?.data?.data || response?.data || [];
      const newProducts = Array.isArray(raw) ? raw : [];

      // Filter out duplicates based on product _id
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...uniqueNewProducts];
      });

      // Only reveal unique products
      setVisibleProducts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...uniqueNewProducts];
      });

      const backendHasMore = response?.data?.hasMore;
      const computedHasMore =
        typeof backendHasMore === 'boolean' ? backendHasMore : newProducts.length === LIMIT;

      setHasMore(computedHasMore);
      setError(null);
    } catch (err) {
      console.error('Error fetching top rated products:', err);
      setError('Failed to load products. Please try again later.');
      if (isInitial) setProducts([]);
      // Remove from fetched pages if failed, so it can be retried
      fetchedPagesRef.current.delete(pageNum);
    } finally {
      isInitial ? setInitialLoading(false) : setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, []);

  // ---------------- Initial load ----------------
  useEffect(() => {
    currentPageRef.current = 1;
    fetchProducts(1, true);

    return () => {
      staggerTimeouts.current.forEach(clearTimeout);
      // Reset refs on unmount
      fetchedPagesRef.current.clear();
      isFetchingRef.current = false;
    };
  }, [fetchProducts]);

  // ---------------- Throttled scroll listener for infinite load ----------------
  useEffect(() => {
    const handleScroll = () => {
      if (throttleRef.current) return;

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
          const nextPage = currentPageRef.current + 1;
          currentPageRef.current = nextPage;
          setPage(nextPage);
          fetchProducts(nextPage, false);
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
    currentPageRef.current = 1;
    fetchedPagesRef.current.clear();
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

  // ---------------- Error state ----------------
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
        {visibleProducts.map((product) => (
          <div
            key={product?._id || `product-${Math.random()}`}
            className={styles.productItem}
          >
            <ProductDesign product={product} />
          </div>
        ))}

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