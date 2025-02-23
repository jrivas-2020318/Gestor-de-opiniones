import User from "./user.model.js"
import { checkPassword, encrypt } from "../../utils/encrypt.js"

export const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit
        const users = await User.find()
            .skip(skip)
            .limit(limit);
        const totalUsers = await User.countDocuments()

        if (users.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No users found."
            })
        }
        return res.send({
            success: true,
            message: "Users found.",
            total: totalUsers, 
            totalPages: Math.ceil(totalUsers / limit), 
            currentPage: parseInt(page), 
            pageSize: parseInt(limit), 
            users
        })
    } catch (err) {
        console.error("❌ Error retrieving users:", err);
        return res.status(500).send({
            success: false,
            message: "Error retrieving users",
            error: err.message
        })
    }
}

export const get = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send({ success: false, message: "Unauthorized: Token required" });
        }
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found." });
        }
        return res.send({ success: true, message: "User profile retrieved successfully", user });
    } catch (err) {
        console.error("❌ Error retrieving user profile:", err);
        return res.status(500).send({ success: false, message: "Error retrieving user profile.", err });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params; 
        const { username, email, name } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).send({ success: false, message: "Unauthorized: Token required" });
        }
        if (req.user.id !== id) {
            return res.status(403).send({ success: false, message: "You can only update your own profile" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (name) user.name = name;
        await user.save();
        return res.send({ success: true, message: "User updated successfully", user });
    } catch (err) {
        console.error("❌ Error updating user:", err);
        return res.status(500).send({ success: false, message: "Error updating user", err });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id
        const { oldPassword, newPassword } = req.body
        const user = await User.findById(userId)
        if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User not found"
                }
            )
        }
        const isPasswordCorrect = await checkPassword(user.password, oldPassword)
        if (!isPasswordCorrect) {
            return res.status(400).send(
                { 
                    message: 'Wrong old password' 
                }
            )
        }
        user.password = await encrypt(newPassword)
        await user.save()
        return res.send(
            {
                success: true,
                message: "Password updated successfully"
            }
        )
    } catch (err) {
            return res.status(500).send(
            {
                success: false,
                message: "General error",
                error: err.message || err
            }
        )
    }
}
export const deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id)
        if (!userToDelete) {
            return res.status(404).send({ success: false, message: "User not found" })
        }

        userToDelete.status = false
        await userToDelete.save()
        return res.send({ success: true, message: "User deactivated successfully" })
    } catch (error) {
        console.error("Error deactivating user:", error)
        return res.status(500).send({ success: false, message: "General Error" })
    }
}
