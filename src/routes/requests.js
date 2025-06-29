const express = require('express')
const requestRoute = express.Router()
const connectionRequest = require('../schemas/connectionRequest')
const User = require('../schemas/user')

const { userAuth } = require('../middlewares/auth')

requestRoute.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status
        const allowedStatus = ['interested', 'ignored']
        // check if status is allowed or not.
        const allowInsert = allowedStatus.includes(status)
        // check if already a connection request exists.
        const checkExistance = await connectionRequest.find({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        const isValidUser = await User.findById(toUserId)
        if (!isValidUser)
            return res.status(404).json({ message: "User not found." })

        if (checkExistance) {
            return res.status(400).json({ message: "Connection request already exists." })
        }


        if (allowInsert) {
            const newConnectionReqeust = new connectionRequest({
                fromUserId,
                toUserId,
                status
            })

            const data = await newConnectionReqeust.save()
            return res.json({ message: "Connection reqeust sent successfully.", data })
        }
        else {
            return res.status(404).json({ message: "Invalid status sent:" + status })
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).send("Error: " + err.message)
    }


    res.send(user.firstName + "sent the connection request.")
})

requestRoute.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        console.log("logged in user:", req.user);
        const loggedInUser = req.user
        const { status, requestId } = req.params
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed." })
        }
        const connectionRequestDetails = await connectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if (!connectionRequestDetails) {
            return res.status(404).json({ message: "Connection request not found." })
        }

        connectionRequestDetails.status = status
        connectionRequestDetails.save()
        return res.json({ message: "Connection request " + status, data :connectionRequestDetails })
    }
    catch (err) {
        console.log("error: ", err)
        res.status(400).send("Error occured: " + err.message)
    }
})

module.exports = requestRoute