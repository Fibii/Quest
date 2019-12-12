require('dotenv').config()
const express = require('express')
const path = require('path')
const logger = require('morgan')
const middleware = require('./utils/middleware')

const indexRouter = require('./controllers/index')
const usersRouter = require('./controllers/users')
const questionRouter = require('./controllers/question')
const loginRouter = require('./controllers/login')

const mongoose = require('mongoose')
const cors = require('cors')

const app = express();
app.use(logger('dev'))

const DB = process.env.DB
console.log(DB)

mongoose.connect('mongodb://127.0.0.1:27017/qaTEST', { useNewUrlParser: true })
    .then(() => {
      console.log("connected to db")
    })
    .catch(error => {
      console.log(error)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/questions', questionRouter)
app.use('/api/login', loginRouter)

module.exports = app
