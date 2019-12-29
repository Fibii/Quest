import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl + '/login/', credentials)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export default {
  login,
  setToken
}
