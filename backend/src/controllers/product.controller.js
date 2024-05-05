import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { Product } from "../models/product.model.js"
import ApiFeatures from "../utils/ApiFeatures.js";
import { v2 as cloudinary } from "cloudinary";

const getProducts = asyncHandler(async (req, res) => {
    const resultPerPage = 12;
    const productCount = await Product.countDocuments();

    // const allProducts = await features.query;
    const allProducts = new ApiFeatures(Product.find(), req.query).search().filter()

    let products = await allProducts.query;

    let filteredProductsCount = products.length;

    allProducts.pagination(resultPerPage);

    products = await allProducts.query.clone();

    res.status(200).json(
        new ApiResponse(200, { productCount, products, resultPerPage, filteredProductsCount }, "All products fetched")
    )
})

const getAdminProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();

    res.status(200).json(
        new ApiResponse(200, products, "All products fetched")
    )
})

const addProducts = asyncHandler(async (req, res) => {
    console.log(req.body);
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    let imagesLink = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], { folder: "ecommerce/products" })
        imagesLink.push({
            public_id: result.public_id,
            url: result.url,
        })
    }

    req.body.user = req.user.id;
    req.body.images = imagesLink;
    const product = await Product.create(req?.body);

    if (!product) {
        throw new ApiError(500, "Error while storing product into database")
    }

    res.status(200).json(
        new ApiResponse(200, product, "Product added successfully")
    )
})

const updateProduct = asyncHandler(async (req, res, next) => {

    let product = await Product.findById(req?.params?.id);

    if (!product) {
        throw new ApiError(300, "Product not found")
    }

    // Images start here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // deleting images from cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.uploader.destroy(product.images[i].public_id)
        }

        let imagesLink = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], { folder: "ecommerce/products" })
            imagesLink.push({
                public_id: result.public_id,
                url: result.url,
            })
        }

        req.body.images = imagesLink;
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req?.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json(
        new ApiResponse(200, { product }, "Product updated successfully")
    )
})

const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req?.params?.id);

    if (!product) {
        throw new ApiError(300, "Product not found")
    }

    // deleting images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id)
    }

    await Product.findByIdAndDelete(req?.params?.id);

    res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    )
})

const getProductDetails = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req?.params?.id);

    if (!product) {
        throw new ApiError(300, "Product not found")
    }

    res.status(200).json(
        new ApiResponse(200, { product }, "Product fetched successfully")
    )
})

const createProductReview = asyncHandler(async (req, res) => {

    const { rating, comment, productId } = req?.body;

    const review = {
        user: req?.user?.id,
        name: req?.user?.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product?.reviews?.find((rev) => rev?.user?.toString() === req?.user?.id.toString())

    if (isReviewed) {
        product?.reviews?.forEach((rev) => {
            if (rev?.user?.toString() === req?.user?.id.toString()) {
                rev.rating = Number(rating);
                rev.comment = comment;
            }
        })
    } else {
        product?.reviews?.push(review);
        product.numOfReviews = product?.reviews?.length
    }

    let avg = 0;
    product?.reviews?.forEach((rev) => avg += rev.rating);

    product.rating = avg / product?.reviews?.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, { product }, "Product fetched successfully")
    )
})

const getAllReviews = asyncHandler(async (req, res) => {
    const product = await Product.findById(req?.query?.id);

    if (!product) {
        throw new ApiError(300, "Product not found")
    }

    res.status(200).json(
        new ApiResponse(200, product?.reviews, "Reviews fetched successfully")
    )
})

const deleteReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req?.query?.productId);
    console.log(product);

    if (!product) {
        throw new ApiError(300, "Product not found")
    }

    const reviews = product?.reviews?.filter(rev => rev?._id?.toString() !== req?.query?.id);
    console.log(reviews);

    let avg = 0;
    reviews?.forEach((rev) => avg += rev.rating);
    const rating = avg / product?.reviews?.length;
    const numOfReviews = reviews.length;
    console.log(req?.query?.productId,
        reviews, rating, numOfReviews
    );

    await Product?.findByIdAndUpdate(req?.query?.productId, {
        reviews, rating, numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json(
        new ApiResponse(200, {}, "Review deleted successfully")
    )
})

export {
    getProducts,
    addProducts,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getAllReviews,
    deleteReview,
    getAdminProducts,
};