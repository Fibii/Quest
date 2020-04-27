const Joi = require('@hapi/joi')

const signupFromSchema = Joi.object({
  fullname: Joi.string()
    .pattern(new RegExp('^[a-zA-Z ]*$'))
    .min(3)
    .max(32),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(32),
  email: Joi.string()
    .email({ tlds: false }),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{8,32}$')),
  dateOfBirth: Joi.date()
    .less('2018-1-1')
    .greater('1900-1-1'),
})
  .or('fullname', 'username', 'password', 'email', 'dateOfBirth')

const questionFormSchema = Joi.object({
  title: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_." "-]*'))
    .min(6)
    .max(64),
  content: Joi.string()
    .min(8),
  tags: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9 ]*$')),
})
  .or('title', 'content', 'tags')


/**
 * Checks whether user.id and deletable.postedBy.id are defined, and compares the ids
 * of user and the author of deletable
 * returns true if the delete button should be shown, false otherwise
 *
 * @param deletable: an object that can be deleted, which is on of: question, comment
 * @param user: the current logged in user object
 * @return boolean
 */
const isAuthor = (user, deletable) => {
  if (!user || !user.id || !deletable || !deletable.postedBy || !deletable.postedBy.id) {
    return false
  }

  if (user.id !== deletable.postedBy.id) {
    return false
  }

  return true
}

/**
 * Validates value based on signupFromSchema
 * returns false if there's a validation error, true otherwise
 * @param value: the object to be validated
 * @return boolean
 * */
const signupFormValidator = (value) => {
  const { error } = signupFromSchema.validate(value)
  return !error
}

/**
 * Validates value based on questionFormSchema
 * returns false if there's a validation error, true otherwise
 * @param value: the object to be validated
 * @return boolean
 * */
const questionFormValidator = (value) => {
  const { error } = questionFormSchema.validate(value)
  return !error
}

export default {
  isAuthor,
  signupFormValidator,
  questionFormValidator,
}
