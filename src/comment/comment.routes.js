import { Router } from "express"
import { createComment, getCommentsByPost, updateComment,deleteComment} from "../comment/comment.controller.js"
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post("/createComment", [validateJwt, isAdmin], createComment)
api.get("/:postId",[validateJwt], getCommentsByPost)
api.put("/:id", [validateJwt], updateComment)
api.delete("/:id", [validateJwt], deleteComment)

export default api
