//server creation 

//1.import express

const express = require('express')

//import jsonwebtoken
const jwt = require('jsonwebtoken')


const dataService = require('./service/data.service')

//import cors
const cors = require('cors')

//2.create an app using express

const app  = express()

//give command to share data via cors

app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse JSON from request body

app.use(express.json())

//4.Resolving HTTH request

//GET Request - Read data
app.get('/',(req,res)=>{
    res.send('GET Method')
})

//POST Request - Create data
app.post('/',(req,res)=>{
    res.send('POST Method........')
})


//PUT Request - To compleatly modify data data
app.put('/',(req,res)=>{
    res.send('PUT Method......')
})

//PATCH Request - To partialy modify data data
app.patch('/',(req,res)=>{
    res.send('PATCH Method.........')
})

//DELETE Request - To Remove data
app.delete('/',(req,res)=>{
    res.send('DELETE Method.....')
})

console.log("---------------------------------------");

console.log('Bank Server');

//jwtmiddleware  - to validate token
const jwtmiddleware = (req,res,next)=>{
    try{
        console.log('Router Specific Middleware');
        const token = req.headers['x-access-token']
        //validate - verify()
        const data = jwt.verify(token,'supersecretkey12345')
        console.log(data);
        next()
    }
    catch{
        res.status(422).json({
            statusCode:422,
            status:false,
            message:'Please Login'
          })  
    }
}

//login API - post
app.post('/login',(req,res)=>{
    console.log(req.body);
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})


//register API - post

app.post('/register',(req,res)=>{
    console.log(req.body);
    dataService.register(req.body.acno,req.body.username,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//deposite API -post

app.post('/deposite',jwtmiddleware,(req,res)=>{
    console.log(req.body);
    dataService.deposite(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//withdraw API - post

app.post('/withdraw',jwtmiddleware,(req,res)=>{
    console.log(req.body);
    dataService.withdraw(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//transaction history

app.post('/transaction',jwtmiddleware,(req,res)=>{
    console.log(req.body);
    dataService.getTransaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//deleteAcc
app.delete('/deleteAcc/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

//3. create port number

app.listen(3000,()=>{
    console.log('Server started at port number 3000');
})