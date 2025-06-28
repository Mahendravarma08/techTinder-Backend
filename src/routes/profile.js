const express = require('express')
const profileRoute = express.Router()
const {userAuth} = require('../middlewares/auth')

profileRoute.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})


module.exports = profileRoute