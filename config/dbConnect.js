const mongoose= require('mongoose')

// function to connect the database

const connectDb=async(DATABASE_URL)=>{
    try {
        const DB_OPTIONS={
            dbName:"shop"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log("connected successfully......")

    } catch (error) {
        console.log(error)
        
    }
}

module.exports=connectDb;