var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/users', async(request, response, next) => {

  try {
    const users = await User.find({})
    return response.json(users)
  } catch (error) {
    console.log(error)
  }

})


// used for a user page
router.get('/:id', (request, response, next) => {

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
router.post('/', async(request, response, next) => {
  const body = request.body
  const salt = 10

  //todo: validate email
  if(body.password === undefined || body.username === undefined || body.email === undefined){
    response.status(400).send({
      error:'error: Both username and password and email must be given'
    })
    return
  }

  if(body.password.length < 3 || body.username.length < 3 || body.email.length < 6){
    response.status(400).send({
      error:'error: Both username and password must be at least 3 characters long and email must be bigger than 5'
    })
    return
  }

  try {
    const passwordHash = await bcrypt.hashSync(body.password, salt)

    const newUser = new User({
      username: body.username,
      passwordHash: passwordHash,
      email: body.email,
      dateOfBirth: body.dateOfBirth,
      registerDate: new Date(),
    })

    await newUser.save()
    return response.status(200).json(newUser);

  } catch (error) {
    console.log(error)
  }

});


//used to update a user's info
router.put('/:id', (request, response, next) => {
  const user = request.body;
  return response.json(user);
});


// used to delete a user
router.delete('/:id', (request, response, next) => {
  const id = request.params.id;
  return response.json(id);
});

module.exports = router;
