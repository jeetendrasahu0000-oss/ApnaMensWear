// FilteredProduct.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./FilteredProduct.module.css";
import { GetCategories } from "../../../../StataicData/StaticData";
import { FiFilter, FiX, FiSearch, FiChevronDown } from "react-icons/fi";

const LIMIT = 6;
const STAGGER_DELAY = 150;
const SCROLL_THROTTLE = 300;
const SCROLL_THRESHOLD = 250;
const FETCH_COOLDOWN = 600;

function FilteredProducts() {

  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState({
    category: category || "",
    search: searchQuery,
    minPrice: "",
    maxPrice: "",
    color: "",
    size: "",
    sort: "newest",
  });

  const appliedFiltersRef = useRef(filters);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const colors = ["Black", "White", "Blue", "Red", "Green", "Yellow", "Brown"];
  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const abortRef = useRef(null);
  const fetchingRef = useRef(false);
  const staggerTimeouts = useRef([]);
  const requestIdRef = useRef(0);
  const throttleRef = useRef(null);
  const cooldownRef = useRef(false);

  const categories = GetCategories();

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

  const fetchProducts = useCallback(async (pageToFetch, activeFilters) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    const currentRequestId = ++requestIdRef.current;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    pageToFetch === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const response = await api.get("/v1/products/filtered", {
        params: { page: pageToFetch, limit: LIMIT, ...activeFilters },
        signal: controller.signal,
      });

      if (requestIdRef.current !== currentRequestId) return;

      const fetched = response?.data?.data?.products || [];
      const totalPages = response?.data?.data?.pagination?.totalPages || 1;

      if (pageToFetch === 1) {
        clearStaggerTimeouts();
        setVisibleProducts([]);
      }

      if (fetched.length > 0) {
        revealStaggered(fetched, currentRequestId);
      }

      setHasMore(pageToFetch < totalPages && fetched.length > 0);
    } catch (error) {
      if (error?.name !== "CanceledError" && error?.code !== "ERR_CANCELED") {
        console.error("Fetch error:", error);
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
  }, []);

  // ---------------- Filter / category / search change fetch ----------------
  useEffect(() => {
    const newFilters = {
      ...appliedFiltersRef.current,
      category: category === "all" ? "" : category || "",
      search: searchQuery,
    };

    setFilters((prev) => ({
      ...prev,
      category: category === "all" ? "" : category || "",
      search: searchQuery,
    }));

    appliedFiltersRef.current = newFilters;

    setPage(1);
    setHasMore(true);

    fetchProducts(1, newFilters);

    return () => {
      requestIdRef.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchQuery]);

  // ---------------- Pagination fetch ----------------
  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page, appliedFiltersRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ---------------- Throttled scroll listener ----------------
  useEffect(() => {
    const handleScroll = () => {
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;

        if (cooldownRef.current || fetchingRef.current || !hasMore || loading) return;

        const scrollBottom = window.innerHeight + window.scrollY;
        const docHeight = document.documentElement.scrollHeight;

        if (docHeight - scrollBottom < SCROLL_THRESHOLD) {
          setPage((prev) => prev + 1);
        }
      }, SCROLL_THROTTLE);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleRef.current) clearTimeout(throttleRef.current);
    };
  }, [hasMore, loading]);

  useEffect(() => {
    return () => clearStaggerTimeouts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    appliedFiltersRef.current = { ...filters };
    setPage(1);
    setHasMore(true);
    fetchProducts(1, appliedFiltersRef.current);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: category || "",
      search: "",
      minPrice: "",
      maxPrice: "",
      color: "",
      size: "",
      sort: "newest",
    };
    setFilters(resetFilters);
    appliedFiltersRef.current = resetFilters;
    setPage(1);
    setHasMore(true);
    fetchProducts(1, resetFilters);
  };

  const sidebarContent = (
    <>
      <div className={styles.filterSection}>
        <h4>
          <FiSearch className={styles.sectionIcon} />
          Search
        </h4>
        <input
          type="text"
          name="search"
          value={filters.search}
          placeholder="Search products..."
          onChange={handleChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterSection}>
        <h4>Category</h4>
        <select name="category" value={filters.category} onChange={handleChange} className={styles.selectInput}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterSection}>
        <h4>Price Range</h4>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min ₹"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            className={styles.priceInput}
          />
          <input
            type="number"
            placeholder="Max ₹"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            className={styles.priceInput}
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
              className={`${styles.optionBtn} ${filters.color === color ? styles.active : ""}`}
              onClick={() => updateFilter("color", filters.color === color ? "" : color)}
            >
              <span className={styles.colorDot} style={{ backgroundColor: color.toLowerCase() }}></span>
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
              className={`${styles.optionBtn} ${filters.size === size ? styles.active : ""}`}
              onClick={() => updateFilter("size", filters.size === size ? "" : size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>
          Sort By
          <FiChevronDown className={styles.sortIcon} />
        </h4>
        <select name="sort" value={filters.sort} onChange={handleChange} className={styles.selectInput}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priceAsc">Price: Low → High</option>
          <option value="priceDesc">Price: High → Low</option>
          <option value="nameAsc">Name: A → Z</option>
          <option value="nameDesc">Name: Z → A</option>
        </select>
      </div>

      <div className={styles.filterActions}>
        <button className={styles.clearBtn} onClick={clearFilters}>
          Clear All
        </button>
        <button className={styles.applyBtn} onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </>
  );

  const SkeletonCard = ({ delay = 0 }) => (
    <div className={styles.skeletonCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonLine} style={{ width: "80%" }} />
      <div className={styles.skeletonLine} style={{ width: "55%" }} />
      <div className={styles.skeletonLine} style={{ width: "40%", height: "18px", marginTop: "8px" }} />
    </div>
  );

  return (
    <section className={styles.page}>
      <div className={styles.headerBar}>
        <button className={styles.mobileFilterBtn} onClick={() => setShowFilters(true)}>
          <FiFilter />
          Filters
        </button>
        <div className={styles.resultsCount}>
          {!loading && visibleProducts.length > 0 && (
            <span>{visibleProducts.length} products found</span>
          )}
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Filters</h3>
            <button className={styles.clearAllBtn} onClick={clearFilters}>
              Clear All
            </button>
          </div>
          {sidebarContent}
        </aside>

        <main className={styles.content}>
          <div className={styles.topBar}>
            <h2>
              {category ? category : "All"} Products
              <span className={styles.count}>{!loading && `(${visibleProducts.length})`}</span>
            </h2>
            {!loading && visibleProducts.length > 0 && (
              <span className={styles.sortInfo}>Sorted by: {filters.sort}</span>
            )}
          </div>

          {loading && visibleProducts.length === 0 ? (
            <div className={styles.productGrid}>
              {Array.from({ length: LIMIT }).map((_, i) => (
                <SkeletonCard key={i} delay={i * 60} />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>No Products Found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles.productGrid}>
                {visibleProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className={styles.productItem}
                    style={{ animationDelay: `${(index % LIMIT) * 0.05}s` }}
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
                  <p>You've seen all products</p>
                  <span className={styles.endLine}></span>
                </div>
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
              <h3>
                <FiFilter className={styles.mobileFilterIcon} />
                Filters
              </h3>
              <button onClick={() => setShowFilters(false)} className={styles.closeBtn}>
                <FiX />
              </button>
            </div>
            {sidebarContent}
          </div>
        </>
      )}
    </section>
  );
}

export default FilteredProducts;