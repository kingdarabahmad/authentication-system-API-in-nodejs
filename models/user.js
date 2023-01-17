const mongoose= require('mongoose')

// defining user Schema
const userSchema= new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    tc:{type:Boolean, required:true},

})

// creating model of user abd export the model

module.exports= mongoose.model('users',userSchema)
