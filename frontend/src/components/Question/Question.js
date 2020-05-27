import React, { useContext, useEffect, useReducer } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import UserContext from '../UserContext/UserContext'
import questionService from '../../services/questions'

import QuestionView from './QuestionView'
import { questionReducer, initialState } from '../../reducers/QuestionReducer'
import {
  setQuestion,
  setEditedQuestionContent,
  setEditedQuestionTags,
  setEditedQuestionTitle,
  setShowEditFields,
  setCommentContent,
  setErrorMessage,
} from '../../actions/questionActions'
import validator from '../../services/validator'


const Question = () => {
  const [state, dispatch] = useReducer(questionReducer, initialState)
  const { id } = useParams()
  const [user] = useContext(UserContext)
  const history = useHistory()


  /**
   * fetches the question from the backend and updates the question variable if no error,
   * otherwise it displays an error message
   * updates editedQuestionTitle and editedQuestionContent to the title, content of the question
   * respectively if they were empty, otherwise it won't because the rerender will be a side effect
   * of changing the state of those when the client edits one of them
   * */
  useEffect(() => {
    const getQuestion = async () => {
      const question = await questionService.get(id)
      if (!question || question.error) {
        dispatch(setErrorMessage('error: cannot connect to the server'))
      } else {
        dispatch(setQuestion(question))
        if (state.editedQuestionTitle === null) { // if this is the first time loading the page
          dispatch(setEditedQuestionTitle(question.title))
        }

        if (state.editedQuestionContent === null) {
          dispatch(setEditedQuestionContent(question.content))
        }

        if (state.editedQuestionTags === null) {
          dispatch(setEditedQuestionTags(question.tags.join(', ')))
        }
      }
    }
    getQuestion()
  }, [id])

  const handleCommentPost = async () => {
    if (state.commentContent.length === 0) {
      setTimeout(() => dispatch(setErrorMessage('')), 3000)
      dispatch(setErrorMessage('comment must not be empty'))
    } else {
      const comment = {
        content: state.commentContent,
        postedBy: user,
      }

      const newComment = await questionService.addComment(id, comment)
      if (!newComment || newComment.error) {
        dispatch(setErrorMessage('error: couldn\'t add a new comment, try again later'))
      } else {
        dispatch(setQuestion({
          ...state.question,
          comments: state.question.comments.concat({
            ...comment,
            id: newComment.data.id,
            likes: [],
          }),
        }))
        dispatch(setCommentContent(''))
      }
    }
  }

  /**
   * deletes a question form the database
   * */
  const handleDeleteQuestion = async () => {
    const response = await questionService.deleteQuestion(id)
    if (response) {
      history.push('/')
    } else {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('error: couldn\'t delete the question'))
    }
  }

  const handleUpvoteQuestion = async () => {
    if (!user) {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('you must be a logged in to upvote'))
      return
    }

    const response = await questionService.upvoteQuestion(id)
    if (response) {
      let value = 1
      if (state.question.likes) {
        const userLikes = state.question.likes.filter((like) => like.likedBy === user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = 2
        }
      }
      dispatch(setQuestion({
        ...state.question,
        likes: state.question.likes.concat({
          value,
          likedBy: user.id,
        }),
      }))
    } else {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('error: could not upvote'))
    }
  }

  const handleDownvoteQuestion = async () => {
    if (!user) {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('you must be a logged in to downvote'))
      return
    }

    const response = await questionService.downvoteQuestion(id)
    if (response) {
      let value = -1
      if (state.question.likes) {
        const userLikes = state.question.likes.filter((like) => like.likedBy === user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = -2
        }
      }
      dispatch(setQuestion({
        ...state.question,
        likes: state.question.likes.concat({
          value,
          likedBy: user.id,
        }),
      }))
    } else {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('error: could not downvote'))
    }
  }

  const handleUpvoteComment = async (comment) => {
    if (!user) {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('you must be a logged in to upvote'))
      return
    }
    const response = await questionService.upvoteComment(id, comment.id)
    if (response) {
      let value = 1
      if (comment.likes) {
        const userLikes = comment.likes.filter((like) => like.likedBy === user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = 2
        }
      }

      console.log(state.question.comments)
      // update the comments array
      const newComments = state.question.comments
      newComments.forEach((questionComment) => {
        if (questionComment.id === comment.id) {
          questionComment.likes.push({
            value,
            likedBy: user.id,
          })
        }
      })

      dispatch(setQuestion({
        ...state.question,
        comments: newComments,
      }))
    } else {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('error: could not upvote'))
    }
  }

  const handleDownvoteComment = async (comment) => {
    if (!user) {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('you must be a logged in to downvote'))
      return
    }

    const response = await questionService.downvoteComment(id, comment.id)
    if (response) {
      let value = -1
      if (comment.likes) {
        const userLikes = comment.likes.filter((like) => like.likedBy === user.id)
        if (userLikes.length > 0) { // user already upvoted
          value = -2
        }
      }

      // update the comments array
      const newComments = state.question.comments
      newComments.forEach((questionComment) => {
        if (questionComment.id === comment.id) {
          questionComment.likes.push({
            value,
            likedBy: user.id,
          })
        }
      })

      dispatch(setQuestion({
        ...state.question,
        comments: newComments,
      }))
    } else {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('error: could not downvote'))
    }
  }

  const handleDeleteComment = async (commentId) => {
    const response = await questionService.deleteComment(id, commentId)
    if (response) {
      const newComments = state.question.comments.filter((comment) => comment.id !== commentId)
      dispatch(setQuestion({
        ...state.question,
        comments: newComments,
      }))
    } else {
      dispatch(setErrorMessage('error: couldn\'t connect to the server'))
    }
  }

  const handleQuestionUpdate = async () => {
    const tags = state.editedQuestionTags.split(' ')
      .map((tag) => tag.replace(/^\s+|\s+$/gm, ''))
      .filter((tag) => tag.length > 0)

    const updatedQuestion = {
      title: state.editedQuestionTitle,
      content: state.editedQuestionContent,
      solved: state.isQuestionSolved,
      tags,
    }

    if (!validator.questionFormValidator({ title: state.editedQuestionTitle })
      || !validator.questionFormValidator({ content: state.editedQuestionContent })
      || state.editedQuestionTagsHelperText) {
      dispatch(setErrorMessage('All fields are required, if a field is red, fix it'))
    } else {
      const response = await questionService.updateQuestion(state.question.id, updatedQuestion)

      if (!response || response.error) {
        dispatch(setErrorMessage('error: could not update the question'))
      } else {
        dispatch(setQuestion({
          ...state.question,
          title: updatedQuestion.title,
          content: updatedQuestion.content,
          tags: updatedQuestion.tags,
        }))
        dispatch(setShowEditFields(false))
      }
    }
  }

  return (
    <QuestionView
      user={user}
      state={state}
      dispatch={dispatch}
      handleUpvoteQuestion={handleUpvoteQuestion}
      handleQuestionUpdate={handleQuestionUpdate}
      handleDownvoteQuestion={handleDownvoteQuestion}
      handleDeleteQuestion={handleDeleteQuestion}
      handleCommentPost={handleCommentPost}
      handleDeleteComment={handleDeleteComment}
      handleDownvoteComment={handleDownvoteComment}
      handleUpvoteComment={handleUpvoteComment}
    />
  )
}

export default Question
