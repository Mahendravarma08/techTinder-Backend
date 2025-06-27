const express = require('express')

const app = express()

app.use("/home",(req,res)=>{
    res.send("I am returning...")
})

app.listen(8989,()=>{
    console.log("Server is listening on the port..")
})