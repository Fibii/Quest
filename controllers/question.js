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
router.get('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const question = await Question.findById(id)
    if (question) {
      return response.json(question)
    } else {
      return response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
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
