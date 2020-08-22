const superTest = require('supertest')
const testHelper = require('../utils/testHelper')
const app = require('../app')
const User = require('../models/user')

const api = superTest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('auth', () => {
  test('a user can be logged in', async () => {
    const usersInDb = testHelper.getInitialUsers()
    const user = {
      username: usersInDb[0].username,
      password: usersInDb[0].password,
    }

    // register the user
    await api.post('/api/users')
      .send(usersInDb[0])

    // login
    const response = await api.post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const loggedUser = await User.findById(response.body.id)
    const lastSignedInDate = new Date(loggedUser.lastSignedInDate)
    const now = new Date()

    // compare by error margin of ~60 minutes
    expect(lastSignedInDate.getDate())
      .toBe(now.getDate())
    expect(lastSignedInDate.getMonth())
      .toBe(now.getMonth())
    expect(lastSignedInDate.getFullYear())
      .toBe(now.getFullYear())
    expect(lastSignedInDate.getHours())
      .toBe(now.getHours())
  })

  test('a user with incorrect password cannot login', async () => {
    const usersInDb = testHelper.getInitialUsers()
    const user = {
      username: usersInDb[0].username,
      password: 'bad_password',
    }

    // register the user
    await api.post('/api/users')
      .send(usersInDb[0])

    // login
    const response = await api.post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('invalid password')
  })
})
