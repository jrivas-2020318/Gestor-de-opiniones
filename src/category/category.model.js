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
})

export default model("Category", categorySchema)