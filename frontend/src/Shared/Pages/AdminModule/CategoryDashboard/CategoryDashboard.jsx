import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Trash2,
  X,
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

  useEffect(() => {
    const timeoutId = setTimeout(loadCategories, 0);
    return () => clearTimeout(timeoutId);
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

      return currentCategories.sort((first, second) =>
        first.name.localeCompare(second.name)
      );
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
      const responseCategory = [
        data?.data,
        data?.data?.category,
        data?.category,
      ].find(isCategoryRecord);
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
      const responseCategory = [
        data?.data,
        data?.data?.category,
        data?.category,
      ].find(isCategoryRecord);
      const subCategories =
        responseCategory?.subCategories ||
        [...(existingCategory.subCategories || []), subCategory];
      applyCategoryUpdate(existingCategory, { subCategories }, data);
      setSubCategoryInputs((previous) => ({
        ...previous,
        [category]: "",
      }));
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
      console.error("Category update request failed", {
        status: updateError.response?.status,
        response: updateError.response?.data,
        message: updateError.message,
      });
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
      setCategories((previous) =>
        previous.filter(
          (item) => isCategoryRecord(item) && item.name !== category.name
        )
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
      const { data } = await setCategoryEnabled(
        category,
        isEnabled
      );
      ensureMutationSucceeded(data, "Failed to update category visibility");
      applyCategoryUpdate(category, { isEnabled }, data);
      setNotice(
        data.message ||
          `Category ${isEnabled ? "enabled" : "disabled"} successfully`
      );
    } catch (toggleError) {
      console.error("Category visibility request failed", {
        status: toggleError.response?.status,
        response: toggleError.response?.data,
        message: toggleError.message,
      });
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
          isCategoryRecord(item) &&
          item.name === editingSubCategory.category
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
      const subCategories = (currentCategory.subCategories || []).map(
        (subCategory) =>
          subCategory.toLowerCase() ===
          editingSubCategory.currentName.toLowerCase()
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

  return (
    <section className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Catalog</p>
          <h1>Categories</h1>
          <p>Manage the categories and sub-categories used by your products.</p>
        </div>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={loadCategories}
          disabled={loading}
          aria-label="Refresh categories"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {notice && <p className={styles.notice} role="status">{notice}</p>}

      <form className={styles.createForm} onSubmit={handleCreateCategory}>
        <h2>Add a category</h2>
        <div className={styles.formFields}>
          <label>
            Category name
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="e.g. Jackets"
              required
              maxLength={80}
            />
          </label>
          <label>
            Image URL <span>(optional)</span>
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/category.jpg"
            />
          </label>
          <button type="submit" disabled={submitting || !categoryName.trim()}>
            <Plus size={17} />
            Add Category
          </button>
        </div>
      </form>

      <div className={styles.categoryList}>
        <h2>Categories and sub-categories</h2>
        <p className={styles.sourceNote}>
          Categories and sub-categories are managed here. Disabled categories
          are hidden from the store; permanently deleting a category also hides
          its products until they are assigned to another category.
        </p>
        {loading ? (
          <p className={styles.emptyState}>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className={styles.emptyState}>
            No categories yet. Add a category above to get started.
          </p>
        ) : (
          categories.filter(isCategoryRecord).map((category) => (
            <article className={styles.categoryCard} key={category.name}>
              <div className={styles.categoryHeading}>
                {editingCategory?.currentName === category.name ? (
                  <form
                    className={styles.editCategoryForm}
                    onSubmit={(event) => handleUpdateCategory(event, category.name)}
                  >
                    <label>
                      Category name
                      <input
                        value={editingCategory.name}
                        onChange={(event) =>
                          setEditingCategory((previous) => ({
                            ...previous,
                            name: event.target.value,
                          }))
                        }
                        required
                        maxLength={80}
                      />
                    </label>
                    <label>
                      Image URL
                      <input
                        type="url"
                        value={editingCategory.imageUrl}
                        onChange={(event) =>
                          setEditingCategory((previous) => ({
                            ...previous,
                            imageUrl: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className={styles.actions}>
                      <button
                        type="submit"
                        className={`${styles.iconButton} ${styles.saveAction}`}
                        disabled={submitting || !editingCategory.name.trim()}
                        aria-label={`Save ${category.name}`}
                        title="Save category"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.cancelAction}`}
                        onClick={() => setEditingCategory(null)}
                        aria-label="Cancel category edit"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {category.imageUrl && (
                      <img
                        className={styles.categoryImage}
                        src={category.imageUrl}
                        alt=""
                      />
                    )}
                    {!category.imageUrl && (
                      <span
                        className={styles.categoryImagePlaceholder}
                        aria-hidden="true"
                      >
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    )}
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
                      {category.isEnabled === false ? "Hidden from store" : "Visible in store"}
                    </span>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => handleToggleCategory(category)}
                        disabled={submitting}
                        aria-label={`${category.isEnabled === false ? "Enable" : "Disable"} ${category.name}`}
                        title={`${category.isEnabled === false ? "Enable" : "Disable"} category`}
                      >
                        <Power size={16} />
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
                        aria-label={`Edit ${category.name}`}
                        title="Edit category"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteCategory(category)}
                        disabled={submitting}
                        aria-label={`Delete ${category.name}`}
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className={styles.subCategories}>
                {category.subCategories?.length ? (
                  category.subCategories.map((subCategory) => (
                    editingSubCategory?.category === category.name &&
                    editingSubCategory.currentName === subCategory ? (
                      <form
                        className={styles.editSubCategoryForm}
                        key={subCategory}
                        onSubmit={handleUpdateSubCategory}
                      >
                        <input
                          value={editingSubCategory.name}
                          onChange={(event) =>
                            setEditingSubCategory((previous) => ({
                              ...previous,
                              name: event.target.value,
                            }))
                          }
                          aria-label={`Edit ${subCategory}`}
                          required
                          maxLength={80}
                          autoFocus
                        />
                        <button
                          type="submit"
                          className={`${styles.iconButton} ${styles.saveAction}`}
                          disabled={submitting || !editingSubCategory.name.trim()}
                          aria-label={`Save ${subCategory}`}
                          title="Save sub-category"
                        >
                          <Check size={15} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.cancelAction}`}
                          onClick={() => setEditingSubCategory(null)}
                          aria-label="Cancel sub-category edit"
                          title="Cancel"
                        >
                          <X size={15} />
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
                          aria-label={`Edit ${subCategory}`}
                          title="Edit sub-category"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.subCategoryAction} ${styles.deleteTextButton}`}
                          onClick={() =>
                            handleDeleteSubCategory(category.name, subCategory)
                          }
                          disabled={submitting}
                          aria-label={`Delete ${subCategory}`}
                          title="Delete sub-category"
                        >
                          <Trash2 size={13} />
                        </button>
                      </span>
                    )
                  ))
                ) : (
                  <span className={styles.noSubCategories}>
                    No sub-categories
                  </span>
                )}
              </div>
              <form
                className={styles.subCategoryForm}
                onSubmit={(event) => handleAddSubCategory(event, category.name)}
              >
                <label htmlFor={`subcategory-${category.name}`}>
                  Add a sub-category
                </label>
                <input
                  id={`subcategory-${category.name}`}
                  value={subCategoryInputs[category.name] || ""}
                  onChange={(event) =>
                    setSubCategoryInputs((previous) => ({
                      ...previous,
                      [category.name]: event.target.value,
                    }))
                  }
                  placeholder={`Add a sub-category to ${category.name}`}
                  aria-label={`Sub-category for ${category.name}`}
                  maxLength={80}
                />
                <button
                  type="submit"
                  disabled={submitting || !(subCategoryInputs[category.name] || "").trim()}
                >
                  <Plus size={17} />
                  Add sub-category
                </button>
              </form>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default CategoryDashboard;
