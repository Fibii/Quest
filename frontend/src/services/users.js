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
    const response = await axios.get(`${baseUrl}/login/isValidToken`, config)
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
