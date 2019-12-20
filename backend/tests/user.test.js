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
  
  const promiseArray = users.map(user => api.post('/api/users').send(user))
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
        registerDate: new Date(user.registerDate),
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
      password: "ayoFibCome6layHere",
      email: "fibi@fibi.fr",
      dateOfBirth: "06-22-1955"
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

    const initialUsers = testHelper.getInitialUsers()

    const firstUser = {
      username: initialUsers[0].username,
      password: initialUsers[0].password
    }

    const secondUser = {
      username: initialUsers[1].username,
      password: initialUsers[1].password
    }

    const firstUserResponse = await api.post('/api/login')
        .send(firstUser)

    const secondUserResponse = await api.post('/api/login')
        .send(secondUser)

    // bad token and bad password
    await api.delete(`/api/users/${firstUserResponse.body.id}`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send(secondUser)
        .expect(401)

    // bad token and good password
    await api.delete(`/api/users/${firstUserResponse.body.id}`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send(firstUser)
        .expect(401)

    // good token and bad password
    await api.delete(`/api/users/${firstUserResponse.body.id}`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(secondUser)
        .expect(401)

    // good token and good password
    await api.delete(`/api/users/${firstUserResponse.body.id}`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(firstUser)
        .expect(204)


    const finalUsers = await testHelper.getUsersInDb()
    const finalUsernames = finalUsers.map(user => user.username)

    expect(finalUsers.length).toBe(initialUsers.length - 1)
    expect(finalUsernames).not.toContain(firstUser.username)

  })

  test('a user can be updated', async () => {
    const initialUsers = testHelper.getInitialUsers()


    const updatedUser = {
      ...initialUsers[0],
      email: 'newemailwho@dis.com',
    }

    const firstUser = {
      username: initialUsers[0].username,
      password: initialUsers[0].password
    }

    const secondUser = {
      username: initialUsers[1].username,
      password: initialUsers[1].password
    }

    // login both users
    const firstUserResponse = await api.post('/api/login')
        .send(firstUser)

    const secondUserResponse = await api.post('/api/login')
        .send(secondUser)

    // bad token and bad password
    await api.put(`/api/users/${firstUserResponse.body.id}`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send(secondUser)
        .expect(401)

    // bad token and good password
    await api.put(`/api/users/${firstUserResponse.body.id}`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send(firstUser)
        .expect(401)

    // good token and bad password
    await api.put(`/api/users/${firstUserResponse.body.id}`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(secondUser)
        .expect(401)

    // good token and good password
    await api.put(`/api/users/${firstUserResponse.body.id}`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(updatedUser)
        .expect(200)

    const finalUsers = await testHelper.getUsersInDb()
    const finalUser = finalUsers.filter(user => user.username === initialUsers[0].username)[0]

    expect(finalUser.email).toEqual(updatedUser.email)

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
      registerDate: new Date(user.registerDate),
      dateOfBirth: new Date(user.dateOfBirth),
    }

    expect(finalUser).toEqual(initialUsers[0])
  })

})

afterAll(() => {
  mongoose.connection.close()
})
