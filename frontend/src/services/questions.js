import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
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

export default {
  getAll,
  setToken,
  get
}
