import mongoose from "mongoose";
import slugify from 'slugify'
import ProductModel from "../models/ProductModel.js";





const RegesterProduct = async(req,res)=>{
    try{
        console.log('hit RegesterProduct api...')
        const commingData = req.body

        const requiredFields = [
            "productName",
            "shortDescription",
            "description",
            "category",
            "subCategory",
            "price",
            "salePrice",
            "weight",
            "dimensions",
            "coverImage",
            "variants",
        ];
        const requiredVariantFields = [
            "color",
            "size",
            "stock"
        ];

        const missingFields = requiredFields.filter((item)=>{
            return (
                commingData[item] === null ||
                commingData[item] === undefined ||
                commingData[item] === ""
            )
        })
        // console.log('1')

        if(missingFields.length > 0){
            return res.status(404).json({success:false,message:"required fields are missing",data:null,error:missingFields})
        }
        // console.log('2')

        if(commingData.variants){
            const variantsError = []
            let missingVarientFields

            commingData.variants.forEach((varent,index)=>{
                 missingVarientFields= requiredVariantFields.filter((item)=>{
                    return (
                        varent[item] === null ||
                        varent[item] === undefined ||
                        varent[item] === ""
                    )
                })
                if(missingVarientFields.length > 0){
                    variantsError.push({varentIndex:index,missingFields:missingVarientFields})
                }
            })

            if (variantsError.length > 0) {
                return res.status(400).json({success: false,message: "Variant fields are missing",data:null,error: variantsError});
            }
        }

        // console.log('3')

        
        let slug =  slugify(commingData.productName,{lower:true,strict:true})
        let counter = 1;
        while (await ProductModel.exists({ slug })) {
            slug = `${slug}-${counter}`;
            counter++;
        }

        const product = await ProductModel.create({
            productName: commingData.productName,
            slug:slug,
            shortDescription: commingData.shortDescription,
            description: commingData.description,
            category: commingData.category,
            subCategory: commingData.subCategory,
            brand: commingData.brand,
            price: commingData.price,
            salePrice: commingData.salePrice,
            weight: commingData.weight,
            dimensions: commingData.dimensions,
            variants: commingData.variants,
            coverImage: commingData.coverImage,
            images: commingData.images,
            tags: commingData.tags
        });

        if(!product){
            return res.status(400).json({success: false,message: "Product Regestration failed",data:null,error: null});
        }

        // console.log('4')


        return res.status(201).json({
            success: true,
            message: "Product registered successfully",
            data: product,
            error: null
        });
        
    }
    catch(error){
        console.log('failed to handel RegesterProduct api..',error)
        return res.status(500).json({success: false,message: "internal server error",data:null,error: error.message});

    }
}



const UpdateProduct = async(req,res)=>{
    try{
        console.log('hit EditProduct api...')

        const productId = req.params.id;
        const commingData = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({success:false,message:"Invalid product id",data:null, error:null});
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({success: false,message: "Product not found",data: null,error: null});
        }

        const requiredFields = [
            "productName",
            "shortDescription",
            "description",
            "category",
            "subCategory",
            "price",
            "salePrice",
            "weight",
            "dimensions",
            "coverImage",
            "variants",
        ];
        const requiredVariantFields = [
            "color",
            "size",
            "stock"
        ];

        const missingFields = requiredFields.filter((item)=>{
            return (
                commingData[item] === null ||
                commingData[item] === undefined ||
                commingData[item] === ""
            )
        })
        console.log('1')

        if(missingFields.length > 0){
            return res.status(404).json({success:false,message:"required fields are missing",data:null,error:missingFields})
        }
        console.log('2')

        if(commingData.variants){
            const variantsError = []
            let missingVarientFields

            commingData.variants.forEach((varent,index)=>{
                 missingVarientFields= requiredVariantFields.filter((item)=>{
                    return (
                        varent[item] === null ||
                        varent[item] === undefined ||
                        varent[item] === ""
                    )
                })
                if(missingVarientFields.length > 0){
                    variantsError.push({varentIndex:index,missingFields:missingVarientFields})
                }
            })

            if (variantsError.length > 0) {
                return res.status(400).json({success: false,message: "Variant fields are missing",data:null,error: variantsError});
            }
        }

        console.log('3')

        
        let slug =  slugify(commingData.productName,{lower:true,strict:true})
        let counter = 1;
        while (await ProductModel.exists({ slug,_id: { $ne: productId } })) {
            slug = `${slug}-${counter}`;
            counter++;
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            {
                productName: commingData.productName,
                slug:slug,
                shortDescription: commingData.shortDescription,
                description: commingData.description,
                category: commingData.category,
                subCategory: commingData.subCategory,
                brand: commingData.brand,
                price: commingData.price,
                salePrice: commingData.salePrice,
                weight: commingData.weight,
                dimensions: commingData.dimensions,
                variants: commingData.variants,
                coverImage: commingData.coverImage,
                images: commingData.images,
                tags: commingData.tags
            },
            {
                new:true
            }
        );

        if(!updatedProduct){
            return res.status(400).json({success: false,message: "Product updation failed",data:null,error: null});
        }

        console.log('4')


        return res.status(200).json({
            success: true,
            message: "Product update successfully",
            data: updatedProduct,
            error: null
        });
        
        
    }
    catch(error){
        console.log('failed to handel EditProduct api..')
        return res.status(500).json({success: false,message: "internal server error",data:null,error: error.message});

    }
}



const GetAllProduct = async(req,res)=>{
    try{
        console.log('hit GetAllProduct api...')

        const products = await ProductModel.find()
        
        if(!products || products.length === 0){
            return res.status(404).json({success: false,message: "Product not found",data:[],error: null});
        }

        return res.status(201).json({
            success: true,
            message: "Get Product successfully",
            data: products || [],
            error: null
        });
        
    }
    catch(error){
        console.log('failed to handel GetAllProduct api..')
        return res.status(500).json({success: false,message: "internal server error",data:null,error: error.message});

    }
}



const DeleteProduct = async(req,res)=>{
    try{
        console.log('hit DeleteProduct api...')

         const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({success:false,message:"Invalid product id",data:null, error:null});
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({success: false,message: "Product not found",data: null,error: null});
        }

        const isProductDeleted = await ProductModel.findByIdAndDelete(productId)

        if(!isProductDeleted){
            return res.status(400).json({success: false,message: "Product deletion failed",data:null,error: null});
        }
        

        return res.status(201).json({
            success: true,
            message: "Product deleted successfully",
            data: null,
            error: null
        });
        
    }
    catch(error){
        console.log('failed to handel DeleteProduct api..')
        return res.status(500).json({success: false,message: "internal server error",data:null,error: error.message});

    }
}


export {RegesterProduct,UpdateProduct,GetAllProduct,DeleteProduct}

