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

const validateProfileUpdateFields = (req)=>{
    const allowedFields = ['firstName','lastName','age','gender','photoUrl','skills','about']
    console.log(req.body);
    
    const isEditAllowed = Object.keys(req.body).every((key)=>{
        console.log(key,"keyyyyyyyy");
        
        return allowedFields.includes(key)
    })
    console.log(isEditAllowed,"wfwfjwbjfjwb");
    

    return isEditAllowed
}

module.exports = {
    validateSignUpData,
    validateProfileUpdateFields
}