import Comment from "../comment/comment.model.js"
import Post from "../post/post.model.js"

export const createComment = async (req, res) => {
    const data = req.body
    const author = req.user.id

    // Verificar que el post exista en la base de datos
    const postExists = await Post.findById(data.post)
    if (!postExists) return res.status(404).send({ success: false, message: "Post not found" })

    const newComment = new Comment({ author, ...data })
    await newComment.save()

    postExists.comments.push(newComment._id) 
    await postExists.save()  
    res.status(201).send({ success: true, message: "Comment created", comment: newComment })
}

export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params
        const comments = await Comment.find({ post: postId })
        .populate("post", "title -_id")

        return res.send({ success: true, message: "Comments retrieved successfully", comments })

    } catch (err) {
        console.error("❌ Error retrieving comments:", err)
        return res.status(500).send({ success: false, message: "Error retrieving comments", error: err.message })
    }
}

export const getAllComments = async (req, res) => {
    try {
        const { page = 1, limit = 15 } = req.query
        const skip = (page - 1) * limit

        const userId = req.user.id
        const comments = await Comment.find({ author: userId, isActive: true }) 
            .skip(skip) 
            .limit(limit) 
            .populate('post', 'title description') 
            .populate('author', 'name email')

        const totalComments = await Comment.countDocuments({ author: userId, isActive: true }); 
        if (comments.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No active comments found."
            })
        }
        return res.send({
            success: true,
            message: "Comments retrieved successfully",
            comments,
            totalComments,
            totalPages: Math.ceil(totalComments / limit),
            currentPage: parseInt(page),
            pageSize: parseInt(limit)
        })
        
    } catch (err) {
        console.error("❌ Error retrieving comments:", err);
        return res.status(500).send({
            success: false,
            message: "Error retrieving comments",
            error: err.message
        });
    }
}


export const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const { content } = req.body
        const userId = req.user.id

        const comment = await Comment.findById(id)
        if (!comment) {
            return res.status(404).send({ success: false, message: "Comment not found" })
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).send({ success: false, message: "You can only update your own comments" })
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, { content }, { new: true })
        return res.send({ success: true, message: "Comment updated successfully", comment: updatedComment })

    } catch (err) {
        console.error("❌ Error updating comment:", err)
        return res.status(500).send({ success: false, message: "Error updating comment", error: err.message })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const comment = await Comment.findById(id)
        if (!comment) {
            return res.status(404).send({ success: false, message: "Comment not found" })
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).send({ success: false, message: "You can only delete your own comments" })
        }

        await Comment.findByIdAndDelete(id)
        return res.send({ success: true, message: "Comment deleted successfully" })

    } catch (err) {
        console.error("❌ Error deleting comment:", err)
        return res.status(500).send({ success: false, message: "Error deleting comment", error: err.message })
    }
}
