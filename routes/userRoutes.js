const express= require('express')
const {userRegister,userLogin,changeUserPassword, loggedUser, resetUserPasswordSendEmail, userResetPassword} = require('../controllers/userController')
const checkUserAuth=require('../middlewares/authMiddleware')
const userRouter = express.Router()

//route level middle ware to protect route
userRouter.use('/changepassword',checkUserAuth)
userRouter.use('/loggeduser',checkUserAuth)

//public routes
userRouter.post("/register",userRegister)
userRouter.post("/login",userLogin)
userRouter.post("/resetpasswordemail",resetUserPasswordSendEmail)
userRouter.post("./resetpassword/:id/:token",userResetPassword)

//private routes
userRouter.post('/changepassword',changeUserPassword)
userRouter.get('/loggeduser',loggedUser)

module.exports=userRouter