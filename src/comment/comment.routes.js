import { Router } from "express"
import { createComment, getCommentsByPost, updateComment, deleteComment, getAllComments } from "../comment/comment.controller.js"
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js"
import { createCommentValidator, updateCommentValidator } from "../../helpers/validators.js"

const api = Router()

api.post("/createComment", [validateJwt, createCommentValidator], createComment)
api.get("/getall", [validateJwt], getAllComments) 
api.get("/:postId", [validateJwt, ], getCommentsByPost)  
api.put("/:id", [validateJwt, updateCommentValidator, isAdmin], updateComment)
api.delete("/deleteComment/:id", [validateJwt, isAdmin], deleteComment)

export default api
