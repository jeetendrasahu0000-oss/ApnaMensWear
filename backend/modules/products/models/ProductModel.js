import mongoose from "mongoose";

const variants = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      trim: true,
    },
  },
);

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
    },

    subCategory: {
      type: String,
    },

    brand: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    weight: String,

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    variants: [variants],

    coverImage: {
      type: ImageSchema,
      required: true,
    },

    images: [ImageSchema],

    tags: [String],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// AUTO SLUG GENERATION
// ======================================================
// Ye hook har baar chalega jab product save hoga:
// - Naya product create
// - Product update
// - Agar slug missing hai to auto-generate
// ======================================================
productSchema.pre("save", async function (next) {
  // Sirf tab generate karo jab slug missing ho
  // (ya productName change hua ho)
  if (!this.slug || this.isModified("productName")) {
    let baseSlug = (this.productName || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // special chars hatao
      .replace(/\s+/g, "-")          // space → dash
      .replace(/-+/g, "-")           // multiple dash → single
      .replace(/^-|-$/g, "");        // start/end dash hatao

    if (!baseSlug) {
      baseSlug = `product-${Date.now()}`;
    }

    // Duplicate slug handle karo (agar same slug exist karta hai)
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (
      await mongoose.models.Product.exists({
        slug: uniqueSlug,
        _id: { $ne: this._id },
      })
    ) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }

  next();
});

export default mongoose.model("Product", productSchema);