import { useState, useEffect } from "react";
import { X, Plus, Trash2, CheckCircle, AlertCircle, Loader } from "lucide-react";
import api from "../../../../Api/Axios";
import styles from "./ProductRegester.module.css";
import UploadImage from "../../../components/Cloudinary/UploadImage";
import { GetCategories } from "../../../../StataicData/StaticData";



function ProductRegister({ onClose, onCreated }) {

  const [form, setForm] = useState({
    productName: "",
    shortDescription: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    price: "",
    salePrice: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    coverImage: {},
    images: [],
  });

  const [variants, setVariants] = useState([{ color: "", size: "", stock: "" }]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);


  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };


  const categoies = GetCategories()
  console.log('Categories', categoies)

  // ---- variant handlers ----
  const updateVariant = (index, key, value) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };
  const addVariant = () => {
    setVariants((prev) => [...prev, { color: "", size: "", stock: "" }]);
  };
  const removeVariant = (index) => {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // ---- tag handlers ----
  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };
  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const validate = () => {
    const e = {};
    if (!form.productName.trim()) e.productName = "Product name is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (form.salePrice && Number(form.salePrice) > Number(form.price)) {
      e.salePrice = "Sale price can't be higher than the regular price";
    }
    if (!form.coverImage) e.coverImage = "Cover image URL is required";

    const hasIncompleteVariant = variants.some(
      (v) => !v.color.trim() || !v.size.trim() || v.stock === ""
    );
    if (hasIncompleteVariant) e.variants = "Every variant needs a color, size, and stock count";

    setErrors(e);
    return e;
  };

  const CoverImageHandeler = (data) => {
    setForm((prev) => {
      return {
        ...prev,
        coverImage: data[0]
      }
    })
  }

  const ImagesHandeler = (data) => {
    setForm((prev) => {
      return {
        ...prev,
        images: data
      }
    })
  }


  console.log('final data ', form)

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      document.querySelector(`.${styles.form}`)?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      productName: form.productName.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      subCategory: form.subCategory.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      salePrice: form.salePrice === "" ? undefined : Number(form.salePrice),
      weight: form.weight.trim(),
      dimensions: {
        length: Number(form.length) || 0,
        width: Number(form.width) || 0,
        height: Number(form.height) || 0,
      },
      variants: variants.map((v) => ({
        color: v.color.trim(),
        size: v.size.trim(),
        stock: Number(v.stock),
      })),
      tags,
      coverImage: form.coverImage,
      images: form.images,
    };

    setSubmitting(true);

    try {
      const response = await api.post("/v1/products/regester", payload);
      console.log('response => ', response.data)

      alert(response.data.message)
      onCreated(response.data.data);
    }
    catch (error) {
      const errData = error.response.data;
      if (errData.error && Array.isArray(errData.error)) {
        const fieldErrors = {};
        const labelMap = {
          productName: "Product name",
          shortDescription: "Short description",
          description: "Description",
          category: "Category",
          subCategory: "Sub-category",
          brand: "Brand",
          price: "Price",
          salePrice: "Sale price",
          weight: "Weight",
          dimensions: "Dimensions",
          variants: "Variants",
          tags: "Tags",
          coverImage: "Cover image",
          images: "Images",
        };
        errData.error.forEach((field) => { fieldErrors[field] = `${labelMap[field] || field} is missing` });
        setErrors(fieldErrors);
      }
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      setApiError(msg);
      alert(msg)
    }
    finally {
      setSubmitting(false);
    }
  };

  // ---- render ----
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <h2>Add Product</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>

          {/* ---- Basics ---- */}
          <div className={styles.sectionTitle}>Basics</div>

          <div className={styles.fieldWrap}>
            <label>Product name <span className={styles.required}>*</span></label>
            <input
              value={form.productName}
              onChange={(e) => updateForm("productName", e.target.value)}
              className={errors.productName ? styles.inputError : ""}
              placeholder="e.g. Premium Wireless Headphones"
            />
            {errors.productName && <p className={styles.errorText}>{errors.productName}</p>}
          </div>

          <div className={styles.fieldWrap}>
            <label>Short description</label>
            <input
              value={form.shortDescription}
              onChange={(e) => updateForm("shortDescription", e.target.value)}
              placeholder="Brief summary"
            />
            {errors.shortDescription && <p className={styles.errorText}>{errors.shortDescription}</p>}
          </div>

          <div className={styles.fieldWrap}>
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Full product description"
            />
            {errors.description && <p className={styles.errorText}>{errors.description}</p>}
          </div>

          {/* ---- Classification ---- */}
          <div className={styles.sectionTitle}>Classification</div>

          <div className={styles.grid3}>


            {/* <div className={styles.fieldWrap}>
              <label>Category <span className={styles.required}>*</span></label>
              <input
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                className={errors.category ? styles.inputError : ""}
                placeholder="e.g. Electronics"
              />
              {errors.category && <p className={styles.errorText}>{errors.category}</p>}
            </div> */}

            <div className={styles.fieldWrap}>
              <label>
                Category <span className={styles.required}>*</span>
              </label>

              <select
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                className={`${styles.select} ${errors.category ? styles.inputError : ""}`}
              >
                <option value="">Select Category</option>

                {categoies.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className={styles.errorText}>{errors.category}</p>
              )}
            </div>

            <div className={styles.fieldWrap}>
              <label>Sub‑category</label>
              <input
                value={form.subCategory}
                onChange={(e) => updateForm("subCategory", e.target.value)}
                placeholder="e.g. Headphones"
              />
              {errors.subCategory && <p className={styles.errorText}>{errors.subCategory}</p>}
            </div>


            <div className={styles.fieldWrap}>
              <label>Brand</label>
              <input
                value={form.brand}
                onChange={(e) => updateForm("brand", e.target.value)}
                placeholder="e.g. Sony"
              />
              {errors.brand && <p className={styles.errorText}>{errors.brand}</p>}
            </div>
          </div>

          {/* ---- Pricing & Shipping ---- */}
          <div className={styles.sectionTitle}>Pricing &amp; Shipping</div>

          <div className={styles.grid3}>
            <div className={styles.fieldWrap}>
              <label>Price (₹) <span className={styles.required}>*</span></label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
                className={errors.price ? styles.inputError : ""}
                placeholder="0"
              />
              {errors.price && <p className={styles.errorText}>{errors.price}</p>}
            </div>
            <div className={styles.fieldWrap}>
              <label>Sale price (₹)</label>
              <input
                type="number"
                value={form.salePrice}
                onChange={(e) => updateForm("salePrice", e.target.value)}
                className={errors.salePrice ? styles.inputError : ""}
                placeholder="0"
              />
              {errors.salePrice && <p className={styles.errorText}>{errors.salePrice}</p>}
            </div>
            <div className={styles.fieldWrap}>
              <label>Weight</label>
              <input
                value={form.weight}
                onChange={(e) => updateForm("weight", e.target.value)}
                className={errors.weight ? styles.inputError : ""}
                placeholder="e.g. 250g"
              />
              {errors.weight && <p className={styles.errorText}>{errors.weight}</p>}
            </div>
          </div>

          <div className={styles.grid3}>
            <div className={styles.fieldWrap}>
              <label>Length (cm)</label>
              <input
                type="number"
                value={form.length}
                onChange={(e) => updateForm("length", e.target.value)}
                placeholder="0"
              />
              {errors.length && <p className={styles.errorText}>{errors.length}</p>}

            </div>
            <div className={styles.fieldWrap}>
              <label>Width (cm)</label>
              <input
                type="number"
                value={form.width}
                onChange={(e) => updateForm("width", e.target.value)}
                placeholder="0"
              />
              {errors.width && <p className={styles.errorText}>{errors.width}</p>}

            </div>
            <div className={styles.fieldWrap}>
              <label>Height (cm)</label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => updateForm("height", e.target.value)}
                placeholder="0"
              />
              {errors.height && <p className={styles.errorText}>{errors.height}</p>}
            </div>
          </div>

          {/* ---- Variants ---- */}
          <div className={styles.sectionTitle}>Variants</div>
          {errors.variants && <p className={styles.errorText}>{errors.variants}</p>}

          <div className={styles.variantList}>
            {variants.map((variant, index) => (
              <div key={index} className={styles.variantRow}>
                <input
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) => updateVariant(index, "color", e.target.value)}
                />
                {/* <input
                  placeholder="Size"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                /> */}

                <select
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                >
                  <option value="">Select Size</option>

                  {/* Clothing Sizes */}
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="XXXL">XXXL</option>

                  {/* Pants / Jeans Waist Sizes */}
                  <option value="28">28</option>
                  <option value="30">30</option>
                  <option value="32">32</option>
                  <option value="34">34</option>
                  <option value="36">36</option>
                  <option value="38">38</option>
                  <option value="40">40</option>
                  <option value="42">42</option>
                  <option value="44">44</option>
                  <option value="46">46</option>

                  <option value="OTHER">Other Size</option>
                </select>

                {variant.size === "OTHER" && (
                  <input
                    placeholder="Enter custom size"
                    value={variant.customSize || ""}
                    onChange={(e) =>
                      updateVariant(index, "customSize", e.target.value)
                    }
                  />
                )}

                <input
                  placeholder="Stock"
                  type="number"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, "stock", e.target.value)}
                />
                <button
                  type="button"
                  className={styles.removeRowBtn}
                  onClick={() => removeVariant(index)}
                  disabled={variants.length === 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className={styles.addRowBtn} onClick={addVariant}>
            <Plus size={14} /> Add variant
          </button>

          {/* ---- Tags ---- */}
          <div className={styles.sectionTitle}>Tags</div>
          <div className={styles.chipInputRow}>
            <input
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button type="button" onClick={addTag}>Add</button>
          </div>
          <div className={styles.chipRow}>
            {tags.map((tag) => (
              <span key={tag} className={styles.chip}>
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>

          {/* ---- Media ---- */}
          <div className={styles.sectionTitle}>Media</div>

          <label>Cover image<span className={styles.required}>*</span></label>
          <UploadImage
            onChange={(data) => {
              console.log('data=>', data)
              CoverImageHandeler(data)
            }}

            type={'product'}

            maxImageCount={1}

          />

          <label>Upload multiple images <span className={styles.required}>*</span></label>
          <UploadImage
            onChange={(data) => {
              console.log('data=>', data)
              ImagesHandeler(data)
            }}

            type={'product'}

          />





          {/* ---- Footer ---- */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader size={16} className={styles.spinner} /> Saving…
                </>
              ) : (
                "Create product"
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default ProductRegister;



