import {Router} from 'express';
import {getAllPosts, getPostById, createPost, updatePost, deletePost} from './post.controller.js';
import {isAdmin, validateJwt} from '../../middlewares/validate.jwt.js';

const api = Router()

api.get('/', [validateJwt], getAllPosts)
api.get('/:id', [validateJwt, isAdmin], getPostById)
api.post('/createPost', [validateJwt, isAdmin], createPost)
api.put('/:id', [validateJwt, isAdmin], updatePost)
api.delete('/deletePost/:id', [validateJwt, isAdmin], deletePost)

export default api