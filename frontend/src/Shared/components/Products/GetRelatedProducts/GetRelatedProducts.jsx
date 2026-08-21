// GetRelatedProducts.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./GetRelatedProducts.module.css";

const LIMIT = 10;

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

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const abortRef = useRef(null);
  const fetchingRef = useRef(false);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

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

        setProducts((prev) =>
          pageToFetch === 1 ? fetched : [...prev, ...fetched]
        );
        setHasMore(Boolean(paginationData?.hasNextPage) && fetched.length > 0);

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

    setProducts([]);
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
  }, [hasMore, loading, products.length]);

  if (!hasQuery) {
    return null;
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLine}></div>
        <h3 className={styles.heading}>
          <span className={styles.headingIcon}>✦</span> You May Also Like
        </h3>
        <p className={styles.subheading}>Discover more products you'll love</p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading related products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛍️</span>
          <p>No related products found</p>
        </div>
      ) : (
        <>
          <div className={styles.productGrid}>
            {products.map((product, index) => (
              <div 
                key={product._id} 
                className={styles.productItem}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <ProductDesign product={product} />
              </div>
            ))}
          </div>

          <div ref={sentinelRef} className={styles.sentinel} />

          {loadingMore && (
            <div className={styles.loadingMore}>
              <div className={styles.loadingSpinnerSmall}></div>
              <p>Loading more...</p>
            </div>
          )}
          
          {!hasMore && products.length > 0 && (
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