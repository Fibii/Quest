var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/', async(request, response, next) => {

  try {
    const users = await User.find({})
    return response.json(users)
  } catch (error) {
    console.log(error)
  }

})


// used for a user page
router.get('/:id', async (request, response, next) => {

  try {
    const id = request.params.id;
    const user = await User.findById(id)
    return response.json(user)
  } catch (error) {
    next(error)
  }

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
router.put('/:id', async (request, response, next) => {
  try {
    const user = request.body
    const id = request.params.id

    const updatedUser = await User.findByIdAndUpdate(id, user)
    response.json(updatedUser)
  } catch (error) {
    next(error)
  }
});


// used to delete a user
router.delete('/:id',  async (request, response, next) => {
  const id = request.params.id;
  try {
    await User.findByIdAndRemove(id)
    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router;
