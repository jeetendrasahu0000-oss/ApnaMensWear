// GetRelatedProducts.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./GetRelatedProducts.module.css";

const LIMIT = 10;
const STAGGER_DELAY = 150;
const SCROLL_THROTTLE = 300;
const SCROLL_THRESHOLD = 250;
const EXIT_BUFFER = 400; // threshold se itna door jaane par hi dobara "arm" hoga
const FETCH_COOLDOWN = 700;

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

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const abortRef = useRef(null);
  const fetchingRef = useRef(false);
  const staggerTimeouts = useRef([]);
  const requestIdRef = useRef(0);
  const throttleRef = useRef(null);
  const cooldownRef = useRef(false);
  const armedRef = useRef(true);

  const revealStaggered = (batch, requestId) => {
    batch.forEach((product, i) => {
      const timeoutId = setTimeout(() => {
        if (requestIdRef.current !== requestId) return;
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

      const currentRequestId = ++requestIdRef.current;

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

        if (requestIdRef.current !== currentRequestId) return;

        const fetched = response?.data?.data?.products || [];
        const paginationData = response?.data?.data?.pagination;

        setHasMore(Boolean(paginationData?.hasNextPage) && fetched.length > 0);

        if (fetched.length > 0) {
          revealStaggered(fetched, currentRequestId);
        }
      } catch (error) {
        if (error?.name !== "CanceledError" && error?.code !== "ERR_CANCELED") {
          console.error("GetRelatedProducts fetch error:", error);
        }
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setLoading(false);
          setLoadingMore(false);
        }
        fetchingRef.current = false;

        cooldownRef.current = true;
        setTimeout(() => {
          cooldownRef.current = false;
        }, FETCH_COOLDOWN);
      }
    },
    [id, slug, category, subCategory, hasQuery]
  );

  // ---------------- Initial / query-change fetch ----------------
  useEffect(() => {
    if (!hasQuery) return;

    clearStaggerTimeouts();
    setVisibleProducts([]);
    setPage(1);
    setHasMore(true);
    armedRef.current = true;
    fetchProducts(1);

    return () => {
      requestIdRef.current += 1;
      clearStaggerTimeouts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, slug, category, subCategory]);

  // ---------------- Pagination fetch ----------------
  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ---------------- Scroll listener (armed/disarmed gate — iOS Safari safe) ----------------
  useEffect(() => {
    if (!hasQuery) return;

    const handleScroll = () => {
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;

        const scrollY = Math.max(window.scrollY, 0);
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const scrollBottom = viewportHeight + scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const distanceFromBottom = docHeight - scrollBottom;

        // user threshold zone se kaafi door chala gaya — dobara "arm" karo
        if (distanceFromBottom > SCROLL_THRESHOLD + EXIT_BUFFER) {
          armedRef.current = true;
          return;
        }

        if (
          armedRef.current &&
          !cooldownRef.current &&
          !fetchingRef.current &&
          hasMore &&
          !loading &&
          distanceFromBottom < SCROLL_THRESHOLD
        ) {
          armedRef.current = false; // disarm — dobara zone se bahar jaane tak fire nahi hoga
          setPage((prev) => prev + 1);
        }
      }, SCROLL_THROTTLE);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleRef.current) clearTimeout(throttleRef.current);
    };
  }, [hasQuery, hasMore, loading]);

  useEffect(() => {
    return () => clearStaggerTimeouts();
  }, []);

  if (!hasQuery) {
    return null;
  }

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