import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter the description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter the product price"],
        maxlengthL: [8, "Price cannot exceed from 8 digits"]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Category required"]
    },
    stock: {
        type: Number,
        required: [true, "Stock required"],
        maxlengthL: [4, "Price cannot exceed from 4 digits"],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);