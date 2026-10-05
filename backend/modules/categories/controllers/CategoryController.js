import CategoryModel from "../models/CategoryModel.js";
import ProductModel from "../../products/models/ProductModel.js";

const GetCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ isEnabled: { $ne: false } })
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: { categories },
      error: null,
    });
  } catch (error) {
    console.error("GetCategories Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      data: null,
      error: error.message,
    });
  }
};

const GetAdminCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: { categories },
      error: null,
    });
  } catch (error) {
    console.error("GetAdminCategories Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      data: null,
      error: error.message,
    });
  }
};

const CreateCategory = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const imageUrl =
      typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : "";

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
        data: null,
        error: "CATEGORY_NAME_REQUIRED",
      });
    }

    const existingCategory = await CategoryModel.findOne({
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "This category already exists",
        data: null,
        error: "CATEGORY_EXISTS",
      });
    }

    const category = await CategoryModel.create({ name, imageUrl });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
      error: null,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This category already exists",
        data: null,
        error: "CATEGORY_EXISTS",
      });
    }

    console.error("CreateCategory Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      data: null,
      error: error.message,
    });
  }
};

const AddSubCategory = async (req, res) => {
  try {
    const categoryName =
      typeof req.body.category === "string" ? req.body.category.trim() : "";
    const subCategory =
      typeof req.body.subCategory === "string" ? req.body.subCategory.trim() : "";

    if (!categoryName || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "Category and sub-category names are required",
        data: null,
        error: "CATEGORY_AND_SUBCATEGORY_REQUIRED",
      });
    }

    const category = await CategoryModel.findOne({
      name: { $regex: `^${escapeRegex(categoryName)}$`, $options: "i" },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: "CATEGORY_NOT_FOUND",
      });
    }

    const existingSubCategory = category.subCategories.some(
      (item) => item.toLowerCase() === subCategory.toLowerCase()
    );

    if (existingSubCategory) {
      return res.status(409).json({
        success: false,
        message: "This sub-category already exists",
        data: null,
        error: "SUBCATEGORY_EXISTS",
      });
    }

    category.subCategories.push(subCategory);
    await category.save();

    return res.status(201).json({
      success: true,
      message: "Sub-category added successfully",
      data: category,
      error: null,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This category or sub-category already exists",
        data: null,
        error: "CATEGORY_OR_SUBCATEGORY_EXISTS",
      });
    }

    console.error("AddSubCategory Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add sub-category",
      data: null,
      error: error.message,
    });
  }
};

const UpdateCategory = async (req, res) => {
  try {
    const currentName =
      typeof req.body.currentName === "string" ? req.body.currentName.trim() : "";
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const imageUrl =
      typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : "";

    if (!currentName || !name) {
      return res.status(400).json({
        success: false,
        message: "Current and new category names are required",
        data: null,
        error: "CATEGORY_NAMES_REQUIRED",
      });
    }

    const currentNamePattern = new RegExp(`^${escapeRegex(currentName)}$`, "i");
    const category = await CategoryModel.findOne({ name: currentNamePattern });
    const conflictingCategory = await CategoryModel.findOne({
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
      ...(category ? { _id: { $ne: category._id } } : {}),
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: "CATEGORY_NOT_FOUND",
      });
    }

    if (conflictingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with that name already exists",
        data: null,
        error: "CATEGORY_EXISTS",
      });
    }

    const productMatch = { category: currentNamePattern };
    if (currentName !== name) {
      await ProductModel.updateMany(productMatch, { $set: { category: name } });
    }

    category.name = name;
    category.imageUrl = imageUrl;
    if (typeof req.body.isEnabled === "boolean") {
      category.isEnabled = req.body.isEnabled;
    }
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
      error: null,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with that name already exists",
        data: null,
        error: "CATEGORY_EXISTS",
      });
    }

    console.error("UpdateCategory Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      data: null,
      error: error.message,
    });
  }
};

const DeleteCategory = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
        data: null,
        error: "CATEGORY_NAME_REQUIRED",
      });
    }

    const pattern = new RegExp(`^${escapeRegex(name)}$`, "i");
    const result = await CategoryModel.deleteOne({ name: pattern });
    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: "CATEGORY_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: null,
      error: null,
    });
  } catch (error) {
    console.error("DeleteCategory Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      data: null,
      error: error.message,
    });
  }
};

const UpdateSubCategory = async (req, res) => {
  try {
    const categoryName =
      typeof req.body.category === "string" ? req.body.category.trim() : "";
    const currentName =
      typeof req.body.currentName === "string" ? req.body.currentName.trim() : "";
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (!categoryName || !currentName || !name) {
      return res.status(400).json({
        success: false,
        message: "Category, current sub-category, and new name are required",
        data: null,
        error: "SUBCATEGORY_NAMES_REQUIRED",
      });
    }

    const categoryPattern = new RegExp(`^${escapeRegex(categoryName)}$`, "i");
    const currentPattern = new RegExp(`^${escapeRegex(currentName)}$`, "i");
    const category = await CategoryModel.findOne({ name: categoryPattern });
    const duplicateStoredName = category?.subCategories.some(
      (subCategory) =>
        subCategory.toLowerCase() === name.toLowerCase() &&
        subCategory.toLowerCase() !== currentName.toLowerCase()
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: "CATEGORY_NOT_FOUND",
      });
    }

    if (duplicateStoredName) {
      return res.status(409).json({
        success: false,
        message: "This sub-category name already exists",
        data: null,
        error: "SUBCATEGORY_EXISTS",
      });
    }

    const matchingIndex = category.subCategories.findIndex(
      (subCategory) => subCategory.toLowerCase() === currentName.toLowerCase()
    );
    if (matchingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
        data: null,
        error: "SUBCATEGORY_NOT_FOUND",
      });
    }
    category.subCategories[matchingIndex] = name;
    await ProductModel.updateMany(
      { category: categoryPattern, subCategory: currentPattern },
      { $set: { subCategory: name } }
    );
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Sub-category updated successfully",
      data: category,
      error: null,
    });
  } catch (error) {
    console.error("UpdateSubCategory Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update sub-category",
      data: null,
      error: error.message,
    });
  }
};

const DeleteSubCategory = async (req, res) => {
  try {
    const categoryName =
      typeof req.body.category === "string" ? req.body.category.trim() : "";
    const subCategoryName =
      typeof req.body.subCategory === "string" ? req.body.subCategory.trim() : "";

    if (!categoryName || !subCategoryName) {
      return res.status(400).json({
        success: false,
        message: "Category and sub-category names are required",
        data: null,
        error: "CATEGORY_AND_SUBCATEGORY_REQUIRED",
      });
    }

    const categoryPattern = new RegExp(`^${escapeRegex(categoryName)}$`, "i");
    const subCategoryPattern = new RegExp(`^${escapeRegex(subCategoryName)}$`, "i");
    const category = await CategoryModel.findOne({ name: categoryPattern });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: "CATEGORY_NOT_FOUND",
      });
    }

    const previousLength = category.subCategories.length;
    category.subCategories = category.subCategories.filter(
      (subCategory) => !subCategoryPattern.test(subCategory)
    );

    if (category.subCategories.length === previousLength) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
        data: null,
        error: "SUBCATEGORY_NOT_FOUND",
      });
    }

    await category.save();
    return res.status(200).json({
      success: true,
      message: "Sub-category deleted successfully",
      data: category,
      error: null,
    });
  } catch (error) {
    console.error("DeleteSubCategory Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete sub-category",
      data: null,
      error: error.message,
    });
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export {
  GetCategories,
  GetAdminCategories,
  CreateCategory,
  AddSubCategory,
  UpdateCategory,
  DeleteCategory,
  UpdateSubCategory,
  DeleteSubCategory,
};
