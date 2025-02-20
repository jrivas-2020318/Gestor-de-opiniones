import { Schema, model } from "mongoose"

const categorySchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: { 
        type: String 
    },

    isDefault: { 
        type: Boolean, 
        default: false,
        required: true
    }
})


export default model("Category", categorySchema)