import Category from "../category/category.model.js"

export const save = async (req, res) => {
    const data = req.body
    try {
        if (!data.name || data.name.trim() === "") {
            return res.status(400).send({
                success: false,
                message: "The category name is required"
            })
        }

        const category = new Category(data)
        await category.save()
        return res.send({
            success: true,
            message: `Categoría '${category.name}' Saved successfully`
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error when adding category',
            err
        })
    }
}

export const getAll = async (req, res) => {
    const { limit, skip } = req.query
    try {
        const categories = await Category.find().skip(skip).limit(limit)
        if (categories.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Categories not found.'
            })
        }
        return res.send({
            success: true,
            message: 'Categories found.:',
            total: categories.length,
            categories
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error retrieving categories.',
            err
        })
    }
}


export const get = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findById(id)
        if (!category) return res.status(404).send({
            success: false,
            message: 'Category not found.a'
        })
        return res.send({
            success: true,
            message: 'Category found::',
            category
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error retrieving category.',
            err
        })
    }
}

export const update = async (req, res) => {
    const { id } = req.params
    const data = req.body
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true })
        if (!updatedCategory) return res.status(404).send({
            success: false,
            message: 'Category not found, not updated.'
        })
        return res.send({
            success: true,
            message: 'Category updated successfully.',
            updatedCategory
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error updating category.',
            err
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).send({ success: false, message: "Access denied: Only the administrator can delete categories" });
        }
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send({ success: false, message: "Category not found" });
        }
        const defaultCategory = await Category.findOne({ isDefault: true });
        if (id === defaultCategory._id.toString()) {
            return res.status(400).send({ success: false, message: "Cannot delete the default category" });
        }
        const productCount = await Product.countDocuments({ category: id });
        if (productCount > 0) {
            await Product.updateMany({ category: id }, { category: defaultCategory._id });
        }
        await Category.findByIdAndDelete(id);
        return res.send({ 
            success: true, 
            message: productCount > 0 
                ? "Category deleted successfully, and products reassigned to the default category" 
                : "Category deleted successfully (no products to reassign)"
        });
    } catch (err) {
        console.error("❌ Error deleting category:", err);
        return res.status(500).send({ success: false, message: "Error deleting category", error: err.message || err });
    }
}


