const jwt = require("jsonwebtoken")
const userModel=require('../models/user')

const checkUserAuth=async(req,res,next)=>{
    let token
    const {authorization}=req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {
            token=authorization.split(" ")[1]


            //verify the token recieved from the user
            const {userID}= jwt.verify(token,process.env.JWT_SECRET_KEY)
            
            //find user from db that matched the userID and set the user property in req object with found user object
            req.user= await userModel.findById(userID).select('-password')
            next()
        } catch (error) {
            res.send({
                "status":"failed",
                "message":"unauthorized user"
            })
        }
    }
    else{
        res.send({
            "status":"failed",
            "message":"unauthorized user, no token"
        })    
    }
}

module.exports=checkUserAuth