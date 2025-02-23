import { Router } from "express"
import { createComment, getCommentsByPost, updateComment, deleteComment, getAllComments } from "../comment/comment.controller.js"
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post("/createComment", [validateJwt], createComment)
api.get("/getall", [validateJwt], getAllComments)  // Moved this line up
api.get("/:postId", [validateJwt], getCommentsByPost)  // This line now follows /getall
api.put("/:id", [validateJwt], updateComment)
api.delete("/deleteComment/:id", [validateJwt], deleteComment)

export default api
