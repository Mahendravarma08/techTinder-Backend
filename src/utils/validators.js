const validator = require('validator')
const validateSignUpData = (req)=>{
    const {firstName, lastName, email, password} = req.body
    if(!firstName || !lastName ){
        throw new Error("Name is invalid.")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Invalid Email.")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please use a strong password.")
    }
}

module.exports = {
    validateSignUpData
}