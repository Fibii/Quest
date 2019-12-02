const express = require('express');
const router = express.Router();

// used to show a question in frontend
router.get('/question/:id', (request, response, next) => {

  const id = request.params.id;

  const basicQuestion = {
    userId: 1,
    title: 'first question',
    content: 'how to use this?',
    postedDate: new Date(),
    solved: false,
    tags: ['anything', 'new_question'],
    comments: ['duplicated question..'],
    likes:1
  };

  return response.json(basicQuestion);

});

// create a new question
router.post('/question', (request, response, next) => {
  const user = request.body;
  return response.json(user);
});


// update a question
router.put('/question/:id', (request, response, next) => {
  const user = request.body;
  return response.json(user);
});


// delete a question
router.delete('/question/:id', (request, response, next) => {
  const id = request.params.id;
  return response.json(id);
});

module.exports = router;
