
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

export default {
  isAuthor
}
