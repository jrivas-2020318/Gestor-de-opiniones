import User from "./user.model.js"
import argon2 from "argon2"

export const getAll = async (req, res) => {
    try {
        
        const users = await User.find()
        if (users.length === 0) {
            return res.status(404).send({ success: false, message: "No users found." })
        }
        return res.send({ success: true, message: "Users found.", total: users.length, users })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error retrieving users.", err })
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
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).send({ success: false, message: "Unauthorized: Token required" });
        }
        if (req.user.id !== id) {
            return res.status(403).send({ success: false, message: "You can only change your own password" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        if (!currentPassword) {
            return res.status(400).send({ success: false, message: "Current password is required" });
        }
        const isPasswordCorrect = await argon2.verify(user.password, currentPassword);
        if (!isPasswordCorrect) {
            return res.status(400).send({ success: false, message: "Incorrect current password" });
        }
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).send({ success: false, message: "New password must be at least 8 characters long" });
        }
        const hashedPassword = await argon2.hash(newPassword);
        user.password = hashedPassword;
        await user.save();
        return res.send({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error("❌ Error changing password:", err);
        return res.status(500).send({ success: false, message: "Error changing password", err });
    }
};



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
