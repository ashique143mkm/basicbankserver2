//import jsonwebtoken
const jwt = require('jsonwebtoken')

//import db.js

const db = require('./db')

//data base



userDetails = {
  1000: { acno: 1000, username: 'Neer', password: 1000, balance: 5000, transaction: [] },
  1001: { acno: 1001, username: 'Laisha', password: 1001, balance: 4000, transaction: [] },
  1002: { acno: 1002, username: 'Vyom', password: 1002, balance: 6000, transaction: [] }
}

//register - 
const register = (acno, username, password) => {
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 401,
          status: false,
          message: 'User alredy exist... Please Log In'
        }
      }
      else {
        const newUser = new db.User(
          {
            acno,
            username,
            password,
            balance: 0,
            transaction: []
          })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: 'Successfully Registerd'
        }
      }
    })
}

//login

const login = (acno, pswd) => {
  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      currentUser = user.username
      currentAcno = acno

      //token generation - sign() 

      const token = jwt.sign({
        currentAcno: acno
      }, 'supersecretkey12345')

      return {
        statusCode: 200,
        status: true,
        message: 'Successfully Logged In',
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect Account Number Or Password'
      }
    }
  })

}

//deposit
const deposite = (acno, pswd, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      user.balance += amount
      user.transaction.push({
        type: 'CREDIT',
        amount
      })
      user.save()
      return {
        statusCode: 200,
        status: true,
        message: `${amt} credited new balance is ${user.balance}`
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect Passwaord or Account Number'
      }
    }
  })
}

//withdraw
const withdraw = (acno, pswd, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password: pswd,
  }).then(user => {
    if (user) {
      if (user.balance >= amt) {
        user.balance -= amount
        user.transaction.push({
          type: 'DEBIT',
          amount
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: `${amt} debited new balance is ${user.balance}`
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'Insufficient Balance'
        }
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect Password Or Account Number'
      }
    }
  })
}

//transaction history

const getTransaction = (acno) => {

  return db.User.findOne({
    acno
  }).then(user => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: 'User doesnt Exist'
      }
    }
  })
}

//deleteAcc

const deleteAcc = (acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(user){
      return {
        statusCode: 200,
        status: true,
        message: 'Account Deleted Successfully'
      }
    }
    else{
      return {
        statusCode: 401,
        status: false,
        message: 'User doesnt Exist'
      }
    }
  })
}

//export all functions

module.exports = {
  register,
  login,
  deposite,
  withdraw,
  getTransaction,
  deleteAcc
}