const userModel= require('../models/user')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')
const transporter = require('../config/emailConfig')

//user registration controller
const userRegister= async(req,res)=>{
    //destructuring array from request body
    const {name, email, password, password_confirmation,tc}=req.body

    //finding whether user exists in db or not
    const user = await userModel.findOne({email:email})
    if(user){
        res.send({
            "status":"failed",
            "message":"user already exists"
        })
    }
    else{
        if(name && email && password && password_confirmation && tc){
            if(password===password_confirmation){
                try {
                    // generate the hashed password
                    const salt= await bcrypt.genSalt(10)
                    const hashedPassword= await bcrypt.hash(password,salt)
                    const newUser= new userModel({
                    name,
                    email,
                    password:hashedPassword,
                    tc  
                })
                await newUser.save()
                // generate token when user is registered
                const saved_user= await userModel.findOne({email:email})
                //generate the token now
                const token=jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'}) 
                res.send({
                    "status":"success",
                    "message":"User Registration successfull",
                    "token":token    
                }) 
                    
                } catch (error) {
                    res.send({
                        "status":"failed",
                        "message":"unable to register"
                    })
                    
                }
            }
            else{
                res.send({
                    "status":"failed",
                    "message":"password and confirm password doesnt matched"
                })
            }
        }
        else{
            res.send({
                "status":"failed",
                "message":"All fields are required"
            })  
        }
    }

}

// controller for user login

const userLogin= async(req,res)=>{
    try {
    // destructure the email and password from req body
    const {email,password}=req.body
    if(email && password){
        // find the whether user exists or not in db
        const user= await userModel.findOne({email:email})
        if(user!==null){
            //compare the user password and the password in db
            const isMatched= await bcrypt.compare(password,user.password)
            if(user.email===email && isMatched){
                //generate token if login user
                const token= jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                res.send({
                    "status":"success",
                    "message":"login successfull",
                    "token":token
                })
            }
            else{
                res.send({
                    "status":"failed",
                    "message":"User email or password is incorrect"
                })    
            }
        }
        else{
            res.send({
                "status":"failed",
                "message":"user is not registered"
            })    
        }
    }
    else{
        res.send({
            "status":"failed",
            "message":"All fields are required"
        })
    }
    } catch (error) {
        res.send({
            "status":"failed",
            "message":"unable to login"
        }) 
    }
}

// controller to change user password
const changeUserPassword=async(req,res)=>{
    const {password, password_confirmation}=req.body
    if(password && password_confirmation){
        if(password===password_confirmation){
            const salt= await bcrypt.genSalt(10)
            const newHashedPassword= await bcrypt.hash(password,salt)
            //store this newHashedPassword into db for the given user
            await userModel.findByIdAndUpdate(req.user._id,{$set:{password:newHashedPassword}})
            res.send({
                "status":"success",
                "message":"password changed successfully"
            })
        }
        else{
                res.send({
                "status":"failed",
                "message":"password and confirm password didnot matched"
            })
        }
    }else{
        res.send({
            "status":"failed",
            "message":"All fields are required"
        })
    }
}

//controller to get logged user Data
const loggedUser=(req,res)=>{
    res.send({
        "user":req.user
    })
}

//controller to send email to reset user password

const resetUserPasswordSendEmail=async(req,res)=>{
    const {email}=req.body
    if(email){
        const user= await userModel.findOne({email:email})
        if(user){
            const secret_key= user._id + process.env.JWT_SECRET_KEY
            
            //now generate token with this secret key
            const token = jwt.sign({userID:user._id},secret_key,{expiresIn:'15m'})
            
            //create link which will be send to the user email to reset password
            const link=`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
            //sending of email
            let info=await transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"SHOP-- reset password link",
                html:`<a href=${link}>CLICK HERE</a> to reset you password`
            })
            res.send({
                "status":"success",
                "message":"Please check your email, password reset link sent to your email",
                "info":info
            })
        }
        else{
            res.send({
                "status":"failed",
                "message":"user does not exist"
            })
        }
    }
    else{
        res.send({
            "status":"failed",
            "message":"All fields are required"
        })
    }
 }

 //controller to reset password after user recieve the link in the email
 
 const userResetPassword= async(req,res)=>{
    // destructure password and confirm password from request object
    const {password,password_confirmation}=req.body
    
    //destructure id and token from params
    const {id,token}=req.params

    //find the user based on the id recieved
    const user = await userModel.findById(id)

    //create new secret_key from found user id and jwt secret key
    const new_secret_key= user._id + process.env.JWT_SECRET_KEY

    try {
        //verify the recieved token and new_secret_key
        jwt.verify(token,new_secret_key)
        if(password && password_confirmation){
            if(password!==password_confirmation){
                res.send({
                    "status":"failed",
                    "message":"password and confirm password dont matched"
                })
            }
            else{
                const salt= await bcrypt.genSalt(10)
                const hashedPassword= await bcrypt.hash(password,salt)

                //save this password to the db
                await userModel.findByIdAndUpdate(user._id,{$set:{password:hashedPassword}})
                res.send({
                    "status":"success",
                    "message":"password reset successfully"
                })

            }

        }
        else{
            res.send({
                "status":"failed",
                "message":"All fields are required"
            })
        }
    } catch (error) {
        res.send({
            "status":"failed",
            "message":`something went wrong--${error}`
        })
    }

 }

module.exports= {userRegister, userLogin,changeUserPassword,loggedUser,resetUserPasswordSendEmail,userResetPassword}