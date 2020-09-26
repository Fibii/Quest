import axios from 'axios'

const baseUrl = process.env.REACT_APP_BACKEND_URL

const config = {
  withCredentials: true,
}

const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseUrl}/login/`, credentials, config)
    return response.data
  } catch (error) {
    console.log(error)
  }
  return false
}

const createUser = async (user) => {
  try {
    const response = await axios.post(`${baseUrl}/users`, user, config)
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

const isValidToken = async () => {
  try {
    const response = await axios.get(`${baseUrl}/login/isValidToken`, config)
    console.log('response', response)
    return response.status === 200
  } catch (error) {
    console.log(error)
    return false
  }
}

export default {
  login,
  createUser,
  getUser,
  isValidToken,
}
