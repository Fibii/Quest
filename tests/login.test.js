const testHelper = require('../utils/testHelper')
const app = require('../app')
const User = require('../models/user')
const superTest = require('supertest')

const api = superTest(app)


beforeEach(async () => {
  await User.deleteMany({})
})

describe('auth', () => {

  test('a user can be logged in', async () => {
    const usersInDb = testHelper.getInitialUsers()
    const user = {
      username: usersInDb[0].username,
      password: usersInDb[0].password
    }

    // register the user
    await api.post('/api/users')
        .send(usersInDb[0])

    // login
    const response = await api.post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

  })

  test('a user with incorrect password cannot login', async () => {
    const usersInDb = testHelper.getInitialUsers()
    const user = {
      username: usersInDb[0].username,
      password: 'bad_password'
    }

    // register the user
    await api.post('/api/users')
        .send(usersInDb[0])

    // login
    const response = await api.post('/api/login')
        .send(user)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    expect(response.text.error).toBe('invalid password')

  })


});