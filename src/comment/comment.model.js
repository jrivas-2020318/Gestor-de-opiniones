import { Schema, model } from "mongoose"

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },

    post: [{
        type: Schema.Types.ObjectId,
        ref: "Post", 
        required: true
    }],

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
