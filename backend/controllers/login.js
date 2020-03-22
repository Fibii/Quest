const router = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


router.post('/', async (request, response, next) => {
  try {
    const username = request.body.username
    const password = request.body.password

    const user = await User.findOne({username})

    if (!user || !password) {
      return response.json({
        error: "user doesn't exist"
      })
    }
    const isPasswordCorrect = user === null ?
        false : await bcrypt.compare(password, user.passwordHash)

    if (isPasswordCorrect) {

      // update lastSignedInDate
      const updatedUser = {
        ...user._doc,
        lastSignedInDate: new Date()
      }
      await User.findByIdAndUpdate(user.id, updatedUser)

      const userTokenObj = {
        username: username,
        id: user.id
      }

      const token = jwt.sign(userTokenObj, process.env.SECRET)

      return response.status(200)
        .json({
          username,
          token,
          id: user._id
        })

    } else {
      return response.status(401)
          .json({
        error: "invalid password"
      })
    }
  } catch(error) {
    next(error)
  }
})


module.exports = router
