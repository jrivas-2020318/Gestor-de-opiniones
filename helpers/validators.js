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

export const updateUservalidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('lastname', 'Lastname cannot be empty').notEmpty(),
    body('username', 'Username cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty').notEmpty().isEmail(),
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    validateErrors
]