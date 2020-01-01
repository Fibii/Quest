import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'
let token = null
let config = null

const setToken = newToken => {
  token = `bearer ${newToken}`
  config = {
    headers: {'Authorization': token}
  }
}

const getAll = async () => {
  try {
    const result = await axios.get(baseUrl + '/questions/')
    return result.data
  } catch (error) {
    console.log(error)
  }
}

const get = async (id) => {
  try {
    const result = await axios.get(baseUrl + `/questions/${id}`)
    return result.data
  } catch (error) {
    console.log(error)
  }
}

const addComment = async (id, comment) => {
  try {
    const response = await axios
      .post(baseUrl + `/questions/${id}/new-comment`, comment, config)

    return response
  } catch (error) {
    console.log(error)
  }
}

export default {
  getAll,
  setToken,
  get,
  addComment
}
