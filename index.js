require('dotenv').config()
const express= require('express')
const cors= require('cors')
const connectDb= require('./config/dbConnect')
const userRoutes = require('./routes/userRoutes')
const app= express()

const PORT= process.env.PORT
const DATABASE_URL= process.env.DATABASE_URL

// CORS policy
app.use(cors())

//JSON
app.use(express.json())

//call to connect database
connectDb(DATABASE_URL)

//load user Route
app.use("/api/user",userRoutes)

app.listen(PORT,()=>{
    console.log(`app listening on port ${PORT}`)
})