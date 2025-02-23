import Category from "../category/category.model.js"
import Post from "../post/post.model.js"

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
    try {
        const { page = 1, limit = 20 } = req.query
        const skip = (page - 1) * limit

        const categories = await Category.find()
            .skip(skip) 
            .limit(limit); 

        const totalCategories = await Category.countDocuments()

        if (categories.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Categories not found.'
            });
        }

        return res.send({
            success: true,
            message: 'Categories found.',
            categories,
            total: totalCategories, 
            totalPages: Math.ceil(totalCategories / limit), 
            currentPage: parseInt(page), 
            pageSize: parseInt(limit) 
        })
    } catch (err) {
        console.error("❌ Error retrieving categories:", err)
        return res.status(500).send({
            success: false,
            message: 'Error retrieving categories.',
            error: err.message
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
        const { id } = req.params
        const category = await Category.findById(id)
        if (!category) return res.status(404).send({ success: false, message: "Category not found" })
        const defaultCategory = await Category.findOne({ isDefault: true }).lean()
        if (!defaultCategory) return res.status(500).send({ success: false, message: "Default category not found" })
        if (id === defaultCategory._id.toString()) 
            return res.status(400).send({ success: false, message: "Cannot delete the default category" })
        const postCount = await Post.countDocuments({ category: id });
        if (postCount) await Post.updateMany({ category: id }, { category: defaultCategory._id })
        await Category.findByIdAndDelete(id)
        return res.send({
            success: true,
            message: postCount 
                ? `Category deleted, ${postCount} posts reassigned to the default category`
                : "Category deleted successfully"
        })
    } catch (err) {
        console.error("❌ Error deleting category:", err);
        return res.status(500).send({ success: false, message: "Error deleting category", error: err.message || err })
    }
}