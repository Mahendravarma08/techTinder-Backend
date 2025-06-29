const express = require('express')
const userRoute = express.Router()
const { userAuth } = require('../middlewares/auth')
const connectionRequest = require('../schemas/connectionRequest')
const userSafeData = "firstName lastName photoUrl age gender about skills"

userRoute.get('/user/requests', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "pending"
        }).populate('fromUserId', userSafeData)
        return res.json({ message: "Data fetched", data: connectionRequests })
    }
    catch (err) {
        res.statusCode(400).send("Error: " + err.message)
    }
})

userRoute.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate('fromUserId', userSafeData).populate('toUserId', userSafeData)

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({ data })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = userRoute