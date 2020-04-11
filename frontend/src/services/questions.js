import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'
let token = null
let config = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
  config = {
    headers: { Authorization: token },
  }
}

const getAll = async () => {
  try {
    const result = await axios.get(`${baseUrl}/questions/`)
    return result.data
  } catch (error) {
    console.log(error)
  }
  return false
}

const get = async (id) => {
  try {
    const result = await axios.get(`${baseUrl}/questions/${id}`)
    return result.data
  } catch (error) {
    console.log(error)
  }
  return false
}

const addComment = async (id, comment) => {
  try {
    const response = await axios
      .post(`${baseUrl}/questions/${id}/new-comment`, comment, config)
    return response
  } catch (error) {
    console.log(error)
  }
  return false
}

const deleteComment = async (questionId, commentId) => {
  try {
    const response = await axios
      .delete(`${baseUrl}/questions/${questionId}/delete-comment/${commentId}`, config)
    return response.status === 200
  } catch (error) {
    console.log(error)
  }
  return false
}

const upvoteComment = async (questionId, commentId) => {
  try {
    const response = await axios.post(`${baseUrl}/questions/${questionId}/likes/${commentId}`, { likes: 1 }, config)
    return response.status === 200
  } catch (error) {
    console.log(error)
  }
  return false
}

const downvoteComment = async (questionId, commentId) => {
  try {
    const response = await axios.post(`${baseUrl}/questions/${questionId}/likes/${commentId}`, { likes: -1 }, config)
    return response.status === 200
  } catch (error) {
    console.log(error)
  }
  return false
}

const addQuestion = async (question) => {
  try {
    const response = await axios.post(`${baseUrl}/questions`, question, config)
    return response.data
  } catch (error) {
    console.log(error)
  }
  return false
}

/**
 * sends a delete question with the passed id
 * returns true if the question was deleted successfully, false otherwise
 * @param id: the id of a question
 * @return boolean
 * */
const deleteQuestion = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/questions/${id}`, config)
    console.log(response)
    return response.status === 204
  } catch (error) {
    console.log(error)
  }
  return false
}

const upvoteQuestion = async (id) => {
  try {
    const response = await axios.post(`${baseUrl}/questions/${id}/likes`, { likes: 1 }, config)
    console.log(response)
    return response.status === 200
  } catch (error) {
    console.log(error)
  }
  return false
}

const downvoteQuestion = async (id) => {
  try {
    const response = await axios.post(`${baseUrl}/questions/${id}/likes`, { likes: -1 }, config)
    console.log(response)
    return response.status === 200
  } catch (error) {
    console.log(error)
  }
  return false
}

const updateQuestion = async (id, updatedQuestion) => {
  try {
    const response = await axios.put(`${baseUrl}/questions/${id}`, updatedQuestion, config)
    return response.status === 200
  } catch (error) {
    console.log(error.response)
  }
  return false
}

export default {
  getAll,
  setToken,
  get,
  addComment,
  addQuestion,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
  upvoteComment,
  downvoteComment,
  deleteComment,
  updateQuestion,
}
