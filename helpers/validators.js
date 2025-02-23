import { body } from "express-validator";
import { validateErrors } from "./validate.error.js"

export const loginValidator = [
    body('username','Username cannot be empty').optional().toLowerCase(),
    body('password', 'Password cannont be empty').notEmpty().isStrongPassword()
   .withMessage("The password must be strong").isLength({min: 8}),
   body('email', 'Email cannont be empty').optional().toLowerCase(),
    validateErrors
]

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('lastname', 'Lastname cannot be empty').notEmpty(),
    body('username', 'Username cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty').notEmpty().isEmail(),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword()
    .withMessage("The password must be strong").isLength({min: 8}),
    
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    validateErrors
]

export const updateUserValidator = [
    body('name', 'Name cannot be empty').optional(),
    body('lastname', 'Lastname cannot be empty').optional(),
    body('username', 'Username cannot be empty').optional(),
    body('email', 'Email cannot be empty').optional().isEmail(),
    body('phone', 'Phone cannot be empty').optional().isMobilePhone(),
    validateErrors
]

export const createCategoryValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('description', 'Description cannot be empty').notEmpty(),
    validateErrors
]

export const updateCategoryValidator = [
    body('name', 'Name cannot be empty').optional(),
    body('description', 'Description cannot be empty').optional(),
    validateErrors
]

export const createPostValidator = [
    body('title', 'Title cannot be empty').notEmpty(),
    body('content', 'Content cannot be empty').notEmpty(),
    body('category', 'Category cannot be empty').notEmpty(),
    validateErrors
]

export const updatePostValidator = [
    body('title', 'Title cannot be empty').optional(),
    body('content', 'Content cannot be empty').optional(),
    body('category', 'Category cannot be empty').optional(),
    validateErrors
]

export const createCommentValidator = [
    body('content', 'Content cannot be empty').notEmpty(),
    body('post', 'Post cannot be empty').notEmpty(),
    validateErrors
]

export const updateCommentValidator = [
    body('content', 'Content cannot be empty').optional(),
    validateErrors
]   




