require('dotenv').config()
var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var questionRouter = require('./routes/question');
const mongoose = require('mongoose')
var app = express();

const DB = process.env.DB
console.log(DB)
mongoose.connect(DB, { useNewUrlParser: true })
    .then(() => {
      console.log("connected to db")
    })
    .catch(error => {
      console.log(error)
    })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use('/api', questionRouter);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
module.exports = app;
