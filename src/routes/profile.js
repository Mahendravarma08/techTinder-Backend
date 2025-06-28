const express = require('express')
const profileRoute = express.Router()
const { userAuth } = require('../middlewares/auth')
const { validateProfileUpdateFields } = require('../utils/validators')
profileRoute.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})


profileRoute.get("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileUpdateFields(req)){
           throw new Error("Cannot update mandatory fields.")
        }
        else{
            const loggedInUser = req.user
            
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})


module.exports = profileRoute