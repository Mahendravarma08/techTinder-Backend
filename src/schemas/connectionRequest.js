const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },

    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type. `
        }
    }
}, { timestamps: true })

connectionRequestSchema.pre("save",function (next){
    const connectionRequest = this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot make a connection request to yourself.")
    }
    next()
})

const connectionRequest = mongoose.model("connectionRequest", connectionRequestSchema)

module.exports = connectionRequest