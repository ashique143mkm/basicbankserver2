//server - mongo db integration

//1.import mongoose

const mongoose = require('mongoose')

//2.state connection string via mongoose

mongoose.connect('mongodb://localhost:27017/bankServer',{
    useNewUrlParser:true
})

//3. define bank db model

const User = mongoose.model('User',{
    acno:Number,
    username: String,
    password: String,
    balance: Number,
    transaction: []
})

//4.Export model/collection

module.exports={
    User
}