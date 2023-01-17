require('dotenv').config()
const nodemailer=require('nodemailer')

let transporter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    post:process.env.EMAIL_PORT,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

module.exports=transporter