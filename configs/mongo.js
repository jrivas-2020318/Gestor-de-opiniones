import mongoose, {disconnect} from "mongoose"
import Category from "../src/category/category.model.js"

export const connect = async()=>{
    try{
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | Could not be connect to mongodb')
        })
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | try conecting')
        })
        mongoose.connection.on('connected', async()=>{
            console.log('MongoDB | connected to mongodb')
            await defaultCategory()
        })
        mongoose.connection.once('open', ()=>{
            console.log('MongoDB | connected to database')
        })
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconnected to mongodb')
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected')
        })
        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50, 
                serverSelectionTimeoutMS: 5000 
            }
        )
    }catch(err){
        console.error('Database connection failed', err)
    }
}

const defaultCategory = async () => {
    try {
        let defaultCategory = await Category.findOne({ isDefault: true });
        if (!defaultCategory) {
            defaultCategory = await Category.findOne({ name: "Sin categoría" });
        }
        // Si la categoría existe pero no tiene `isDefault: true`, la actualiza
        if (defaultCategory && !defaultCategory.isDefault) {
            await Category.findByIdAndUpdate(defaultCategory._id, { isDefault: true });
            console.log("✅ Categoría existente marcada como predeterminada");
        } 
        if (!defaultCategory) {
            await Category.create({
                name: "Sin categoría",
                description: "Productos sin categoría",
                isDefault: true
            });
            console.log("✅ Categoría predeterminada creada exitosamente");
        } else {
            console.log("✅ Categoría predeterminada ya existe");
        }
    } catch (err) {
        console.error("❌ Error al verificar o crear la categoría predeterminada:", err);
    }
};


