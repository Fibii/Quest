const User = require('../models/user')

const initialUsers = [
  {
    username: 'johnny1023',
    email: 'john@doe.com',
    password: 'johnnyBoy123',
    dateOfBirth: '1994-12-12'
  },
  
  {
    username: 'karen_',
    email: 'kkkk@doe.com',
    password: 'ayylmao123',
    dateOfBirth: '1998-01-23'
  }
]

const getInitialUsers = () => initialUsers

const getUsersInDb = async () => {
  try {
    const users = await User.find({}) 
    return users.map(user => user.toJSON())
  } catch (error) {
    console.log(error)
  }
}

module.exports = { 
  getInitialUsers,
  getUsersInDb
}