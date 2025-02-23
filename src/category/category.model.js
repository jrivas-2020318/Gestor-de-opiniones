import { Schema, model } from "mongoose"

const categorySchema = new Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
        trim: true,
        maxLegnth: [15, "Can't be more than 15 characters"],
    },

    description: { 
        type: String,
        maxLegnth: [150, "Can't be more than 150 characters"],
    },

    isDefault: { 
        type: Boolean, 
        default: false,
        required: true
    }
})

export default model("Category", categorySchema)