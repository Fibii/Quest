const app = require('../app')
const User = require('../models/user')
const supertest = require('supertest')
const api = supertest(app)
const mongoose = require('mongoose')
const testHelper = require('../utils/testHelper')

beforeEach(async () => {

  // clear the database 
  await User.deleteMany({})

  // add initial users to the db 
  const users = testHelper.getInitialUsers()
  .map(user => new User(user))
  
  const promiseArray = users.map(user => user.save())
  await Promise.all(promiseArray)

})

describe('user crud', () => {

  test("all users are returned", async() => {
    const initialUsers = await testHelper.getUsersInDb()
    
    const response = await api.get("/api/users")
    .expect(200)

    const finalUsers = JSON.parse(response.text).map(user => {
      const userObj = {
        username: user.username,
        email: user.email,
        questions: user.questions,
        id: user.id,
        dateOfBirth: new Date(user.dateOfBirth),
      }
      return userObj
    }) 

    expect(finalUsers.sort()).toEqual(initialUsers.sort())

  })

  test("a proper user can be registered", async () => {

    const initialUsers = await testHelper.getUsersInDb()

    const newUser = {
      username: "fibi",
      password: "fibi",
      email: "fibi@fibi.fb",
      dateOfBirth: "2069-12-12"
    }

    const response = await api.post('/api/users')
        .send(newUser)
        .expect(200)

    const finalUsers = await testHelper.getUsersInDb()

    const usernames = finalUsers.map(user => user.username)

    expect(finalUsers.length).toBe(initialUsers.length + 1)
    expect(usernames).toContain(newUser.username)

  })

  test('a user can be deleted', async () => {
    const initialUsers = await testHelper.getUsersInDb()

    const user = initialUsers[0]
    await api.delete(`/api/users/${user.id}`)
    .expect(204)

    const finalUsers = await testHelper.getUsersInDb()
    const finalUsernames = finalUsers.map(user => user.username)

    expect(finalUsers.length).toBe(initialUsers.length - 1)
    expect(finalUsernames).not.toContain(user.username)

  })

  test('a user can be updated', async () => {
    const initialUsers = await testHelper.getUsersInDb()

    const user = {
      ...initialUsers[0],
      email: 'newemailwho@dis.com',
    }

    await api.put(`/api/users/${user.id}`)
    .expect(200)

    const finalUsers = await testHelper.getUsersInDb()
    const finalUser = finalUsers.filter(user => user.username === initialUsers[0].username)[0]

    expect(finalUser.email).not.toEqual(user.email)

  })

  test('a specific user is returned', async () => {
    const initialUsers = await testHelper.getUsersInDb()
    const response = await api.get(`/api/users/${initialUsers[0].id}`)
    .expect(200)
    
    const user = JSON.parse(response.text)
    const finalUser = {
      username: user.username,
      email: user.email,
      questions: user.questions,
      id: user.id,
      dateOfBirth: new Date(user.dateOfBirth),
    }

    expect(finalUser).toEqual(initialUsers[0])
  })

})

afterAll(() => {
  mongoose.connection.close()
})
