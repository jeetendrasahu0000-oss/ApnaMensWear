// import React from 'react'
// import styles from './GetRelatedProducts.module.css'

// const GetRelatedProducts = () => {
//   return (
//     <div>GetRelatedProducts</div>
//   )
// }

// export default GetRelatedProducts



import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./GetRelatedProducts.module.css";

const LIMIT = 10;

/**
 * Accepts any combination of: id, slug, category, subCategory
 * (as props, or read from route params if not passed directly).
 * Backend resolves id/slug itself — no client-side resolution needed.
 *
 *   <GetRelatedProducts id={product._id} />
 *   <GetRelatedProducts slug={product.slug} />       // on /product/:slug route, works with no props at all
 *   <GetRelatedProducts category="Men" />
 *   <GetRelatedProducts category="Men" subCategory="Shirts" />
 */
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

  // single source of truth for calling the endpoint — used for both
  // page 1 (reset) and page > 1 (infinite scroll append)
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

  // whenever the identifying inputs change -> reset list and fetch page 1
  useEffect(() => {
    if (!hasQuery) return;

    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, slug, category, subCategory]);

  // page increments (via scroll) -> fetch next batch, same function
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
    return null; // nothing to base recommendations on
  }

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.heading}>You may also like</h3>

      {loading ? (
        <div className={styles.loading}>Loading related products...</div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>No related products found</div>
      ) : (
        <>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductDesign key={product._id} product={product} />
            ))}
          </div>

          <div ref={sentinelRef} style={{ height: 1 }} />

          {loadingMore && <div className={styles.loading}>Loading more...</div>}
          {!hasMore && products.length > 0 && (
            <div className={styles.empty}>No more related products</div>
          )}
        </>
      )}
    </section>
  );
};

export default GetRelatedProducts;