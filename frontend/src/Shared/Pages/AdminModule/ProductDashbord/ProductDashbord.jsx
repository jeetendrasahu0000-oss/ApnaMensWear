// ProductDashbord.jsx
import { useEffect, useMemo, useState } from "react";
import { Boxes, AlertTriangle, XCircle, Plus, Eye, Pencil, Trash2, RefreshCw } from "lucide-react";
import api from '../../../../Api/Axios'

import ProductRegister from "./ProductRegester";
import ProductEdit from "./ProductEdit";
import ProductView from "./ProductView";
import ProductDelete from "./ProductDelete";
import styles from "./ProductDashbord.module.css";

const LOW_STOCK_THRESHOLD = 15;

function ProductDashbord() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const getTotalStock = (product) =>
    (product.variants || []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  const getStockStatus = (product) => {
    const total = getTotalStock(product);
    if (total === 0) return "out";
    if (total <= LOW_STOCK_THRESHOLD) return "low";
    return "active";
  };

  const STOCK_STATUS_LABEL = {
    active: "In stock",
    low: "Low stock",
    out: "Out of stock",
  };

  const fetchProducts = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await api.get("/v1/products");
      setProducts(response.data?.data || []);
    } catch (error) {
      setLoadError(
        error?.response?.data?.message || "Couldn't load products. Try refreshing."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const lowStockCount = useMemo(
    () => products.filter((p) => getStockStatus(p) === "low").length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => getStockStatus(p) === "out").length,
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = `${p.productName} ${p.category} ${p.subCategory} ${p.brand}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || getStockStatus(p) === statusFilter;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [products, query, categoryFilter, statusFilter]);

  const handleCreated = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setShowRegister(false);
  };

  const handleUpdated = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
    setEditingProduct(null);
  };

  const handleDeleted = (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    setDeletingProduct(null);
  };

  const renderRowActions = (product) => (
    <div className={styles.rowActions}>
      <button type="button" title="View" onClick={() => setViewingProduct(product)}>
        <Eye size={15} />
      </button>
      <button type="button" title="Edit" onClick={() => setEditingProduct(product)}>
        <Pencil size={14} />
      </button>
      <button
        type="button"
        title="Delete"
        className={styles.deleteBtn}
        onClick={() => setDeletingProduct(product)}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );

  // ---------------- Skeleton pieces ----------------
  const SkeletonSummaryCard = ({ delay = 0 }) => (
    <div className={styles.summaryCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 40, height: 40, borderRadius: 11 }} />
      <div style={{ flex: 1 }}>
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "40%", height: "20px" }} />
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "60%", height: "11px", marginTop: "6px" }} />
      </div>
    </div>
  );

  const SkeletonTableRow = ({ delay = 0 }) => (
    <tr className={styles.skeletonRow} style={{ animationDelay: `${delay}ms` }}>
      <td>
        <div className={styles.productCell}>
          <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 40, height: 40, borderRadius: 9 }} />
          <div>
            <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "120px" }} />
            <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "80px", height: "10px", marginTop: "4px" }} />
          </div>
        </div>
      </td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "90px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "70px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "60px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "30px" }} /></td>
      <td><div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 70, height: 20, borderRadius: 20 }} /></td>
      <td><div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 90, height: 30, borderRadius: 8 }} /></td>
    </tr>
  );

  const SkeletonProductCard = ({ delay = 0 }) => (
    <div className={styles.productCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 100, height: 100, borderRadius: 10, flexShrink: 0 }} />
      <div className={styles.cardBody}>
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "70%", height: "14px" }} />
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "50%", height: "11px", marginTop: "6px" }} />
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "40%", height: "14px", marginTop: "10px" }} />
      </div>
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.summaryRow}>
        {loading ? (
          <>
            <SkeletonSummaryCard delay={0} />
            <SkeletonSummaryCard delay={60} />
            <SkeletonSummaryCard delay={120} />
          </>
        ) : (
          <>
            <SummaryCard icon={Boxes} label="Total products" value={products.length} />
            <SummaryCard icon={AlertTriangle} label="Low stock" value={lowStockCount} tone="warning" />
            <SummaryCard icon={XCircle} label="Out of stock" value={outOfStockCount} tone="danger" />
          </>
        )}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2>Catalog</h2>

          <div className={styles.actions}>
            <div className={styles.searchWrap}>
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterRow}>
              <select
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All stock</option>
                <option value="active">In stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>
            </div>

            <button type="button" className={styles.addBtn} onClick={() => setShowRegister(true)}>
              <Plus size={15} />
              Add product
            </button>
          </div>
        </div>

        {loadError && (
          <div className={styles.errorBanner}>
            {loadError}
            <button type="button" onClick={fetchProducts}>
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {/* ---------------- Skeleton loading ---------------- */}
        {loading && (
          <>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonTableRow key={i} delay={i * 60} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.cardList}>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonProductCard key={i} delay={i * 60} />
              ))}
            </div>
          </>
        )}

        {!loading && filtered.length === 0 && !loadError && (
          <div className={styles.stateMsg}>No products match your filters.</div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            {/* desktop / tablet — table, hidden on small screens via CSS */}
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product, index) => {
                    const status = getStockStatus(product);
                    return (
                      <tr
                        key={product._id}
                        className={styles.animatedRow}
                        style={{ animationDelay: `${(index % 20) * 0.03}s` }}
                      >
                        <td>
                          <div className={styles.productCell}>
                            <img
                              src={product.coverImage?.url}
                              alt={product.productName}
                              className={styles.thumb}
                              onError={(e) => {
                                e.currentTarget.style.visibility = "hidden";
                              }}
                            />
                            <div>
                              <span className={styles.productName}>{product.productName}</span>
                              <span className={styles.productSlug}>{product.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {product.category}
                          {product.subCategory ? ` / ${product.subCategory}` : ""}
                        </td>
                        <td>{product.brand}</td>
                        <td className={styles.mono}>
                          ₹{Number(product.salePrice ?? product.price).toLocaleString("en-IN")}
                          {product.salePrice && product.salePrice !== product.price && (
                            <span className={styles.strikePrice}>
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </span>
                          )}
                        </td>
                        <td className={styles.mono}>{getTotalStock(product)}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[`status_${status}`]}`}>
                            {STOCK_STATUS_LABEL[status]}
                          </span>
                        </td>
                        <td>{renderRowActions(product)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* mobile — rectangular cards, hidden on larger screens via CSS */}
            <div className={styles.cardList}>
              {filtered.map((product, index) => {
                const status = getStockStatus(product);
                return (
                  <div
                    key={product._id}
                    className={`${styles.productCard} ${styles.animatedRow}`}
                    style={{ animationDelay: `${(index % 20) * 0.03}s` }}
                  >
                    <img
                      src={product.coverImage.url}
                      alt={product.productName}
                      className={styles.cardThumb}
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />

                    <div className={styles.cardBody}>
                      <div className={styles.cardTopRow}>
                        <div className={styles.cardTitleWrap}>
                          <span className={styles.cardName}>{product.productName}</span>
                          <span className={styles.cardMeta}>
                            {product.brand}
                            {product.category ? ` · ${product.category}` : ""}
                          </span>
                        </div>
                        <span className={`${styles.statusBadge} ${styles[`status_${status}`]}`}>
                          {STOCK_STATUS_LABEL[status]}
                        </span>
                      </div>

                      <div className={styles.cardBottomRow}>
                        <div className={styles.cardPriceWrap}>
                          <span className={styles.cardPrice}>
                            ₹{Number(product.salePrice ?? product.price).toLocaleString("en-IN")}
                          </span>
                          {product.salePrice && product.salePrice !== product.price && (
                            <span className={styles.strikePrice}>
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className={styles.cardStock}>{getTotalStock(product)} in stock</span>
                        </div>

                        {renderRowActions(product)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {showRegister && (
        <ProductRegister onClose={() => setShowRegister(false)} onCreated={handleCreated} />
      )}

      {editingProduct && (
        <ProductEdit
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={handleUpdated}
        />
      )}

      {viewingProduct && (
        <ProductView product={viewingProduct} onClose={() => setViewingProduct(null)} />
      )}

      {deletingProduct && (
        <ProductDelete
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  return (
    <div className={`${styles.summaryCard} ${tone ? styles[`tone_${tone}`] : ""}`}>
      <div className={styles.summaryIcon}>
        <Icon size={18} />
      </div>
      <div>
        <p className={styles.summaryValue}>{value}</p>
        <p className={styles.summaryLabel}>{label}</p>
      </div>
    </div>
  );
}

export default ProductDashbord;