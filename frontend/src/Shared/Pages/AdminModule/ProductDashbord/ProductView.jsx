import { X } from "lucide-react";
import styles from "./ProductView.module.css";

// local helper — only used inside this file
const getTotalStock = (product) =>
  (product.variants || []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

function ProductView({ product, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{product.productName}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.gallery}>
            <img src={product.coverImage?.url} alt={product.productName} className={styles.cover} />
            {product.images?.length > 0 && (
              <div className={styles.thumbRow}>
                {product.images.map((image) => (
                  <img key={image?.public_id} src={image?.url} alt="" className={styles.thumb} />
                ))}
              </div>
            )}
          </div>

          <div className={styles.infoGrid}>
            <InfoRow label="Slug" value={product.slug} />
            <InfoRow label="Category" value={`${product.category} / ${product.subCategory || "—"}`} />
            <InfoRow label="Brand" value={product.brand} />
            <InfoRow
              label="Price"
              value={
                product.salePrice && product.salePrice !== product.price
                  ? `₹${Number(product.salePrice).toLocaleString("en-IN")} (was ₹${Number(
                      product.price
                    ).toLocaleString("en-IN")})`
                  : `₹${Number(product.price).toLocaleString("en-IN")}`
              }
            />
            <InfoRow label="Weight" value={product.weight} />
            <InfoRow
              label="Dimensions"
              value={
                product.dimensions
                  ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`
                  : "—"
              }
            />
            <InfoRow label="Total stock" value={getTotalStock(product)} />
            <InfoRow label="Active" value={product.isActive ? "Yes" : "No"} />
          </div>

          {product.shortDescription && (
            <p className={styles.shortDesc}>{product.shortDescription}</p>
          )}
          {product.description && <p className={styles.description}>{product.description}</p>}

          {product.tags?.filter(Boolean).length > 0 && (
            <div className={styles.tagRow}>
              {product.tags.filter(Boolean).map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className={styles.sectionTitle}>Variants</div>
          <table className={styles.variantTable}>
            <thead>
              <tr>
                <th>Color</th>
                <th>Size</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {(product.variants || []).map((v) => (
                <tr key={v._id || `${v.color}-${v.size}`}>
                  <td>{v.color}</td>
                  <td>{v.size}</td>
                  <td>{v.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}

export default ProductView;