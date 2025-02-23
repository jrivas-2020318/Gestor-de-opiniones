import { Schema, model } from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"], 
        trim: true,
        maxLegnth: [150, "Can't be more than 150 characters"]
    },

    content: {
        type: String,
        required: [true, "Content is required"],
        maxLegnth: [400, "Content too long"]
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"]
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category", 
        required: [true, "Category is required"]
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