const app = require('../app')
const Question = require('../models/question')
const User = require('../models/user')
const Comment = require('../models/comment')
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
    expect(userQuestions.map(question => question.id )).toContain(questionResponse.body.id)
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

  test('a question can be updated', async () => {
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
      content: 'this question has been edited',
      tags: ['newTags'],
    }

    await api.put(`/api/questions/${question.body.id}`)
      .set('Authorization', `bearer ${firstUserResponse.body.token}`)
      .send(editedQuestion)
      .expect(200)

    await api.put(`/api/questions/${question.body.id}`)
      .set('Authorization', `bearer ${secondUserResponse.body.token}`)
      .send(editedQuestion)
      .expect(401)

    const finalQuestions = await testHelper.getQuestionsInDb()
    const finalQuestion = finalQuestions.filter(finalQuestion => finalQuestion.id === question.body.id)[0]

    expect(finalQuestion.title)
      .toBe(editedQuestion.title)

  })

  test('a question\'s with title and content can be updated by the author', async () => {
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
        .expect(200)

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
    const secondUserResponse = await getUserResponse(1)
    const initLikes = 0

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
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send({likes: 1})
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/likes`)
      .set('Authorization', `bearer ${secondUserResponse.body.token}`)
      .send({likes: 1})
      .expect(401)

    const questionIncreased = (await testHelper.getQuestionsInDb())
        .filter(incQuestion => incQuestion.id === question.body.id)[0]

    const increasedLikes = questionIncreased.likes.map(like => like.value)
      .reduce((a, b) => a + b, 0)

      expect(increasedLikes).toBe(initLikes + 1)

    await api.post(`/api/questions/${question.body.id}/likes`)
        .set('Authorization', `bearer ${response.body.token}`)
        .send({likes: -1})
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/likes`)
      .set('Authorization', `bearer ${response.body.token}`)
      .send({likes: -1})
      .expect(401)

    const questionDecreased = (await testHelper.getQuestionsInDb())
        .filter(decQuestion => decQuestion.id === question.body.id)[0]

    const decreasedLikes = questionDecreased.likes.map(like => like.value)
      .reduce((a, b) => a + b, 0)

    expect(decreasedLikes).toBe(increasedLikes - 1)


  })

  test("question tags can be updated by the author", async () => {
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

    const tags = {
      tags:['new_tag', 'react', 'redux']
    }

    await api.post(`/api/questions/${question.body.id}/tags`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(tags)
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/tags`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send(tags)
        .expect(401)

    const authorQuestion = await api.get(`/api/questions/${question.body.id}`)
    expect(authorQuestion.body.tags.sort()).toEqual(tags.tags.sort())

  })

  test("question can be set to solved by the author", async () => {
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

    const solved = {
      solved:true
    }

    await api.post(`/api/questions/${question.body.id}/solved`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(solved)
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/solved`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send(solved)
        .expect(401)

    const authorQuestion = await api.get(`/api/questions/${question.body.id}`)
    expect(authorQuestion.body.solved).toBeTruthy()

  })

  test("a comment can by added by any user", async () => {

    const response = await getUserResponse()
    const secondUserResponse = await getUserResponse(1)

    const newQuestion = {
      title: 'first question',
      content: 'first question added for the sake of testing',
      tags: ['testing', 'hello_world'],
    }

    const newComment = {
      content: 'first comment added for the sake of testing',
    }

    const question = await api.post('/api/questions')
        .set('Authorization', `bearer ${response.body.token}`)
        .send(newQuestion)
        .expect(201)

    const commentResponse = await api.post(`/api/questions/${question.body.id}/new-comment`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send(newComment)
        .expect(200)

    const finalQuestion = (await testHelper.getQuestionsInDb())
        .filter(finalQuestion => finalQuestion.id === question.body.id)[0]

    const comment = await Comment.findById(commentResponse.body.id)

    expect(finalQuestion.comments.length).toBe(1)
    expect(comment).toBeTruthy()

  })


  test("comment can be deleted to solved by the author", async () => {
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

    const comment = {
      content: 'another comment, thanks'
    }

    await api.post(`/api/questions/${question.body.id}/new-comment`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send({
          content: 'new comment, thanks'
        })
        .expect(200)

    const commentResponse = await api.post(`/api/questions/${question.body.id}/new-comment`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(comment)
        .expect(200)

    await api.delete(`/api/questions/${question.body.id}/delete-comment/${commentResponse.body.id}`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .expect(401)

    await api.delete(`/api/questions/${question.body.id}/delete-comment/${commentResponse.body.id}`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .expect(200)

    const authorQuestion = await api.get(`/api/questions/${question.body.id}`)
    expect(authorQuestion.body.comments.length).toBe(1)

  })

  test("likes of a comment can be increased, decreased", async () => {

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

    const comment = {
      content: 'new comment'
    }

    const commentResponse = await api.post(`/api/questions/${question.body.id}/new-comment`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(comment)
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/likes/${commentResponse.body.id}`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send({likes: 1})
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/likes/${commentResponse.body.id}`)
      .set('Authorization', `bearer ${firstUserResponse.body.token}`)
      .send({likes: 1})
      .expect(401)

    await api.post(`/api/questions/${question.body.id}/likes/${commentResponse.body.id}`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send({likes: -1})
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/likes/${commentResponse.body.id}`)
      .set('Authorization', `bearer ${secondUserResponse.body.token}`)
      .send({likes: -1})
      .expect(401)

    const finalComment = await Comment.findById(commentResponse.body.id)
    const finalCommentLikes = finalComment.likes.map(like => like.value)
      .reduce((a, b) => a + b, 0)

    expect(finalCommentLikes).toBe(0)


  })

  test("a comment can be edited by the author", async () => {

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

    const comment = {
      content: 'new comment'
    }

    const commentResponse = await api.post(`/api/questions/${question.body.id}/new-comment`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send(comment)
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/edit-comment/${commentResponse.body.id}`)
        .set('Authorization', `bearer ${firstUserResponse.body.token}`)
        .send({content: 'comment is edited'})
        .expect(200)

    await api.post(`/api/questions/${question.body.id}/edit-comment/${commentResponse.body.id}`)
        .set('Authorization', `bearer ${secondUserResponse.body.token}`)
        .send({content: 'comment is edited'})
        .expect(401)

    const finalComment = await Comment.findById(commentResponse.body.id)

    expect(finalComment.content).toBe('comment is edited')


  })

})

afterAll(() => {
  mongoose.connection.close()
})
