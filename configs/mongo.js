import mongoose from "mongoose";
import Category from "../src/category/category.model.js";
import User from "../src/user/user.model.js"; // Asegúrate de que la ruta al modelo de usuario es correcta
import argon2 from 'argon2'; // Importar argon2

export const connect = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | Could not connect to mongodb')
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Try connecting')
        });
        mongoose.connection.on('connected', async () => {
            console.log('MongoDB | Connected to mongodb')
            await defaultCategory()
            await createDefaultAdmin()
        });
        mongoose.connection.once('open', () => {
            console.log('MongoDB | Connected to database')
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconnected to mongodb')
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Disconnected')
        })
        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50,
                serverSelectionTimeoutMS: 5000
            }
        );
    } catch (err) {
        console.error('Database connection failed', err);
    }
}

const defaultCategory = async () => {
    try {
        let defaultCategory = await Category.findOne({ isDefault: true });
        if (!defaultCategory) {
            defaultCategory = await Category.findOne({ name: "Sin categoría" })
        }
        if (defaultCategory && !defaultCategory.isDefault) {
            await Category.findByIdAndUpdate(defaultCategory._id, { isDefault: true })
            console.log("✅ Categoría existente marcada como predeterminada")
        }
        if (!defaultCategory) {
            await Category.create({
                name: "Sin categoría",
                description: "Productos sin categoría",
                isDefault: true
            });
            console.log("✅ Categoría predeterminada creada exitosamente")
        } else {
            console.log("✅ Categoría predeterminada ya existe")
        }
    } catch (err) {
        console.error("❌ Error al verificar o crear la categoría predeterminada:", err)
    }
}

const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'ADMIN' })
        if (adminExists) {
            console.log('✅ Admin account already exists.')
            return;
        }

        const hashedPassword = await argon2.hash('J0s3Jul1@n11')
        const newAdmin = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin',
            lastname: 'User',
            phone: '1234567890',
            role: 'ADMIN'
        });

        await newAdmin.save();
        console.log('✅ Admin account created successfully.')
    } catch (error) {
        console.error('❌ Failed to create admin account:', error)
    }
};

