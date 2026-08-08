import UserCartModel from "../models/UserCartModel.js";
import Product from "../../products/models/ProductModel.js";



const AddToCart = async (req, res) => {
  try {
    console.log("Hit AddToCart api...");

    const userId = req.user.userId;

    const {
      productId,
      variantId,
      quantity = 1,
    } = req.body;

    if (!productId || !variantId) {
      return res.status(400).json({
        success: false,
        message: "ProductId and VariantId are required",
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
        data: null,
        error: {
          code: "INVALID_QUANTITY",
        },
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
        error: {
          code: "PRODUCT_NOT_FOUND",
        },
      });
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
        data: null,
        error: {
          code: "VARIANT_NOT_FOUND",
        },
      });
    }

    if (variant.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
        data: null,
        error: {
          code: "OUT_OF_STOCK",
        },
      });
    }

    if (parsedQuantity > variant.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} items available`,
        data: null,
        error: {
          code: "INSUFFICIENT_STOCK",
        },
      });
    }

    let cart = await UserCartModel.findOne({
      userId,
    });

    if (!cart) {
      cart = await UserCartModel.create({
        userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message:
          "This product variant is already in your cart",
        data: null,
        error: {
          code: "ITEM_ALREADY_IN_CART",
        },
      });
    }

    cart.items.push({
      productId,
      variantId,
      quantity: parsedQuantity,
    });

    await cart.save();

    console.log("Successfully added to cart");

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
      error: null,
    });
  } catch (error) {
    console.log("Failed to handle AddToCart:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      data: null,
      error: error.message,
    });
  }
};


const GetCart = async (req, res) => {
  try {
    console.log('Hit GetCart api...')
    const userId = req.user.userId;

    const cart = await UserCartModel.findOne({
      userId,
    }).populate("items.productId");

    console.log('succesfully get cart item',cart)

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
      error: null,
    });
  } 
  catch (error) {
    console.log('failed to handel GetCart')

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      data: null,
      error:error.message,
    });
  }
};

const RemoveCartItem = async (req,res) => {
  try {
    console.log('Hit RemoveCartItem api...')
    const userId = req.user.userId;
    const { itemId } = req.params;

    console.log('ItemId => ', itemId)

    const cart = await UserCartModel.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
        data: null,
        error: {
          code: "CART_NOT_FOUND",
        },
      });
    }

    console.log('CART BEFORE => ', cart.items.length)

    cart.items = cart.items.filter(
      (item) =>
        item.variantId.toString() !== itemId
    );

    console.log('CART AFTERE => ', cart.items.length)

    await cart.save();
    console.log('successfully remove item from cart ')

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      data: null,
      error: null,
    });
  } 
  catch (error) {
    console.log('failed to handel RemoveCartItem')
    return res.status(500).json({
      success: false,
      message: "Failed to remove item",
      data: null,
      error:error.message,
    });
  }
};

const UpdateCartQuantity = async (req,res) => {
  try {
    console.log('hit UpdateCartQuantity api...')
    const userId = req.user.userId;

    const { itemId, quantity } =
      req.body;

    if (!itemId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "ItemId and quantity are required",
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }

    const cart = await UserCartModel.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
        data: null,
        error: {
          code: "CART_NOT_FOUND",
        },
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
        data: null,
        error: {
          code: "ITEM_NOT_FOUND",
        },
      });
    }

    item.quantity = Number(quantity);

    await cart.save();

    console.log('successfully update cart quntity')

    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      data: cart,
      error: null,
    });
  } 
  catch (error) {
    console.log('failed to handel UpdateCartQuantity')
    return res.status(500).json({
      success: false,
      message: "Failed to update quantity",
      data: null,
      error:error.message,
    });
  }
};


export {AddToCart,GetCart,RemoveCartItem,UpdateCartQuantity}