import Post from "../post/post.model.js"
import Category from "../category/category.model.js"

export const createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body
        const author = req.user.id 
        if (!title || !content || !category) {
            return res.status(400).send({ success: false, message: "Title, content, and category are required" })
        }
        const categoryExists = await Category.findById(category)
        if (!categoryExists) {
            return res.status(404).send({ success: false, message: "Category not found" })
        }
        const newPost = await Post.create({ title, content, author, category })
        return res.status(201).send({ success: true, message: "Post created successfully", post: newPost })
    } catch (err) {
        console.error("❌ Error creating post:", err)
        return res.status(500).send({ success: false, message: "Error creating post", error: err.message })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "username").populate("category", "name")
        return res.send({ success: true, message: "Posts retrieved successfully", posts })

    } catch (err) {
        console.error("❌ Error retrieving posts:", err)
        return res.status(500).send({ success: false, message: "Error retrieving posts", error: err.message })
    }
}

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id).populate("author", "username").populate("category", "name")
        if (!post) {
            return res.status(404).send({ success: false, message: "Post not found" })
        }
        return res.send({ success: true, message: "Post retrieved successfully", post })

    } catch (err) {
        console.error("❌ Error retrieving post:", err)
        return res.status(500).send({ success: false, message: "Error retrieving post", error: err.message })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const { title, content, category } = req.body
        const userId = req.user.id

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).send({ success: false, message: "Post not found" })
        }
        if (post.author.toString() !== userId) {
            return res.status(403).send({ success: false, message: "You can only update your own posts" })
        }

        if (category) {
            const categoryExists = await Category.findById(category)
            if (!categoryExists) {
                return res.status(404).send({ success: false, message: "Category not found" })
            }
        }
        const updatedPost = await Post.findByIdAndUpdate(id, { title, content, category }, { new: true })
        return res.send({ success: true, message: "Post updated successfully", post: updatedPost })
    } catch (err) {
        console.error("❌ Error updating post:", err)
        return res.status(500).send({ success: false, message: "Error updating post", error: err.message })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).send({ success: false, message: "Post not found" })
        }

        if (post.author.toString() !== userId) {
            return res.status(403).send({ success: false, message: "You can only delete your own posts" })
        }

        await Post.findByIdAndDelete(id)
        return res.send({ success: true, message: "Post deleted successfully" })

    } catch (err) {
        console.error("❌ Error deleting post:", err)
        return res.status(500).send({ success: false, message: "Error deleting post", error: err.message })
    }
}
