const express = require('express')

const router = express.Router()
const jwt = require('jsonwebtoken')
const Question = require('../models/question')
const User = require('../models/user')
const Comment = require('../models/comment')

router.get('/', async (request, response, next) => {
  try {
    const questions = await Question.find({})
      .populate({
        path: 'postedBy',
        model: 'User',
        select: 'username',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'postedBy',
          model: 'User',
          select: 'username',
        },
      })
    return response.json(questions)
  } catch (error) {
    return next(error)
  }
})

// used to show a question in frontend
router.get('/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    const question = await Question.findById(id)
      .populate({
        path: 'postedBy',
        model: 'User',
        select: 'username',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'postedBy',
          model: 'User',
          select: 'username',
        },
      })
    if (question) {
      return response.json(question)
    }
    return response.status(404)
      .end()
  } catch (error) {
    return next(error)
  }
})

// create a new question
router.post('/', async (request, response, next) => {
  try {
    const { body } = request
    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    // if the token is invalid
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.title || !body.content) {
      return response.status(401)
        .json({ error: 'title and content must be provided' })
    }

    const newQuestion = new Question({
      title: body.title,
      content: body.content,
      solved: false,
      likes: [{
        value: 0,
      }],
      postedDate: new Date(),
      tags: body.tags ? body.tags : [],
      postedBy: user.id,
    })

    const question = await newQuestion.save()

    // add the question to the user's questions
    user.questions.push(question._id)
    await User.findByIdAndUpdate(user.id, user)

    return response.status(201)
      .json(question)
  } catch (error) {
    return next(error)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    const { body } = request
    const { id } = request.params
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401)
        .json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401)
        .json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401)
        .json({ error: 'token missing or invalid' })
    }

    if (!body.title || !body.content) {
      return response.status(401)
        .json({ error: 'title and content must be provided' })
    }

    if (question.postedBy.toString() !== user._id.toString()) {
      return response.status(401)
        .json({ error: 'a questions can be deleted by authors only' })
    }

    const newQuestion = {
      title: body.title,
      content: body.content,
      solved: body.solved,
      tags: body.tags,
    }

    await Question.findByIdAndUpdate(question.id, newQuestion)

    return response.status(200)
      .json(question)
  } catch (error) {
    return next(error)
  }
})

router.post('/:id/title-content', async (request, response, next) => {
  try {
    const { body } = request
    const { id } = request.params
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401).json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.title || !body.content) {
      return response.status(401)
        .json({ error: 'title and content must be provided' })
    }

    if (question.postedBy.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'a questions can be deleted by authors only' })
    }

    const updatedQuestion = {
      ...question._doc,
      title: body.title,
      content: body.content,
    }

    await Question.findByIdAndUpdate(id, updatedQuestion)
    return response.status(200).end()
  } catch (error) {
    return next(error)
  }
})

router.post('/:id/new-comment', async (request, response, next) => {
  try {
    const { body } = request
    const { id } = request.params
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401).json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.content) {
      return response.status(401)
        .json({ error: 'content must be provided' })
    }

    const comment = new Comment({
      content: body.content,
      likes: [{
        value: 0,
      }],
      postedBy: user.id,
    })

    await comment.save()

    const updatedQuestion = {
      ...question._doc,
      comments: question._doc.comments.concat(comment),
    }

    await Question.findByIdAndUpdate(id, updatedQuestion)
    return response.status(200).json(comment)
  } catch (error) {
    return next(error)
  }
})

/**
 * deletes the comment with the given id,
 * since every comment has its id, there's no need to specify the id of the question
 * */
router.delete('/:questionID/delete-comment/:commentID', async (request, response, next) => {
  try {
    const { questionID } = request.params
    const { commentID } = request.params
    const comment = await Comment.findById(commentID)
    const question = await Question.findById(questionID)

    if (!comment || !question) {
      return response.status(401).json({ error: 'invalid comment id or question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (comment.postedBy.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'comments can be deleted by authors only' })
    }

    const updatedQuestion = {
      ...question._doc,
      comments: question._doc.comments.filter((commentId) => commentId !== commentID),
    }

    await Promise.all([
      Question.findByIdAndUpdate(questionID, updatedQuestion),
      Comment.findByIdAndRemove(commentID),
    ])
    return response.status(200).end()
  } catch (error) {
    return next(error)
  }
})

/**
 * increases or decreases the number of likes of a comment
 * */
router.post('/:questionID/likes/:commentID', async (request, response, next) => {
  try {
    const { body } = request
    const { questionID } = request.params
    const { commentID } = request.params
    const comment = await Comment.findById(commentID)
    const question = await Question.findById(questionID)

    if (!comment || !question) {
      return response.status(401).json({ error: 'invalid comment id or question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.likes) {
      return response.status(401)
        .json({ error: 'value must be provided as a number' })
    }

    const likeUsers = comment.likes.map((like) => like.likedBy)

    // if the user upvotes or downvotes again
    if (likeUsers.includes(user.id)) {
      const currentLike = body.likes >= 0 ? 1 : -1
      const userLikes = comment.likes.filter((like) => String(like.likedBy) === String(user.id))
      const userLike = userLikes[userLikes.length - 1].value
      if (currentLike === userLike || currentLike * 2 === userLike) {
        return response.status(401).end()
      }

      const updatedComment = {
        ...comment._doc,
        likes: comment.likes.concat({
          value: body.likes >= 0 ? 2 : -2,
          likedBy: user.id,
        }),
      }

      await Comment.findByIdAndUpdate(comment.id, updatedComment)
      return response.status(200).end()
    }

    const updatedComment = {
      ...comment._doc,
      likes: comment.likes.concat({
        value: body.likes >= 0 ? 1 : -1,
        likedBy: user.id,
      }),
    }

    await Comment.findByIdAndUpdate(comment.id, updatedComment)
    return response.status(200).end()
  } catch (error) {
    return next(error)
  }
})

/**
 * increases or decreases the number of likes of a comment
 * */
router.post('/:questionID/edit-comment/:commentID', async (request, response, next) => {
  try {
    const { body } = request
    const { questionID } = request.params
    const { commentID } = request.params
    const comment = await Comment.findById(commentID)
    const question = await Question.findById(questionID)

    if (!comment || !question) {
      return response.status(401).json({ error: 'invalid comment id or question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (comment.postedBy.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'comments can be deleted by authors only' })
    }

    if (!body.content) {
      return response.status(401)
        .json({ error: 'content must be provided' })
    }

    const updatedComment = {
      ...comment._doc,
      content: body.content,
    }

    await Comment.findByIdAndUpdate(commentID, updatedComment)
    return response.status(200).end()
  } catch (error) {
    return next(error)
  }
})

router.post('/:id/tags', async (request, response, next) => {
  try {
    const { body } = request
    const { id } = request.params
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401).json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (question.postedBy.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'a questions can be deleted by authors only' })
    }

    if (!body.tags) {
      return response.status(401)
        .json({ error: 'tags must be provided' })
    }

    const updatedQuestion = {
      ...question._doc,
      tags: body.tags,
    }

    await Question.findByIdAndUpdate(id, updatedQuestion)
    return response.status(200).end()
  } catch (error) {
    return next(error)
  }
})

router.post('/:id/solved', async (request, response, next) => {
  try {
    const { body } = request
    const { id } = request.params
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401).json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (question.postedBy.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'a questions can be deleted by authors only' })
    }

    if (!body.solved) {
      return response.status(401)
        .json({ error: 'solved must be provided' })
    }

    const updatedQuestion = {
      ...question._doc,
      solved: body.solved,
    }

    await Question.findByIdAndUpdate(id, updatedQuestion)
    return response.status(200).end()
  } catch (error) {
    return next(error)
  }
})

/**
 * increases the number of likes based on the likes object that's posted
 * if likes >= 0 then the likes are increased by 1, else decreased by 1
 * */
router.post('/:id/likes', async (request, response, next) => {
  try {
    const { body } = request
    const { id } = request.params
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401).json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.likes) {
      return response.status(401)
        .json({ error: 'likes must be provided as a number' })
    }

    const likeUsers = question.likes.map((like) => like.likedBy)

    // if the user upvotes or downvotes again
    if (likeUsers.includes(user.id)) {
      const currentLike = body.likes >= 0 ? 1 : -1
      const userLikes = question.likes.filter((like) => String(like.likedBy) === String(user.id))
      const userLike = userLikes[userLikes.length - 1].value
      if (currentLike === userLike || currentLike * 2 === userLike) {
        return response.status(401).end()
      }

      // if the question had 3 likes, and the user upvote,
      // it becomes 4, then he downvotes,
      // it should be (init value - 1) which is (4 - 2)
      const updatedQuestion = {
        ...question._doc,
        likes: question.likes.concat({
          value: body.likes >= 0 ? 2 : -2,
          likedBy: user.id,
        }),
      }
      await Question.findByIdAndUpdate(id, updatedQuestion)
      return response.status(200).end()
    }

    const updatedQuestion = {
      ...question._doc,
      likes: question.likes.concat({
        value: body.likes >= 0 ? 1 : -1,
        likedBy: user.id,
      }),
    }

    await Question.findByIdAndUpdate(id, updatedQuestion)
    return response.status(200).end()
  } catch (error) {
    return next(error)
  }
})

// delete a question
router.delete('/:id', async (request, response, next) => {
  try {
    const { id } = request.params
    const question = await Question.findById(id)

    if (!question) {
      return response.status(401).json({ error: 'invalid question id' })
    }

    const decodedToken = jwt.decode(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (question.postedBy.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'a questions can be deleted by authors only' })
    }

    const updatedUserQuestion = user._doc.questions
      .filter((userQuestion) => userQuestion.toString() !== question.id.toString())

    const updatedUser = {
      ...user._doc,
      questions: updatedUserQuestion,
    }

    await Promise.all([
      User.findByIdAndUpdate(user.id, updatedUser),
      Question.findByIdAndRemove(id),
    ])

    return response.status(204).end()
  } catch (error) {
    return next(error)
  }
})

module.exports = router
