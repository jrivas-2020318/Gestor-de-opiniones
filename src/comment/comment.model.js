import { Schema, model } from "mongoose"

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
        maxLength: [150, "Can't be more than 150 characters"],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: [true, "Author is required"],
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post", 
        required: [true, "Post is required"],
    },
    isActive: {
        type: Boolean,
        default: true  // Asume que los comentarios son activos por defecto
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export default model("Comment", commentSchema)
