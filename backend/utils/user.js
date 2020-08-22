const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * Checks if a user is logged in or not
 * @param id: mongodb id of the user
 * @param user: the token the user used in the request
 * @return user object if the user is authenticated, error object otherwise
 * */
const isAuthenticated = async (token) => {
  const decodedToken = jwt.decode(token, process.env.SECRET)
  const errorObj = { error: 'token missing or invalid' }

  if (!decodedToken.id) {
    return errorObj
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return errorObj
  }

  return user
}

module.exports = {
  isAuthenticated,
}
