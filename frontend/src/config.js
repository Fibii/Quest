const ROOT_URL = process.env.REACT_APP_URL === '/' ? '' : process.env.REACT_APP_URL
const BACKEND_ROOT_URL = process.env.REACT_APP_BACKEND_URL === '/' ? '' : process.env.REACT_APP_BACKEND_URL

const config = {
  urls: { // react urls
    root: process.env.REACT_APP_URL,
    register: `${ROOT_URL}/register`,
    login: `${ROOT_URL}/login`,
    user: `${ROOT_URL}/user`,
    newQuestion: `${ROOT_URL}/question/new`,
    welcome: `${ROOT_URL}/welcome`,
    question: `${ROOT_URL}/question`,
  },
  backend: {
    urls: {
      questions: `${BACKEND_ROOT_URL}/questions`,
      login: `${BACKEND_ROOT_URL}/login`,
      users: `${BACKEND_ROOT_URL}/users`,
      isValidToken: `${BACKEND_ROOT_URL}/login/isValidToken`,
      comments: 'comments',
      likes: 'likes',

    },
  },
}

export default config
