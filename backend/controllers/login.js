const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const userService = require('../utils/user')

router.get('/isValidToken', async (request, response, next) => {
  try {
    const user = await userService.isAuthenticated(request.cookies.token)
    if (user.id) {
      return response.status(200).end()
    }
    return response.status(403).end()
  } catch (error) {
    return next(error)
  }
})

router.post('/', async (request, response, next) => {
  try {
    const { username } = request.body
    const { password } = request.body
    const user = await User.findOne({ username })

    if (!user || !password) {
      return response.status(404).json({
        error: "user doesn't exist",
      })
    }
    const isPasswordCorrect = user === null
      ? false : await bcrypt.compare(password, user.passwordHash)

    if (isPasswordCorrect) {
      // update lastSignedInDate
      const updatedUser = {
        ...user._doc,
        lastSignedInDate: new Date(),
      }
      await User.findByIdAndUpdate(user.id, updatedUser)

      const userTokenObj = {
        username,
        id: user.id,
      }

      const token = jwt.sign(userTokenObj, process.env.SECRET)
      response.cookie('token', token, { httpOnly: true, secure: false })
      return response.status(200)
        .json({
          username,
          id: user._id,
        })
    }
    return response.status(401)
      .json({
        error: 'invalid password',
      })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
