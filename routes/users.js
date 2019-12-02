var express = require('express');
var router = express.Router();


// used for a user page
router.get('/user/:id', (request, response, next) => {

  const id = request.params.id;

  const basicUser = {
    id,
    fullname: 'john doe',
    username: 'john',
    password: 'john',
    dateOfBirth: new Date('1/1/2017'),
    email: 'john@doe.com',
    location: 'anything',
    registerDate: new Date('1/1/2017'),
    lastSignedInDate: new Date()
  };

  return response.json(basicUser);

});

// used add a new user info
router.post('/user', (request, response, next) => {
  const user = request.body;
  return response.json(user);
});


//used to update a user's info
router.put('/user/:id', (request, response, next) => {
  const user = request.body;
  return response.json(user);
});


// used to delete a user
router.delete('/user/:id', (request, response, next) => {
  const id = request.params.id;
  return response.json(id);
});

module.exports = router;
