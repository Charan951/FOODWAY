import jwt from "jsonwebtoken"


const genToken = async (user) => {
    try {
        // user can be a user object or just an id
        let payload;
        if (typeof user === 'object' && user._id && user.role) {
            payload = { userId: user._id, role: user.role };
        } else {
            // fallback for old usage
            payload = { userId: user };
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.log(error);
    }
}

export default genToken