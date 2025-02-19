import User from "./user.model.js"

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
        // Verificar si el usuario está autenticado y tiene un ID válido
        if (!req.user || !req.user.id) {
            return res.status(401).send({ success: false, message: "Unauthorized: Token required" })
        }
        const { id } = req.params
        if (req.user.id !== id) {
            return res.status(403).send({ success: false, message: "You can only view your own profile" })
        }
        const user = await User.findById(id)
        if (!user) return res.status(404).send({ success: false, message: "User not found." })

        return res.send({ success: true, message: "User not found", user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error retrieving user.", err })
    }
}

export const update = async (req, res) => {
    const { id } = req.params
    const data = req.body

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send({ success: false, message: "Unauthorized: Token required" })
        }
        if (req.user.id !== id) {
            return res.status(403).send({ success: false, message: "You can only update your own profile" })
        }
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
        if (!updatedUser) {
            return res.status(404).send({ success: false, message: "Usuario no encontrado, no actualizado" })
        }
        return res.send({ success: true, message: "Usuario actualizado correctamente", updatedUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error al actualizar usuario", err })
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
