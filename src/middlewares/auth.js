const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies
        console.log(cookies, "cookies")
        const { token } = cookies
        if(!token){
            throw new Error("Token is not valid.")
        }
        const decodedData = await jwt.verify(token, "Mahi")
        console.log(decodedData, "decodedData")

        const { _id } = decodedData

        if (_id) {
            const user = await User.find({ _id })
            if (!user) {
                throw new Error("User not found..!")
            }
            req.user = user
            next()

        }
    }
    catch (err) {
        res.status(400).send("Error:"+ err.message)
    }

}

module.exports = {
    userAuth
}