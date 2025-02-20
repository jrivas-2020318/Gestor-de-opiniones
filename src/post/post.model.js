import { Schema, model } from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category", 
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default model("Post", postSchema)