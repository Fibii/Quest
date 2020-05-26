/**
 * returns the number of likes if likes array is not empty, zero otherwise
 * @param likeable, an object that has likes array
 * @return number
 * */
const getLikes = (likeable) => {
  if (likeable && likeable.likes && likeable.likes.length > 0) {
    return likeable.likes.map((like) => like.value)
      .reduce((a, b) => a + b)
  }
  return 0
}

/**
 * A Wrapper for ternary operator
 * wraps:  condition ? then : otherwise
 * @return then if condition, else returns otherwise
 * */
const iff = (condition, then, otherwise) => (condition ? then : otherwise)

/**
 * Formats javascript date to day/month/year and fixes month number
 * (js months start from 0)
 *
 * @return string date as DD/MM/YYYY
 * */
const formatDate = (date) => {
  const dateObj = new Date(date)
  return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`
}

export default {
  getLikes,
  iff,
  formatDate,
}
