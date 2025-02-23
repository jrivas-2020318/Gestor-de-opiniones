import Post from "../post/post.model.js"
import Category from "../category/category.model.js"
import Comment from "../comment/comment.model.js"

export const createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body
        const author = req.user.id 
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
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit

        const posts = await Post.find()
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'comments',
                match: { isActive: true }, 
                populate: {
                    path: 'author',
                    select: 'name -_id'
                }
            })
        const totalPosts = await Post.countDocuments()

        return res.send({
            success: true,
            message: "Posts retrieved successfully",
            posts,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalPosts / limit),
            pageSize: parseInt(limit)
        });

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
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send({ success: false, message: "Post not found" });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).send({ success: false, message: "You can only delete your own posts" });
        }

        // Aquí se maneja la desactivación del post y sus comentarios en vez de borrarlos físicamente
        // Actualiza el estado del post a 'false'
        await Post.findByIdAndUpdate(id, { isActive: false }); // Asume que tienes un campo 'isActive' en el esquema de Post
        
        // Actualiza el estado de todos los comentarios asociados a este post también a 'false'
        await Comment.updateMany({ post: id }, { isActive: false }); // Asume que tienes un campo 'isActive' en el esquema de Comment

        return res.send({ success: true, message: "Post and all associated comments set to inactive successfully" });

    } catch (err) {
        console.error("❌ Error deleting post:", err);
        return res.status(500).send({
            success: false,
            message: "Error deleting post",
            error: err.message
        });
    }
};
