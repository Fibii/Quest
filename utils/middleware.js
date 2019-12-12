/**
 * helper function that returns jwt from a request
 */
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    next()
  } else {
    request.tokenField = null
    next()
  }
}

module.exports = {
  tokenExtractor
}