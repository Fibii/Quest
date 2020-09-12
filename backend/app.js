require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const middleware = require('./utils/middleware')

const indexRouter = require('./controllers/index')
const usersRouter = require('./controllers/users')
const questionRouter = require('./controllers/questions')
const loginRouter = require('./controllers/login')

const app = express()
app.use(logger('dev'))
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(logger('combined', { stream: accessLogStream }))

const { DB } = process.env

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => {
    console.log('connected to db')
  })
  .catch((error) => {
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

app.use(middleware.errorLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
