/**
 * returns the number of likes if likes array is not empty, zero otherwise
 * @param likeable, an object that has likes array
 * @return number
 * */
export const getLikes = (likeable) => {
  if (likeable && likeable.likes && likeable.likes.length > 0) {
    return likeable.likes.map(like => like.value)
      .reduce((a, b) => a + b)
  }
  return 0
}
