const jwt = require('jsonwebtoken')
const express = require('express')
require('./db/mongoose')
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")
const auth = require('../src/middleware/auth')

const app = express();
app.use(express.json());
const port = process.env.PORT
const multer = require('multer')

app.use(userRouter)
app.use(taskRouter)



app.listen(port,()=>{
    console.log('server is running port ' + port)
})
