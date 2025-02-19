import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name:{
          type: String,
          required: true,
          trim: true,   
        },
        lastname:{
            type: String,
            required: true,
            trim: true,
        },
        username:{
            type: String,
            required: true,
            unique: true,
            maxLegnth: 15,
        },
        email:{
            type: String,
            isMail:true,
            required: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        },
        password: {
            type: String,
            required: true,
            match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 
        },
        phone:{ 
            type: String,
            required: true,
            maxLength: 11,
            minLength: 8,
            
        },
        role: {
            type: String,
            required: true,
            enum: ["CLIENT", "ADMIN"],
            default: "CLIENT",
        },
        status: {
            type: Boolean,
            default: true,
        }
    }
)
export default model("User", userSchema)