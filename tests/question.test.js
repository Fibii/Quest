const app = require('../app')
const Question = require('../models/question')
const User = require('../models/user')
const supertest = require('supertest')
const api = supertest(app)
const mongoose = require('mongoose')
const testHelper = require('../utils/testHelper')

beforeEach(async () => {

  // clear the database
  await Question.deleteMany({})
  await User.deleteMany({})

  // add initial questions to the db
  const questions = testHelper.getInitialQuestions()
      .map(question => new Question(question))

  const promiseArray = questions.map(question => question.save())
  await Promise.all(promiseArray)

})

/**
 * userIndex is the index of user in initialUsers
 * returns the response of user login
 * */
const getUserResponse = async (userIndex=0) => {
  const initialUsers = testHelper.getInitialUsers()

  const user = {
    username: initialUsers[userIndex].username,
    password: initialUsers[userIndex].password
  }

  // register the user
  await api.post('/api/users')
      .send(initialUsers[userIndex])

  // login the user to get jwt
  const response = await api.post('/api/login')
      .send(user)

  return response
}

describe('question crud', () => {

  test("all questions are returned", async() => {
    const initialQuestions = await testHelper.getQuestionsInDb()

    const response = await api.get("/api/questions")
        .expect(200)

    console.log(response.text)
    const finalQuestions = JSON.parse(response.text)

    expect(finalQuestions.sort()).toEqual(initialQuestions.sort())

  })

  test("a proper question can be created", async () => {
    const initialQuestions = await testHelper.getQuestionsInDb()
    const initialUsers = testHelper.getInitialUsers()

    console.log(initialUsers)

    const user = {
      username: initialUsers[0].username,
      password: initialUsers[0].password
    }

    // register the user
    const userPostResponse = await api.post('/api/users')
        .send(initialUsers[0])

    // login the user to get jwt
    const response = await api.post('/api/login')
        .send(user)

    const newQuestion = {
      title: 'first question',
      content: 'first question added for the sake of testing',
      tags: ['testing', 'hello_world'],
    }

    const questionResponse = await api.post('/api/questions')
        .set('Authorization', `bearer ${response.body.token}`)
        .send(newQuestion)
        .expect(201)

    const userGetResponse = await api.get(`/api/users/${userPostResponse.body.id}`)
    const finalQuestions = await testHelper.getQuestionsInDb()

    const userQuestions = userGetResponse.body.questions

    expect(finalQuestions.length).toBe(initialQuestions.length + 1)
    expect(userQuestions).toContain(questionResponse.body.id)
  })


  test('a specific question is returned', async () => {
    const question = (await testHelper.getQuestionsInDb())[0]
    const response = await api.get(`/api/questions/${question.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const returnedQuestion = JSON.parse(response.text)

    expect(returnedQuestion).toEqual(question)

  })

})

describe('question deletion', () => {
  test('a question can be deleted by the user that created it', async () => {
    const initialQuestions = await testHelper.getQuestionsInDb()
    const response = await getUserResponse()

    const newQuestion = {
      title: 'first question',
      content: 'first question added for the sake of testing',
      tags: ['testing', 'hello_world'],
    }

    const question = await api.post('/api/questions')
        .set('Authorization', `bearer ${response.body.token}`)
        .send(newQuestion)
        .expect(201)

    const deleteResponse = await api.delete(`/api/questions/${question.body.id}`)
        .set('Authorization', `bearer ${response.body.token}`)
        .send()
        .expect(204)

    // expect the question to be deleted from the user question list
    const userResponse = await api.get(`/api/users/${response.body.id}`)
    const finalQuestions = await testHelper.getQuestionsInDb()

    expect(finalQuestions.length).toBe(initialQuestions.length)
    expect(userResponse.body.questions).not.toContainEqual(question.body.id)
  })

  test("a question cannot be deleted with a user that didn't create it", async () => {
    const initialQuestions = await testHelper.getQuestionsInDb()

    // login the user to get jwt
    const responseOne = await getUserResponse(0)

    const responseTwo = await getUserResponse(1)

    const newQuestion = {
      title: 'first question',
      content: 'first question added for the sake of testing',
      tags: ['testing', 'hello_world'],
    }

    const question = await api.post('/api/questions')
        .set('Authorization', `bearer ${responseOne.body.token}`)
        .send(newQuestion)
        .expect(201)

    const deleteResponse = await api.delete(`/api/questions/${question.body.id}`)
        .set('Authorization', `bearer ${responseTwo.body.token}`)
        .send()
        .expect(401)

    const finalQuestions = await testHelper.getQuestionsInDb()

    expect(finalQuestions.length).toBe(initialQuestions.length + 1)
    expect(deleteResponse.body.error).toBe('a questions can be deleted by authors only')

  })
})

describe('question updation', () => {

  test("a question's with title and content can be updated by the author", async () => {
    const initialQuestions = await testHelper.getQuestionsInDb()
    const response = await getUserResponse()

    const newQuestion = {
      title: 'first question',
      content: 'first question added for the sake of testing',
      tags: ['testing', 'hello_world'],
    }

    const question = await api.post('/api/questions')
        .set('Authorization', `bearer ${response.body.token}`)
        .send(newQuestion)
        .expect(201)

    // edit title and content
    const editedQuestion = {
      title: 'this question has been edited',
      content: 'this question has been edited'
    }

    await api.post(`/api/questions/${question.body.id}/title-content`)
        .set('Authorization', `bearer ${response.body.token}`)
        .send(editedQuestion)
        .expect(303)

    const finalQuestions = (await testHelper.getQuestionsInDb()).map(question => {
      return {
        title: question.title,
        content: question.content
      }
    })

    expect(finalQuestions.length).toBe(initialQuestions.length + 1)
    expect(finalQuestions).toContainEqual(editedQuestion)

  })

  test("a question with title and content cannot be updated by the user that didnt create it", async () => {
    const initialQuestions = await testHelper.getQuestionsInDb()
    const firstUserResponse = await getUserResponse()
    const secondUserResponse = await getUserResponse(1)

    const newQuestion = {
      title: 'first question',
      content: 'first question added for the sake of testing',
      tags: ['testing', 'hello_world'],
    }

    const question = await api.post('/api/questions')
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(newQuestion)
        .expect(201)

    // edit title and content
    const editedQuestion = {
      title: 'this question has been edited',
      content: 'this question has been edited'
    }

    await api.post(`/api/questions/${question.body.id}/title-content`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send(editedQuestion)
        .expect(401)

    const finalQuestions = await testHelper.getQuestionsInDb()

    expect(finalQuestions.length).toBe(initialQuestions.length + 1)

  })

  test("the number of likes can be increased, decreased", async () => {

    const response = await getUserResponse()

    const newQuestion = {
      title: 'first question',
      content: 'first question added for the sake of testing',
      tags: ['testing', 'hello_world'],
    }

    const question = await api.post('/api/questions')
        .set('Authorization', `bearer ${response.body.token}`)
        .send(newQuestion)
        .expect(201)

    await api.post(`/api/questions/${question.body.id}/likes`)
        .set('Authorization', `bearer ${response.body.token}`)
        .send({likes: 1})
        .expect(303)

    const questionIncreased = (await testHelper.getQuestionsInDb())
        .filter(incQuestion => incQuestion.id === question.body.id)[0]

    expect(questionIncreased.likes).toBe(question.body.likes + 1)

    await api.post(`/api/questions/${question.body.id}/likes`)
        .set('Authorization', `bearer ${response.body.token}`)
        .send({likes: -1})
        .expect(303)

    const questionDecreased = (await testHelper.getQuestionsInDb())
        .filter(decQuestion => decQuestion.id === question.body.id)[0]

    expect(questionDecreased.likes).toBe(questionIncreased.likes - 1)


  })

})

afterAll(() => {
  mongoose.connection.close()
})
