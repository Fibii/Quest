import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'

const getAll = async () => {
  try {
    const result = await axios.get(baseUrl + '/questions/')
    return result.data
  } catch (error) {
    console.log(error)
  }
}

export default {
  getAll
}
