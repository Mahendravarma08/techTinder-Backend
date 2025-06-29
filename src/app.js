const express = require('express')
const { connectDatabase } = require('./config/database')
const { loggerMiddleware } = require('./middlewares/logger-middleware')
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(loggerMiddleware)

const authRoute = require('./routes/auth')
const profileRoute = require('./routes/profile')
const requestRoute = require('./routes/requests')
const userRoute = require('./routes/user')

app.use("/",authRoute);
app.use("/",profileRoute);
app.use("/",requestRoute)
app.use("/",userRoute)

connectDatabase().then(() => {
    console.log('Database connection was successful..')
    app.listen(8989, () => {
        console.log("Server is listening on the port..")
    })
}).catch((err) => {
    console.log("Error connecting to database.")
})