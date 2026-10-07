import { useCallback, useEffect, useState, useRef } from "react";
import {
  Check,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Trash2,
  X,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import api from "../../../../Api/Axios";
import {
  deleteCategory,
  deleteSubCategory,
  fetchCategories,
  isCategoryRecord,
  setCategoryEnabled,
  updateCategory,
  updateSubCategory,
} from "../../../../Api/categories";
import styles from "./CategoryDashboard.module.css";

function CategoryDashboard() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [subCategoryInputs, setSubCategoryInputs] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const noticeTimeoutRef = useRef(null);
  const requestIdRef = useRef(0);

  // Auto-clear notice after 3s
  useEffect(() => {
    if (!notice) return;
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    noticeTimeoutRef.current = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(noticeTimeoutRef.current);
  }, [notice]);

  const refreshCategoriesFromServer = useCallback(async () => {
    const latestCategories = await fetchCategories({ includeDisabled: true });
    setCategories(latestCategories);
    return latestCategories;
  }, []);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await refreshCategoriesFromServer();
    } catch (loadError) {
      setError(loadError.response?.data?.message || loadError.message);
    } finally {
      setLoading(false);
    }
  }, [refreshCategoriesFromServer]);

  // FIX: requestId pattern — StrictMode double-invoke safe
  useEffect(() => {
    const currentId = ++requestIdRef.current;
    const timeoutId = setTimeout(() => {
      if (requestIdRef.current === currentId) loadCategories();
    }, 0);
    return () => {
      requestIdRef.current += 1;
      clearTimeout(timeoutId);
    };
  }, [loadCategories]);

  const applyCategoryUpdate = (currentCategory, changes, response) => {
    const responseCategory = [
      response?.data,
      response?.data?.category,
      response?.category,
    ].find(isCategoryRecord);
    const updatedCategory = {
      ...currentCategory,
      ...(responseCategory || {}),
      ...changes,
    };
    const currentId = currentCategory?._id?.toString();
    const previousName = currentCategory?.name?.trim().toLowerCase();

    setCategories((previous) => {
      const currentCategories = previous.filter(isCategoryRecord);
      const matchingIndex = currentCategories.findIndex(
        (item) =>
          (currentId && item._id?.toString() === currentId) ||
          item.name.trim().toLowerCase() === previousName
      );

      if (matchingIndex === -1) {
        currentCategories.push(updatedCategory);
      } else {
        currentCategories[matchingIndex] = {
          ...currentCategories[matchingIndex],
          ...updatedCategory,
        };
      }

      return currentCategories.sort((a, b) => a.name.localeCompare(b.name));
    });

    return updatedCategory;
  };

  const ensureMutationSucceeded = (response, fallbackMessage) => {
    if (response?.success === false) {
      throw new Error(response.message || fallbackMessage);
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const { data } = await api.post("/v1/categories", {
        name: categoryName.trim(),
        imageUrl: imageUrl.trim(),
      });

      ensureMutationSucceeded(data, "Failed to create category");
      const responseCategory = [data?.data, data?.data?.category, data?.category].find(
        isCategoryRecord
      );
      const createdCategory = responseCategory || {
        name: categoryName.trim(),
        imageUrl: imageUrl.trim(),
        subCategories: [],
        isEnabled: true,
      };
      setCategoryName("");
      setImageUrl("");
      applyCategoryUpdate(createdCategory, {}, data);
      setNotice(data.message || "Category created successfully");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Failed to create category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSubCategory = async (event, category) => {
    event.preventDefault();
    const subCategory = (subCategoryInputs[category] || "").trim();
    if (!subCategory) return;

    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const { data } = await api.post("/v1/categories/subcategories", {
        category,
        subCategory,
      });

      ensureMutationSucceeded(data, "Failed to add sub-category");
      const existingCategory = categories.find(
        (item) => isCategoryRecord(item) && item.name === category
      );
      if (!existingCategory) {
        throw new Error("Category is no longer available. Refresh and try again.");
      }
      const responseCategory = [data?.data, data?.data?.category, data?.category].find(
        isCategoryRecord
      );
      const subCategories =
        responseCategory?.subCategories ||
        [...(existingCategory.subCategories || []), subCategory];
      applyCategoryUpdate(existingCategory, { subCategories }, data);
      setSubCategoryInputs((prev) => ({ ...prev, [category]: "" }));
      setNotice(data.message || "Sub-category added successfully");
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Failed to add sub-category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (event, originalName) => {
    event.preventDefault();
    const currentCategory = categories.find(
      (item) => isCategoryRecord(item) && item.name === originalName
    );
    if (!currentCategory || !editingCategory) {
      setError("Category is no longer available. Refresh and try again.");
      return;
    }

    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const changes = {
        name: editingCategory.name.trim(),
        imageUrl: editingCategory.imageUrl.trim(),
      };
      const { data } = await updateCategory({
        currentName: originalName,
        ...changes,
      });
      ensureMutationSucceeded(data, "Failed to update category");
      applyCategoryUpdate(currentCategory, changes, data);
      setNotice(data.message || "Category updated successfully");
      setEditingCategory(null);
    } catch (updateError) {
      setError(
        updateError.response?.data?.message ||
          updateError.message ||
          "Failed to update category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (
      !window.confirm(
        `Permanently delete category "${category.name}"? Products in this category will no longer appear in the store.`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const { data } = await deleteCategory(category.name);
      ensureMutationSucceeded(data, "Failed to delete category");
      setCategories((prev) =>
        prev.filter((item) => isCategoryRecord(item) && item.name !== category.name)
      );
      setNotice(data.message || "Category deleted successfully");
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.message ||
          deleteError.message ||
          "Failed to delete category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCategory = async (category) => {
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const isEnabled = category.isEnabled === false;
      const { data } = await setCategoryEnabled(category, isEnabled);
      ensureMutationSucceeded(data, "Failed to update category visibility");
      applyCategoryUpdate(category, { isEnabled }, data);
      setNotice(
        data.message || `Category ${isEnabled ? "enabled" : "disabled"} successfully`
      );
    } catch (toggleError) {
      setError(
        toggleError.response?.data?.message ||
          toggleError.message ||
          "Failed to update category visibility"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubCategory = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const currentCategory = categories.find(
        (item) =>
          isCategoryRecord(item) && item.name === editingSubCategory.category
      );
      if (!currentCategory) {
        throw new Error("Category is no longer available. Refresh and try again.");
      }
      const name = editingSubCategory.name.trim();
      const { data } = await updateSubCategory({
        category: editingSubCategory.category,
        currentName: editingSubCategory.currentName,
        name,
      });
      ensureMutationSucceeded(data, "Failed to update sub-category");
      const subCategories = (currentCategory.subCategories || []).map((subCategory) =>
        subCategory.toLowerCase() === editingSubCategory.currentName.toLowerCase()
          ? name
          : subCategory
      );
      applyCategoryUpdate(currentCategory, { subCategories }, data);
      setNotice(data.message || "Sub-category updated successfully");
      setEditingSubCategory(null);
    } catch (updateError) {
      setError(
        updateError.response?.data?.message ||
          updateError.message ||
          "Failed to update sub-category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubCategory = async (category, subCategory) => {
    if (
      !window.confirm(
        `Delete "${subCategory}" from "${category}"? Sub-categories used by products cannot be deleted.`
      )
    ) {
      return;
    }

    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const currentCategory = categories.find(
        (item) => isCategoryRecord(item) && item.name === category
      );
      if (!currentCategory) {
        throw new Error("Category is no longer available. Refresh and try again.");
      }
      const { data } = await deleteSubCategory(category, subCategory);
      ensureMutationSucceeded(data, "Failed to delete sub-category");
      const subCategories = (currentCategory.subCategories || []).filter(
        (item) => item.toLowerCase() !== subCategory.toLowerCase()
      );
      applyCategoryUpdate(currentCategory, { subCategories }, data);
      setNotice(data.message || "Sub-category deleted successfully");
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.message ||
          deleteError.message ||
          "Failed to delete sub-category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const validCategories = categories.filter(isCategoryRecord);

  return (
    <section className={styles.dashboard}>
      {/* ================ HEADER ================ */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.eyebrow}>
            <Layers size={13} />
            Catalog
          </span>
          <h1>Categories</h1>
          <p>Manage categories and sub-categories used by your products.</p>
        </div>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={loadCategories}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? styles.spinning : ""} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {/* ================ BANNERS ================ */}
      {error && (
        <div className={styles.error} role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div className={styles.notice} role="status">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* ================ CREATE FORM ================ */}
      <form className={styles.createForm} onSubmit={handleCreateCategory}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <Plus size={18} />
          </div>
          <div>
            <h2>Add New Category</h2>
            <p>Create a new category to organize your products.</p>
          </div>
        </div>

        <div className={styles.formFields}>
          <label>
            <span>Category Name</span>
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Jackets, Shirts, Jeans"
              required
              maxLength={80}
            />
          </label>

          <label>
            <span>
              Image URL <em>(optional)</em>
            </span>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/category.jpg"
            />
          </label>

          <button type="submit" disabled={submitting || !categoryName.trim()}>
            <Plus size={16} />
            Add Category
          </button>
        </div>
      </form>

      {/* ================ CATEGORY LIST ================ */}
      <div className={styles.categoryList}>
        <div className={styles.listHeader}>
          <h2>
            All Categories{" "}
            {!loading && (
              <span className={styles.count}>{validCategories.length}</span>
            )}
          </h2>
          <p className={styles.sourceNote}>
            Disabled categories are hidden from the store. Deleting a category
            hides its products until reassigned.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className={styles.skeletonList}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={styles.skeletonCard}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={styles.skeletonLine} style={{ width: 54, height: 54, borderRadius: 12 }} />
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine} style={{ width: "40%" }} />
                  <div className={styles.skeletonLine} style={{ width: "70%" }} />
                  <div className={styles.skeletonLine} style={{ width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && validCategories.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Package size={26} />
            </div>
            <h3>No categories yet</h3>
            <p>Add your first category above to get started.</p>
          </div>
        )}

        {/* Category cards */}
        {!loading &&
          validCategories.map((category, index) => (
            <article
              className={styles.categoryCard}
              key={category.name}
              style={{ animationDelay: `${(index % 12) * 0.04}s` }}
            >
              <div className={styles.categoryHeading}>
                {editingCategory?.currentName === category.name ? (
                  <form
                    className={styles.editCategoryForm}
                    onSubmit={(e) => handleUpdateCategory(e, category.name)}
                  >
                    <label>
                      <span>Category name</span>
                      <input
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                        maxLength={80}
                        autoFocus
                      />
                    </label>
                    <label>
                      <span>Image URL</span>
                      <input
                        type="url"
                        value={editingCategory.imageUrl}
                        onChange={(e) =>
                          setEditingCategory((prev) => ({
                            ...prev,
                            imageUrl: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className={styles.editActions}>
                      <button
                        type="submit"
                        className={`${styles.iconButton} ${styles.saveAction}`}
                        disabled={submitting || !editingCategory.name.trim()}
                        title="Save"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.cancelAction}`}
                        onClick={() => setEditingCategory(null)}
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {category.imageUrl ? (
                      <img
                        className={styles.categoryImage}
                        src={category.imageUrl}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.style?.setProperty(
                            "display",
                            "inline-grid"
                          );
                        }}
                      />
                    ) : null}

                    <span
                      className={styles.categoryImagePlaceholder}
                      style={{ display: category.imageUrl ? "none" : "inline-grid" }}
                      aria-hidden="true"
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </span>

                    <div className={styles.categoryMeta}>
                      <h3 className={styles.categoryTitle} title={category.name}>
                        {category.name}
                      </h3>
                      <span
                        className={`${styles.statusBadge} ${
                          category.isEnabled === false
                            ? styles.statusDisabled
                            : styles.statusEnabled
                        }`}
                      >
                        <span className={styles.statusDot} />
                        {category.isEnabled === false
                          ? "Hidden"
                          : "Visible"}
                      </span>
                    </div>

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => handleToggleCategory(category)}
                        disabled={submitting}
                        title={
                          category.isEnabled === false
                            ? "Enable in store"
                            : "Disable from store"
                        }
                      >
                        <Power size={14} />
                        {category.isEnabled === false ? "Enable" : "Disable"}
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.editAction}`}
                        onClick={() =>
                          setEditingCategory({
                            currentName: category.name,
                            name: category.name,
                            imageUrl: category.imageUrl || "",
                          })
                        }
                        title="Edit category"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteCategory(category)}
                        disabled={submitting}
                        title="Delete category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Sub-categories */}
              <div className={styles.subCategoriesSection}>
                <div className={styles.subCategoriesLabel}>
                  Sub-categories
                  {category.subCategories?.length > 0 && (
                    <span className={styles.subCount}>
                      {category.subCategories.length}
                    </span>
                  )}
                </div>

                <div className={styles.subCategories}>
                  {category.subCategories?.length ? (
                    category.subCategories.map((subCategory) =>
                      editingSubCategory?.category === category.name &&
                      editingSubCategory.currentName === subCategory ? (
                        <form
                          className={styles.editSubCategoryForm}
                          key={subCategory}
                          onSubmit={handleUpdateSubCategory}
                        >
                          <input
                            value={editingSubCategory.name}
                            onChange={(e) =>
                              setEditingSubCategory((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            required
                            maxLength={80}
                            autoFocus
                          />
                          <button
                            type="submit"
                            className={`${styles.subCategoryAction} ${styles.saveAction}`}
                            disabled={submitting || !editingSubCategory.name.trim()}
                            title="Save"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            type="button"
                            className={`${styles.subCategoryAction} ${styles.cancelAction}`}
                            onClick={() => setEditingSubCategory(null)}
                            title="Cancel"
                          >
                            <X size={13} />
                          </button>
                        </form>
                      ) : (
                        <span className={styles.subCategoryItem} key={subCategory}>
                          {subCategory}
                          <button
                            type="button"
                            className={`${styles.subCategoryAction} ${styles.editAction}`}
                            onClick={() =>
                              setEditingSubCategory({
                                category: category.name,
                                currentName: subCategory,
                                name: subCategory,
                              })
                            }
                            title="Edit"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            className={`${styles.subCategoryAction} ${styles.deleteTextButton}`}
                            onClick={() =>
                              handleDeleteSubCategory(category.name, subCategory)
                            }
                            disabled={submitting}
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )
                    )
                  ) : (
                    <span className={styles.noSubCategories}>
                      No sub-categories yet
                    </span>
                  )}
                </div>

                <form
                  className={styles.subCategoryForm}
                  onSubmit={(e) => handleAddSubCategory(e, category.name)}
                >
                  <input
                    value={subCategoryInputs[category.name] || ""}
                    onChange={(e) =>
                      setSubCategoryInputs((prev) => ({
                        ...prev,
                        [category.name]: e.target.value,
                      }))
                    }
                    placeholder="Add a new sub-category..."
                    maxLength={80}
                  />
                  <button
                    type="submit"
                    disabled={
                      submitting || !(subCategoryInputs[category.name] || "").trim()
                    }
                  >
                    <Plus size={15} />
                    Add
                  </button>
                </form>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

export default CategoryDashboard;