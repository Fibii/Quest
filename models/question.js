const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const questionSchema = mongoose.Schema({
  userId: 1,
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 8,
  },
  postedDate: Date,
  solved: Boolean,
  tags: [],
  comments: [{
    body: 'String',
    by: mongoose.Schema.Types.ObjectId
  }],
  likes: Number,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

userSchema.plugin(uniqueValidator)

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question