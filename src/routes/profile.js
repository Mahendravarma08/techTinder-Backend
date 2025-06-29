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


profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileUpdateFields(req)){
           throw new Error("Cannot update mandatory fields.")
        }
        else{
            const loggedInUser = req.user
            console.log(loggedInUser,">sfsbfkbshbhb");
            
            Object.keys(req.body).forEach(key => {
                loggedInUser[key] = req.body[key]
            });

            console.log(loggedInUser,"loggedInUser")
            await loggedInUser.save()

            res.json({message:"updation successful",data:loggedInUser})
        }
    }
    catch (err) {
        console.log(err,"errrrrrrrr")
        res.status(400).send("Error: " + err.message)
    }
})


module.exports = profileRoute