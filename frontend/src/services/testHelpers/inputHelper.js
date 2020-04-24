/**
 * @param input: TextField input
 * Helper function that wraps input to a target.value, used for <input> components
 * */
const parseValue = (input) => ({
  target: {
    value: input,
  },
})

/**
 * @param date: Date object
 * @return string as YYYY-MM-DD
 * */
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDay().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default {
  parseValue,
  formatDate,
}
