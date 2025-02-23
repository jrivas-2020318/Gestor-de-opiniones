import {Router} from 'express';
import {getAllPosts, getPostById, createPost, updatePost, deletePost} from './post.controller.js';
import {isAdmin, validateJwt} from '../../middlewares/validate.jwt.js';
import { createPostValidator, updatePostValidator } from '../../helpers/validators.js';

const api = Router()

api.get('/', [validateJwt], getAllPosts)
api.get('/:id', [validateJwt ], getPostById)
api.post('/createPost', [validateJwt, createPostValidator], createPost)
api.put('/:id', [validateJwt, updatePostValidator], updatePost)
api.delete('/deletePost/:id', [validateJwt], deletePost)

export default api