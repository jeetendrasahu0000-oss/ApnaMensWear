import api from "./Axios";

const isCategoryRecord = (category) =>
  category &&
  typeof category === "object" &&
  typeof category.name === "string" &&
  category.name.trim().length > 0;

const fetchCategories = async ({ includeDisabled = false } = {}) => {
  const { data } = await api.get(
    includeDisabled ? "/v1/categories/admin" : "/v1/categories"
  );

  if (!data?.success || !Array.isArray(data.data?.categories)) {
    throw new Error(data?.message || "Failed to load categories");
  }

  if (!Array.from(data.data.categories).every(isCategoryRecord)) {
    throw new Error("The server returned an invalid category record");
  }

  return data.data.categories;
};

const updateCategory = async (payload) => {
  const { data } = await api.patch("/v1/categories", payload);
  return data;
};

const setCategoryEnabled = async (category, isEnabled) => {
  const { data } = await api.patch("/v1/categories", {
    currentName: category.name,
    name: category.name,
    imageUrl: category.imageUrl || "",
    isEnabled,
  });
  return data;
};

const deleteCategory = async (name) => {
  const { data } = await api.delete("/v1/categories", { data: { name } });
  return data;
};

const updateSubCategory = async (payload) => {
  const { data } = await api.patch("/v1/categories/subcategories", payload);
  return data;
};

const deleteSubCategory = async (category, subCategory) => {
  const { data } = await api.delete("/v1/categories/subcategories", {
    data: { category, subCategory },
  });
  return data;
};

export {
  fetchCategories,
  isCategoryRecord,
  updateCategory,
  setCategoryEnabled,
  deleteCategory,
  updateSubCategory,
  deleteSubCategory,
};
