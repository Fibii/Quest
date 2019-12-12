const User = require('../models/user')
const Question = require('../models/question')

const initialUsers = [
  {
    username: 'johnny1023',
    email: 'john@doe.com',
    password: 'johnnyBoy123',
    dateOfBirth: '1994-12-12'
  },
  
  {
    username: 'karen_',
    email: 'kkkk@doe.com',
    password: 'ayylmao123',
    dateOfBirth: '1998-01-23'
  }
]

const initialQuestion = [
  {
    title: 'is this a valid proof?',
    content: 'prove that for all x < x^3 => x^2 < x^4\nmy solution is: (x < x^3 ) * x QED',
    tags: ['proof', 'analysis']
  },
  {
    title: 'How to un-commit last un-pushed git commit without losing the changes',
    content: ' there a way to revert a commit so that my local copy keeps the changes made in that commit, but they become non-committed changes in my working copy?',
    tags: ['git']
  },
]

const getInitialUsers = () => initialUsers

const getUsersInDb = async () => {
  try {
    const users = await User.find({}) 
    return users.map(user => user.toJSON())
  } catch (error) {
    console.log(error)
  }
}

const getInitialQuestions = () => initialQuestion

const getQuestionsInDb = async () => {
  try {
    const questions = await Question.find({})
    return questions.map(question => question.toJSON())
  } catch (error) {
    console.log(error)
  }
}

module.exports = { 
  getInitialUsers,
  getUsersInDb,
  getQuestionsInDb,
  getInitialQuestions
}