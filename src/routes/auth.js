const express = require('express')
const authRoute = express.Router()
const { validateSignUpData } = require('../utils/validators')
const User = require('../schemas/user')
const bcrypt = require('bcrypt')

authRoute.post('/signUp', async (req, res) => {
    console.log(req.body)
    try {
        validateSignUpData(req)
        const { firstName, lastName, email, password } = req.body
        // const password = req.body.password
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash)
        const user = new User({ firstName, lastName, email, password: passwordHash })
        await user.save()
        res.send("User created successfully")
    }
    catch (err) {
        console.log("Error: ", err.message)
        res.status(400).send("Error: " + err.message)
    }
})

authRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const userDetails = await User.findOne({ email })
        if (!userDetails) {
            throw new Error("No such Email ID found.")
        }
        const isPasswordValid = await userDetails.validatePassword(password)
        if (isPasswordValid) {
            const token = await userDetails.getJWT()
            res.cookie("token", token)
            res.send("Login Successful.")
        }
        else {
            res.send("Invalid Password")
        }
    }
    catch (err) {
        res.status(404).send("Error: " + err.message)
    }

})

authRoute.get('/getUser', async (req, res) => {
    try {
        const emailId = req.body.emailId
        const response = await User.find({ email: emailId })
        if (response.length == 0) {
            res.status(404).send("User not found");
        }
        else {
            res.send(response)
        }
    }
    catch (err) {
        console.log(err);

        res.status(400).send("Error while fetching data.")
    }
})

authRoute.delete('/deleteUser', async (req, res) => {
    try {
        await User.findOneAndDelete(req.body.id)
        res.send("User deleted succesfully.")
    }
    catch (err) {
        res.status(400).send("Deletion Failed.")
    }
})

authRoute.post('/logout', (req, res) => {
    try {
        res.cookie("token",null,{expires: new Date(Date.now())})
        res.send("User logged out.")
    }
    catch (err) {
        console.log("Error: " + err)
    }
})



module.exports = authRoute