const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address.')
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender data not valid.")
            }
        }
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: "This is default about the user.!"
    },
    skills: {
        type: [String],
    }
}, { timestamps: true })

// Validate password here.
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
    const hashedPassword = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashedPassword)
    return isPasswordValid
}

// Set the JWT token here.
userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, "Mahi",{expiresIn:'6s'})
    return token
}

const User = mongoose.model("User", userSchema)

module.exports = User