const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true
    }
})


//static signup method
userSchema.statics.signup = async function(email, password) {

    //validation
    if(!email || !password){
        throw Error("Fill all the fields")
    }

    if(!validator.isEmail(email)){
        throw Error('Invalid email')
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password too weak')
    }

    const exists = await this.findOne({email})

    if (exists) {
        throw Error('Email already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email,password: hash })

    return user
}


//static login method
userSchema.statics.login = async function(email, password) {

    //validation
    if(!email || !password){
        throw Error("Fill all the fields")
    }


    const user = await this.findOne({ email })

    if(!user){
        throw Error('User doesnt exists')
    }

    const match = await bcrypt.compare(passowrd, user.password)

    if (!match){
        throw Error('Incorrect password')
    }

    return user
}


module.exports = mongoose.model('User', userSchema)