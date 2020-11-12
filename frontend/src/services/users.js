import axios from 'axios'
import configs from '../config'

const config = {
  withCredentials: true,
}

const { urls } = configs.backend

const login = async (credentials) => {
  try {
    const response = await axios.post(`${urls.login}/`, credentials, config)
    return response.data
  } catch (error) {
    console.log(error.response)
    if (error.response.status === 401 || error.response.status === 404) {
      return { error: 'invalid username or password' }
    }
    return { error: "Couldn't connect to the server, try again later or contact the owner" }
  }
}

const createUser = async (user) => {
  try {
    const response = await axios.post(`${urls.users}`, user, config)
    return response.data
  } catch (error) {
    return { error: "Couldn't connect to the server, try again later or contact the owner" }
  }
}

const getUser = async (userId) => {
  try {
    const response = await axios.get(`${urls.users}/${userId}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
  return false
}

/**
 * check if there's a logged in user saved in localStorage
 * @return true if there's a user saved in localStorage with a valid token cookie,
 * false otherwise
 * */
const getSavedUser = async () => {
  const loggedUser = JSON.parse(window.localStorage.getItem('qa_userLoggedIn'))
  const rememberMe = JSON.parse(window.localStorage.getItem('qa_userRememberMe'))
  console.log('lu', loggedUser)
  console.log('rm', rememberMe)
  if (loggedUser != null || rememberMe != null) {
    console.log('we here chief')
    const response = await axios.get(`${urls.isValidToken}`, config)
    const isValidToken = response.status === 200
    console.log('vt', isValidToken)
    if (isValidToken) {
      return loggedUser
    }
    window.localStorage.removeItem('qa_userLoggedIn')
    window.localStorage.removeItem('qa_userRememberMe')
  }
  return null
}

export default {
  login,
  createUser,
  getUser,
  getSavedUser,
}
