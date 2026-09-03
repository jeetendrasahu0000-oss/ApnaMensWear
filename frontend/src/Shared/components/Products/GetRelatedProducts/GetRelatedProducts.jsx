// GetRelatedProducts.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./GetRelatedProducts.module.css";

const LIMIT = 10;
const STAGGER_DELAY = 150; // har product ke beech gap (ms)

const GetRelatedProducts = ({
  id: idProp,
  slug: slugProp,
  category: categoryProp,
  subCategory: subCategoryProp,
}) => {
  const params = useParams();

  const id = idProp || params.id || params.productId;
  const slug = slugProp || params.slug;
  const category = categoryProp || params.category;
  const subCategory = subCategoryProp || params.subCategory;

  const hasQuery = Boolean(id || slug || category || subCategory);

  const [visibleProducts, setVisibleProducts] = useState([]); // staggered reveal ke liye
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const abortRef = useRef(null);
  const fetchingRef = useRef(false);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const staggerTimeouts = useRef([]);

  // ---------------- Staggered reveal ----------------
  const revealStaggered = (batch) => {
    batch.forEach((product, i) => {
      const timeoutId = setTimeout(() => {
        setVisibleProducts((prev) => [...prev, product]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const fetchProducts = useCallback(
    async (pageToFetch) => {
      if (fetchingRef.current || !hasQuery) return;
      fetchingRef.current = true;

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      pageToFetch === 1 ? setLoading(true) : setLoadingMore(true);

      try {
        const response = await api.get("/v1/products/related", {
          params: {
            page: pageToFetch,
            limit: LIMIT,
            ...(id && { id }),
            ...(slug && { slug }),
            ...(category && { category }),
            ...(subCategory && { subCategory }),
          },
          signal: controller.signal,
        });

        const fetched = response?.data?.data?.products || [];
        const paginationData = response?.data?.data?.pagination;

        setHasMore(Boolean(paginationData?.hasNextPage) && fetched.length > 0);

        if (fetched.length > 0) {
          revealStaggered(fetched);
        }

        return fetched;
      } catch (error) {
        if (error?.name !== "CanceledError" && error?.code !== "ERR_CANCELED") {
          console.error("GetRelatedProducts fetch error:", error);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    [id, slug, category, subCategory, hasQuery]
  );

  useEffect(() => {
    if (!hasQuery) return;

    clearStaggerTimeouts();
    setVisibleProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, slug, category, subCategory]);

  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !fetchingRef.current && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, visibleProducts.length]);

  useEffect(() => {
    return () => clearStaggerTimeouts();
  }, []);

  if (!hasQuery) {
    return null;
  }

  // ---------------- Skeleton card ----------------
  const SkeletonCard = ({ delay = 0 }) => (
    <div className={styles.skeletonCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonLine} style={{ width: "80%" }} />
      <div className={styles.skeletonLine} style={{ width: "55%" }} />
      <div className={styles.skeletonLine} style={{ width: "40%", height: "18px", marginTop: "8px" }} />
    </div>
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLine}></div>
        <h3 className={styles.heading}>
          <span className={styles.headingIcon}>✦</span> You May Also Like
        </h3>
        <p className={styles.subheading}>Discover more products you'll love</p>
      </div>

      {loading && visibleProducts.length === 0 ? (
        <div className={styles.productGrid}>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 60} />
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛍️</span>
          <p>No related products found</p>
        </div>
      ) : (
        <>
          <div className={styles.productGrid}>
            {visibleProducts.map((product, index) => (
              <div
                key={product._id}
                className={styles.productItem}
                style={{ animationDelay: `${(index % LIMIT) * 0.06}s` }}
              >
                <ProductDesign product={product} />
              </div>
            ))}

            {loadingMore &&
              Array.from({ length: LIMIT }).map((_, i) => (
                <SkeletonCard key={`loading-${i}`} delay={i * 60} />
              ))}
          </div>

          <div ref={sentinelRef} className={styles.sentinel} />

          {!hasMore && visibleProducts.length > 0 && (
            <div className={styles.endMessage}>
              <span className={styles.endLine}></span>
              <p>You've seen all related products</p>
              <span className={styles.endLine}></span>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default GetRelatedProducts;