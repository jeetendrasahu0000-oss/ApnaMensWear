import mongoose from "mongoose";
import ProductModel from "../../products/models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";




const CreateOrder = async (req, res) => {
    try {

        console.log('hit CreateOrder Api...')

        const userId = req.user.userId;
        const commingData = req.body;

        const requiredFields = [
            "products",
            "shippingAddress"
        ];

        const missingFields = requiredFields.filter((field) => {
            const value = commingData[field];
            return (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            );
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                data: null,
                error: missingFields
            });
        }

        if (!Array.isArray(commingData.products) || commingData.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products are required",
                data: null,
                error: ["products"]
            });
        }

        const requiredAddressFields = [
            "fullName",
            "phone",
            "addressLine1",
            "city",
            "state",
            "postalCode",
            "country"
        ];

        const missingAddressFields = requiredAddressFields.filter((field) => {
            const value = commingData.shippingAddress?.[field];
            return (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            );
        });

        if (missingAddressFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Address fields are missing",
                data: null,
                error: missingAddressFields
            });
        }


        const productErrors = [];

        commingData.products.forEach((product, index) => {

            const requiredProductFields = [
                "productId",
                "quantity",
                "selectedVariant"
            ];

            const missingFields = requiredProductFields.filter((field) => {
                const value = product[field];
                return (
                    value === null ||
                    value === undefined ||
                    (typeof value === "string" && value.trim() === "")
                );
            });

            if (missingFields.length > 0) {
                productErrors.push({
                    productIndex: index,
                    missingFields
                });
            }
        });

        if (productErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Product fields are missing",
                data: null,
                error: productErrors
            });
        }

        const variantErrors = [];

        commingData.products.forEach((product, index) => {

            const requiredVariantFields = [
                "color",
                "size"
            ];

            const missingFields = requiredVariantFields.filter((field) => {
                const value = product.selectedVariant?.[field];
                return (
                    value === null ||
                    value === undefined ||
                    (typeof value === "string" && value.trim() === "")
                );
            });

            if (missingFields.length > 0) {
                variantErrors.push({
                    productIndex: index,
                    missingFields
                });
            }
        });

        if (variantErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Variant fields are missing",
                data: null,
                error: variantErrors
            });
        }


        let subtotal = 0;
        const orderItems = [];

        for (const item of commingData.products) {

            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product id",
                    data: null,
                    error: item.productId
                });
            }

            console.log('productId',item.productId)
            const product = await ProductModel.findOne({_id:item.productId});
            console.log('product',product)

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                    data: null,
                    error: `Product not found : ${item.productId}`
                });
            }

            const variant = product.variants.find(
                (variant) =>
                    variant.color === item.selectedVariant.color &&
                    variant.size === item.selectedVariant.size
            );

            if (!variant) {
                return res.status(400).json({
                    success: false,
                    message: `Variant not found for ${product.productName}`,
                    data: null,
                    error: `Variant not found for ${product.productName}`
                });
            }

            if (variant.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.productName} is out of stock`,
                    data: {
                        productId :item.productId,
                        avilableStock :variant.stock,
                    },
                    error: `${product.productName} is out of stock`
                });
            }

            const price =
                product.salePrice > 0
                    ? product.salePrice
                    : product.price;

            const itemTotal = price * item.quantity;

            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                productName: product.productName,
                coverImage: product.coverImage,

                selectedVariant: {
                    color: item.selectedVariant.color,
                    size: item.selectedVariant.size
                },

                quantity: item.quantity,
                priceAtPurchase: price,
                totalPrice: itemTotal
            });
        }

        const shippingCharge = 0;
        const discount = 0;

        const totalAmount =
            subtotal +
            shippingCharge -
            discount;

        const order = await OrderModel.create({
            user: userId,

            orderNumber: `ORD-${Date.now()}`,

            items: orderItems,

            shippingAddress: commingData.shippingAddress,

            subtotal,
            shippingCharge,
            discount,
            totalAmount,

            paymentMethod:commingData.paymentMethod || "COD",

            paymentStatus: "Pending",
            orderStatus: "Pending"
        });

        for (const item of commingData.products) {

            const product = await ProductModel.findById(item.productId);

            const variant = product.variants.find(
                (variant) =>
                    variant.color === item.selectedVariant.color &&
                    variant.size === item.selectedVariant.size
            );

            variant.stock -= item.quantity;

            await product.save();
        }

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
            error: null
        });

    } 
    catch (error) {

        console.error("Create Order Error => ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            data: null,
            error: error.message
        });
    }
};



const GetOrders = async (req, res) => {
    try {

        const userId = req.user.userId;

        const orders = await OrderModel
            .find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
            error: null
        });

    }
    catch (error) {

        console.error("Get Orders Error => ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            data: null,
            error: error.message
        });
    }
};




export {CreateOrder,GetOrders}