import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./FilteredProduct.module.css";

const LIMIT = 6;

function FilteredProducts() {
  const { category } = useParams();

  // Single filter state – UI values
  const [filters, setFilters] = useState({
    category: category || "",
    search: "",
    minPrice: "",
    maxPrice: "",
    color: "",
    size: "",
    sort: "newest",
  });

  // Ref to store the last applied filters (used for API calls)
  const appliedFiltersRef = useRef(filters);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const colors = ["Black", "White", "Blue", "Red", "Green"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const abortRef = useRef(null);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const fetchingRef = useRef(false);

  // --- Sync category from URL into filters (and auto‑apply) ---
  useEffect(() => {
    console.log("🔄 Category changed in URL:", category);
    setFilters((prev) => ({ ...prev, category: category || "" }));
  }, [category]);

  // When category changes, apply it automatically (or you can remove this to require Apply)
  useEffect(() => {
    if (category !== undefined) {
      const newFilters = { ...filters, category: category || "" };
      console.log("📦 Auto‑applying category:", newFilters);
      appliedFiltersRef.current = newFilters;
      setPage(1);
      setProducts([]);
      setHasMore(true);
      fetchProducts(1, newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // --- Initial load (on mount) ---
  useEffect(() => {
    console.log("🚀 Initial load with filters:", filters);
    appliedFiltersRef.current = filters;
    fetchProducts(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Core fetch function ---
  const fetchProducts = useCallback(
    async (pageToFetch, activeFilters) => {
      console.log(`📡 Fetching page ${pageToFetch} with filters:`, activeFilters);
      if (fetchingRef.current) {
        console.log("⏳ Already fetching, skipping...");
        return;
      }
      fetchingRef.current = true;

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      pageToFetch === 1 ? setLoading(true) : setLoadingMore(true);

      try {
        const response = await api.get("/v1/products/filtered", {
          params: { page: pageToFetch, limit: LIMIT, ...activeFilters },
          signal: controller.signal,
        });

        console.log("✅ API response:", response?.data);

        const fetched = response?.data?.data?.products || [];
        const totalPages = response?.data?.data?.pagination?.totalPages || 1;

        setProducts((prev) =>
          pageToFetch === 1 ? fetched : [...prev, ...fetched]
        );
        setHasMore(pageToFetch < totalPages && fetched.length > 0);
      } catch (error) {
        if (error?.name !== "CanceledError" && error?.code !== "ERR_CANCELED") {
          console.error("❌ Fetch error:", error);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    []
  );

  // --- Fetch next page when page increments ---
  useEffect(() => {
    if (page === 1) return;
    console.log(`📄 Page changed to ${page}, fetching more...`);
    fetchProducts(page, appliedFiltersRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // --- Intersection Observer for infinite scroll ---
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !fetchingRef.current && !loading) {
          console.log("👀 Sentinel visible, loading next page...");
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, products.length]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`✏️ Filter changed: ${name} = ${value}`);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const updateFilter = (name, value) => {
    console.log(`🖱️ Toggle filter: ${name} = ${value}`);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // --- Apply button: store current filters, reset, and fetch ---
  const handleApply = () => {
    console.log("🔘 Apply button clicked. Current filters:", filters);
    appliedFiltersRef.current = { ...filters };
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, appliedFiltersRef.current);
  };

  // --- Sidebar content (desktop & mobile) ---
  const sidebarContent = (
    <>
      <div className={styles.filterSection}>
        <h4>Search</h4>
        <input
          type="text"
          name="search"
          value={filters.search}
          placeholder="Search products..."
          onChange={handleChange}
        />
      </div>

      <div className={styles.filterSection}>
        <h4>Category</h4>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronic">Electronic</option>
        </select>
      </div>

      <div className={styles.filterSection}>
        <h4>Price Range</h4>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Max"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>Colors</h4>
        <div className={styles.optionWrap}>
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`${styles.optionBtn} ${
                filters.color === color ? styles.active : ""
              }`}
              onClick={() =>
                updateFilter("color", filters.color === color ? "" : color)
              }
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>Sizes</h4>
        <div className={styles.optionWrap}>
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`${styles.optionBtn} ${
                filters.size === size ? styles.active : ""
              }`}
              onClick={() =>
                updateFilter("size", filters.size === size ? "" : size)
              }
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>Sort By</h4>
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priceAsc">Price Low → High</option>
          <option value="priceDesc">Price High → Low</option>
          <option value="nameAsc">Name A-Z</option>
          <option value="nameDesc">Name Z-A</option>
        </select>
      </div>

      <button className={styles.applyBtn} onClick={handleApply}>
        Apply Filters
      </button>
    </>
  );

  // --- Render ---
  return (
    <section className={styles.page}>
      <button
        className={styles.mobileFilterBtn}
        onClick={() => setShowFilters(true)}
      >
        ☰ Filters
      </button>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3>Filters</h3>
          {sidebarContent}
        </aside>

        <main className={styles.content}>
          <div className={styles.topBar}>
            <h2>
              Products <span>({products.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading Products...</div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>No Products Found</div>
          ) : (
            <>
              <div className={styles.productGrid}>
                {products.map((product) => (
                  <ProductDesign key={product._id} product={product} />
                ))}
              </div>

              <div ref={sentinelRef} style={{ height: 1 }} />

              {loadingMore && (
                <div className={styles.loading}>Loading more...</div>
              )}
              {!hasMore && products.length > 0 && (
                <div className={styles.empty}>No more products</div>
              )}
            </>
          )}
        </main>
      </div>

      {showFilters && (
        <>
          <div className={styles.overlay} onClick={() => setShowFilters(false)} />
          <div className={styles.mobileSidebar}>
            <div className={styles.mobileHeader}>
              <h3>Filters</h3>
              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>
            {sidebarContent}
          </div>
        </>
      )}
    </section>
  );
}

export default FilteredProducts;

