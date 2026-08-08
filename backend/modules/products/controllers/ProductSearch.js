import ProductModel from "../models/ProductModel.js";





const GetProductDetails = async (req, res) => {
    try {

        const { slug } = req.params;

        const product = await ProductModel.findOne({
            slug,
            isActive: true
        }).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                data: null,
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
            error: null
        });

    } catch (error) {
        console.error("GetProductDetails Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message
        });

    }
};



const GetProductsByCategory = async (req,res)=>{
    try{

        const category = req.params.category;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const products = await ProductModel.find({
            category,
            isActive:true
        })
        .skip(skip)
        .limit(limit);

        const totalProducts = await ProductModel.countDocuments({category,isActive:true });

        return res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            data:{
                products,
                pagination:{
                    page,
                    limit,
                    totalProducts,
                    totalPages:Math.ceil(totalProducts/limit)
                }
            },
            error:null
        });

    }
    catch(error){
        return res.status(500).json({success:false,message:"Internal server error",data:null,error:error.message});
    }
}


// const GetRelatedProducts = async (req, res) => {
//     try {

//         const productId = req.params.id;
//         const page = Math.max(Number(req.query.page) || 1, 1);
//         const limit = Math.max(Number(req.query.limit) || 10, 1);

//         const skip = (page - 1) * limit;

//         const product = await ProductModel.findById(productId).select("category subCategory").lean();

//         if (!product) {
//             return res.status(404).json({success: false,message: "Product not found",data: null,error: null});
//         }

//         const baseMatch = {
//             _id: { $ne: product._id },
//             isActive: true
//         };

//         const [products, totalProductsResult] = await Promise.all([

//             ProductModel.aggregate([
//                 {
//                     $match: baseMatch
//                 },
//                 {
//                     $addFields: {
//                         priority: {
//                             $cond: [
//                                 {
//                                     $and: [
//                                         { $eq: ["$category", product.category] },
//                                         { $eq: ["$subCategory", product.subCategory] }
//                                     ]
//                                 },
//                                 1,
//                                 2
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     $sort: {
//                         priority: 1,
//                         createdAt: -1
//                     }
//                 },
//                 {
//                     $skip: skip
//                 },
//                 {
//                     $limit: limit
//                 },
//                 {
//                     $project: {
//                         priority: 0
//                     }
//                 }
//             ]),

//             ProductModel.countDocuments(baseMatch)

//         ]);

//         const totalPages = Math.ceil(totalProductsResult / limit);

//         return res.status(200).json({
//             success: true,
//             message: "Products fetched successfully",
//             data: {
//                 products,
//                 pagination: {
//                     page,
//                     limit,
//                     totalProducts: totalProductsResult,
//                     totalPages,
//                     hasNextPage: page < totalPages,
//                     hasPrevPage: page > 1,
//                     nextPage: page < totalPages ? page + 1 : null,
//                     prevPage: page > 1 ? page - 1 : null
//                 }
//             },
//             error: null
//         });

//     } catch (error) {

//         console.error("GetRelatedProducts Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             data: null,
//             error: error.message
//         });

//     }
// };



const GetRelatedProducts = async (req, res) => {
    try {

        const {
            id,
            slug,
            category,
            subCategory,
        } = req.query;

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const skip = (page - 1) * limit;

        if (!id && !slug && !category && !subCategory) {
            return res.status(400).json({
                success: false,
                message: "At least one of id, slug, category, or subCategory is required",
                data: null,
                error: null
            });
        }

        // step 1: resolve a reference product if id or slug was given
        // (gives us category/subCategory to prioritize against, and an _id to exclude)
        let refProduct = null;

        if (id) {
            refProduct = await ProductModel.findById(id).select("category subCategory").lean();
        } else if (slug) {
            refProduct = await ProductModel.findOne({ slug }).select("category subCategory").lean();
        }

        if ((id || slug) && !refProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                data: null,
                error: null
            });
        }

        // step 2: build the match — explicit query params override the resolved product's fields
        const effectiveCategory = category || refProduct?.category;
        const effectiveSubCategory = subCategory || refProduct?.subCategory;

        const baseMatch = { isActive: true };

        if (refProduct?._id) {
            baseMatch._id = { $ne: refProduct._id };
        }

        if (effectiveCategory) {
            baseMatch.category = effectiveCategory;
        }

        // step 3: priority scoring only makes sense when we have both fields to weigh
        // (subCategory match ranked above plain category match)
        const hasPriorityFields = Boolean(effectiveCategory && effectiveSubCategory);

        const pipeline = [{ $match: baseMatch }];

        if (hasPriorityFields) {
            pipeline.push(
                {
                    $addFields: {
                        priority: {
                            $cond: [
                                { $eq: ["$subCategory", effectiveSubCategory] },
                                1,
                                2
                            ]
                        }
                    }
                },
                { $sort: { priority: 1, createdAt: -1 } }
            );
        } else {
            pipeline.push({ $sort: { createdAt: -1 } });
        }

        pipeline.push(
            { $skip: skip },
            { $limit: limit }
        );

        if (hasPriorityFields) {
            pipeline.push({ $project: { priority: 0 } });
        }

        const [products, totalProductsResult] = await Promise.all([
            ProductModel.aggregate(pipeline),
            ProductModel.countDocuments(baseMatch)
        ]);

        const totalPages = Math.ceil(totalProductsResult / limit);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    page,
                    limit,
                    totalProducts: totalProductsResult,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                    nextPage: page < totalPages ? page + 1 : null,
                    prevPage: page > 1 ? page - 1 : null
                }
            },
            error: null
        });

    } catch (error) {

        console.error("GetRelatedProducts Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message
        });

    }
};

const GetFillterdProducts = async (req, res) => {
    try {

        const {
            page = 1,
            limit = 10,
            category,
            subCategory,
            brand,
            search,
            minPrice,
            maxPrice,
            sort = "newest"
        } = req.query;

        const query = {isActive: true};

        // Dynamic Filters
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;
        if (brand) query.brand = brand;

        // Search
        if (search) {
            query.productName = { $regex: search, $options: "i" };
        }

        // Price Range
        if (minPrice || maxPrice) {
            query.price = {};

            if (minPrice) { query.price.$gte = Number(minPrice)}
            if (maxPrice) {query.price.$lte = Number(maxPrice)}
        }

        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            priceAsc: { price: 1 },
            priceDesc: { price: -1 },
            nameAsc: { productName: 1 },
            nameDesc: { productName: -1 }
        };

        const sortOption = sortMap[sort] || sortMap.newest;

        const skip = (Number(page) - 1) * Number(limit);

        const [products, totalProducts] = await Promise.all([
            ProductModel.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit))
                .lean(),

            ProductModel.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalProducts,
                    totalPages: Math.ceil(totalProducts / Number(limit))
                }
            },
            error: null
        });

    } catch (error) {
        return res.status(500).json({success: false,message: "Internal server error",data: null,error: error.message});
    }
};


const SearchProducts = async (req, res) => {
    try {

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const search = req.query.q?.trim();

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
                data: null,
                error: "missing_search_query"
            });
        }

        const skip = (page - 1) * limit;

        const query = {
            isActive: true,
            $or: [
                { productName: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { subCategory: { $regex: search, $options: "i" } }
            ]
        };

        const [products, totalProducts] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            ProductModel.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    page,
                    limit,
                    totalProducts,
                    totalPages: Math.ceil(totalProducts / limit),
                    hasNextPage: page * limit < totalProducts,
                    hasPrevPage: page > 1
                }
            },
            error: null
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: error.message
        });
    }
};




export {GetProductDetails,GetProductsByCategory,GetRelatedProducts,GetFillterdProducts,SearchProducts}