const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * Checks if a user is logged in or not
 *
 * If userId is undefined, that's because it's not needed to
 * authenticate the user, like if the user is posting a new question
 *
 * If a user is updating/deleting a User object, then userId must be defined to make sure
 * that the token provided in the request belongs to the user with userId
 *
 * @param userId: mongodb id of the user
 * @param token: the token the user used in the request
 * @return user object if the user is authenticated, error object otherwise
 * */
const isAuthenticated = async (token, userId) => {
  const decodedToken = jwt.decode(token, process.env.SECRET)
  const errorObj = { error: 'token missing or invalid' }

  if (!decodedToken.id) {
    return errorObj
  }

  if (userId && (!decodedToken.id || decodedToken.id !== userId)) {
    return errorObj
  }

  const id = userId || decodedToken.id
  const user = await User.findById(id)

  if (!user) {
    return errorObj
  }

  return user
}

module.exports = {
  isAuthenticated,
}
