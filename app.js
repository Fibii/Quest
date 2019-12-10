require('dotenv').config()
var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./controllers/index');
var usersRouter = require('./controllers/users');
var questionRouter = require('./controllers/question');
const mongoose = require('mongoose')
const cors = require('cors')

var app = express();
app.use(logger('dev'));

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/questions', questionRouter);


module.exports = app;
