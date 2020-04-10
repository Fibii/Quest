import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'
// let token = null
//
// const setToken = (newToken) => {
//   token = `bearer ${newToken}`
// }

const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseUrl}/login/`, credentials)
    return response.data
  } catch (error) {
    console.log(error)
  }
  return false
}

const createUser = async (user) => {
  try {
    const response = await axios.post(`${baseUrl}/users`, user)
    return response.data
  } catch (error) {
    console.log(error)
  }
  return false
}

const getUser = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}/users/${userId}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
  return false
}

export default {
  login,
  createUser,
  getUser,
}
