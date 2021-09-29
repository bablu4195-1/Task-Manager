const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')



const userOneID = new mongoose.Types.ObjectId()
const userOne = {
    _id:userOneID,
    name:'Venkata Sai Teja Mukkapati',
    email:'bablu@intel.com',
    password:'amIinIntel@25',
    tokens:[{
        token:jwt.sign({_id:userOneID}, process.env.JWT)
    }]
}

const userTwoID = new mongoose.Types.ObjectId()
const userTwo = {
    _id:userTwoID,
    name:'Venkata Sai Teja',
    email:'bablu@postman.com',
    password:'amIinPostman@25',
    tokens:[{
        token:jwt.sign({_id:userTwoID}, process.env.JWT)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description:'First testing task',
    completed: false,
    owner: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description:'Second testing task',
    completed: true,
    owner: userOne._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description:'Third testing task',
    completed: true,
    owner: userTwo._id
}

const setupDataBase = async ()=>{
    await User.deleteMany()
    await Task.deleteMany() 
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()     
}

module.exports = {
    userOneID,
    userOne,
    userTwoID,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDataBase,
}