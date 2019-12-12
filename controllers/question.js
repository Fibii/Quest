const express = require('express')
const router = express.Router()
const Question = require('../models/question')


router.get('/', async (request, response, next) => {
  try {
    const questions = await Question.find({})
    return response.json(questions)
  } catch (error) {
    next(error)
  }
})

// used to show a question in frontend
router.get('/:id', (request, response, next) => {

  const id = request.params.id

  const basicQuestion = {
    userId: 1,
    title: 'first question',
    content: 'how to use this?',
    postedDate: new Date(),
    solved: false,
    tags: ['anything', 'new_question'],
    comments: ['duplicated question..'],
    likes:1
  }

  return response.json(basicQuestion)

})

// create a new question
router.post('/', async (request, response, next) => {

})


// update a question
// only update likes, solved by the posted user, or comments
router.put('/:id', async (request, response, next) => {

})


// delete a question
router.delete('/:id', (request, response, next) => {
  const id = request.params.id
  return response.json(id)
})

module.exports = router
