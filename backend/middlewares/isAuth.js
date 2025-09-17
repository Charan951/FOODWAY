import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        
        if (!token) {
            return res.status(400).json({ message: "Token not found" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Get user data including role
        const user = await User.findById(decoded.userId).select('-password')
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        
        req.userId = decoded.userId
        req.user = user
        next()
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" })
    }
}

export default isAuth