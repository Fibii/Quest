import React, { useContext, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import UserContext from './UserContext'
import questionService from '../services/questions'
import { useHistory } from 'react-router-dom'
import questionActions from '../services/questionActions'
import QuestionView from './QuestionView'

const Joi = require('@hapi/joi')


const Question = () => {

  const initialState = {
    question: {},
    commentContent: '',
    errorMessage: '',
    showEditFields: false,
    editedQuestionTitle: null,
    editedQuestionContent: null,
    editedQuestionTags: null,
    isQuestionSolved: false,
    editedQuestionTitleHelperText: '',
    editedQuestionContentHelperText: '',
    editedQuestionTagsHelperText: '',
    clipboardSnackbarOpen: false
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case questionActions.SET_QUESTION:
        return {
          ...state,
          question: action.question
        }
      case questionActions.SET_COMMENT_CONTENT:
        return {
          ...state,
          commentContent: action.commentContent
        }
      case questionActions.SET_ERROR_MESSAGE:
        return {
          ...state,
          errorMessage: action.errorMessage
        }
      case questionActions.SET_SHOW_EDIT_FIELDS:
        return {
          ...state,
          showEditFields: action.showEditFields
        }
      case questionActions.SET_EDITED_QUESTION_TITLE:
        return {
          ...state,
          editedQuestionTitle: action.editedQuestionTitle
        }
      case questionActions.SET_EDITED_QUESTION_CONTENT:
        return {
          ...state,
          editedQuestionContent: action.editedQuestionContent
        }
      case questionActions.SET_EDITED_QUESTION_TAGS:
        return {
          ...state,
          editedQuestionTags: action.editedQuestionTags
        }
      case questionActions.SET_EDITED_QUESTION_TITLE_HELPER_TEXT:
        return {
          ...state,
          editedQuestionTitleHelperText: action.editedQuestionTitleHelperText
        }
      case questionActions.SET_EDITED_QUESTION_CONTENT_HELPER_TEXT:
        return {
          ...state,
          editedQuestionContentHelperText: action.editedQuestionContentHelperText
        }
      case questionActions.SET_EDITED_QUESTION_TAGS_HELPER_TEXT:
        return {
          ...state,
          editedQuestionTagsHelperText: action.editedQuestionTagsHelperText
        }
      case questionActions.SET_IS_QUESTION_SOLVED:
        return {
          ...state,
          isQuestionSolved: action.isQuestionSolved
        }
      case questionActions.SET_CLIPBOARD_SNACKBAR_OPEN:
        return {
          ...state,
          clipboardSnackbarOpen: action.clipboardSnackbarOpen
        }
      default:
        throw new Error('unknown action')
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const { id } = useParams()
  const [user] = useContext(UserContext)
  const history = useHistory()

  /**
   * wrappers for useState setter functions
   * */
  const setQuestion = (question) => {
    dispatch({
      type: questionActions.SET_QUESTION,
      question: question
    })
  }

  const setErrorMessage = (errorMessage) => {
    dispatch({
      type: questionActions.SET_ERROR_MESSAGE,
      errorMessage: errorMessage
    })
  }

  const setCommentContent = (commentContent) => {
    dispatch({
      type: questionActions.SET_COMMENT_CONTENT,
      commentContent: commentContent
    })
  }

  const setShowEditFields = (showEditFields) => {
    dispatch({
      type: questionActions.SET_SHOW_EDIT_FIELDS,
      showEditFields: showEditFields
    })
  }

  const setEditedQuestionTitle = (editedQuestionTitle) => {
    dispatch({
      type: questionActions.SET_EDITED_QUESTION_TITLE,
      editedQuestionTitle: editedQuestionTitle
    })
  }

  const setEditedQuestionContent = (editedQuestionContent) => {
    dispatch({
      type: questionActions.SET_EDITED_QUESTION_CONTENT,
      editedQuestionContent: editedQuestionContent
    })
  }

  const setEditedQuestionTags = (editedQuestionTags) => {
    dispatch({
      type: questionActions.SET_EDITED_QUESTION_TAGS,
      editedQuestionTags: editedQuestionTags
    })
  }

  const setEditedQuestionTitleHelperText = (editedQuestionTitleHelperText) => {
    dispatch({
      type: questionActions.SET_EDITED_QUESTION_TITLE_HELPER_TEXT,
      editedQuestionTitleHelperText: editedQuestionTitleHelperText
    })
  }

  const setEditedQuestionContentHelperText = (editedQuestionContentHelperText) => {
    dispatch({
      type: questionActions.SET_EDITED_QUESTION_CONTENT_HELPER_TEXT,
      editedQuestionContentHelperText: editedQuestionContentHelperText
    })
  }

  const setEditedQuestionTagsHelperText = (editedQuestionTagsHelperText) => {
    dispatch({
      type: questionActions.SET_EDITED_QUESTION_TAGS_HELPER_TEXT,
      editedQuestionTagsHelperText: editedQuestionTagsHelperText
    })
  }

  const setIsQuestionSolved = (isQuestionSolved) => {
    dispatch({
      type: questionActions.SET_IS_QUESTION_SOLVED,
      isQuestionSolved: isQuestionSolved
    })
  }

  const setClipboardSnackbarOpen = (clipboardSnackbarOpen) => {
    dispatch({
      type: questionActions.SET_CLIPBOARD_SNACKBAR_OPEN,
      clipboardSnackbarOpen: clipboardSnackbarOpen
    })
  }

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
        setErrorMessage('error: cannot connect to the server')
      } else {
        setQuestion(question)
        if (state.editedQuestionTitle === null) { // if this is the first time loading the page
          setEditedQuestionTitle(question.title)
        }

        if (state.editedQuestionContent === null) {
          setEditedQuestionContent(question.content)
        }

        if (state.editedQuestionTags === null) {
          setEditedQuestionTags(question.tags.join(', '))
        }
      }
    }
    getQuestion()
  }, [id])

  const handleCommentPost = async (event) => {
    if (state.commentContent.length === 0) {
      setErrorMessage('comment must not be empty')
    } else {
      const comment = {
        content: state.commentContent,
        postedBy: user,
      }

      const newComment = await questionService.addComment(id, comment)
      if (!newComment || newComment.error) {
        setErrorMessage('error: couldn\'t add a new comment, try again later')
      } else {
        setQuestion({
          ...state.question,
          comments: state.question.comments.concat({
            ...comment,
            id: newComment.data.id,
            likes: [],
          })
        })
        setCommentContent('')
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
      setErrorMessage('error: couldn\'t delete the question')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleUpvoteQuestion = async () => {
    if (!user) {
      setErrorMessage('you must be a logged in to upvote')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    const response = await questionService.upvoteQuestion(id)
    if (response) {
      let value = 1
      if (state.question.likes) {
        const userLikes = state.question.likes.filter(like => like.likedBy === user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = 2
        }
      }
      setQuestion({
        ...state.question,
        likes: state.question.likes.concat({
          value: value,
          likedBy: user.id
        })
      })
    } else {
      setErrorMessage('error: could not upvote')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleDownvoteQuestion = async () => {
    if (!user) {
      setErrorMessage('you must be a logged in to downvote')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    const response = await questionService.downvoteQuestion(id)
    if (response) {
      let value = -1
      if (state.question.likes) {
        const userLikes = state.question.likes.filter(like => like.likedBy === user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = -2
        }
      }
      setQuestion({
        ...state.question,
        likes: state.question.likes.concat({
          value: value,
          likedBy: user.id
        })
      })
    } else {
      setErrorMessage('error: could not downvote')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleUpvoteComment = async (comment) => {
    if (!user) {
      setErrorMessage('you must be a logged in to upvote')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }
    const response = await questionService.upvoteComment(id, comment.id)
    if (response) {
      let value = 1
      if (comment.likes) {
        const userLikes = comment.likes.filter(like => like.likedBy === user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = 2
        }
      }

      console.log(state.question.comments)
      // update the comments array
      const newComments = state.question.comments
      newComments.forEach(questionComment => {
        if (questionComment.id === comment.id) {
          questionComment.likes.push({
            value: value,
            likedBy: user.id
          })
        }
      })

      setQuestion({
        ...state.question,
        comments: newComments
      })

    } else {
      setErrorMessage('error: could not upvote')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleDownvoteComment = async (comment) => {
    if (!user) {
      setErrorMessage('you must be a logged in to downvote')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    const response = await questionService.downvoteComment(id, comment.id)
    if (response) {
      let value = -1
      if (comment.likes) {
        const userLikes = comment.likes.filter(like => like.likedBy === user.id)
        if (userLikes.length > 0) { // user already upvoted
          value = -2
        }
      }

      // update the comments array
      const newComments = state.question.comments
      newComments.forEach(questionComment => {
        if (questionComment.id === comment.id) {
          questionComment.likes.push({
            value: value,
            likedBy: user.id
          })
        }
      })

      setQuestion({
        ...state.question,
        comments: newComments
      })

    } else {
      setErrorMessage('error: could not downvote')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleDeleteComment = async (commentId) => {
    // todo: add confirmation window (material ui's not the browser's)
    const response = await questionService.deleteComment(id, commentId)
    if (response) {
      const newComments = state.question.comments.filter(comment => comment.id !== commentId)
      setQuestion({
        ...state.question,
        comments: newComments
      })
    } else {
      setErrorMessage('error: couldn\'t connect to the server')
    }
  }



  const schema = Joi.object({
    title: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9_." "-]*'))
      .min(6)
      .max(64),
    content: Joi.string()
      .min(8),
    tags: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9,_ ]*$'))
  })
    .or('title', 'content', 'tags')

  /**
   * Updates editedQuestionTitle to user input, validates the title
   * Updates editedTitleHelperText to an error message if validation fails, otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedTitle = (event) => {
    setEditedQuestionTitle(event.target.value)
    setEditedQuestionTitleHelperText('')

    const { error } = schema.validate({
      title: state.editedQuestionTitle
    })

    if (error) {
      setEditedQuestionTitleHelperText('title must be 6 characters long at least and 64 at most')
    }

  }

  /**
   * Updates editedQuestionContent to user input, validates the title
   * Updates editedQuestionContentHelperText to an error message if validation fails, otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedContent = (event) => {
    setEditedQuestionContent(event.target.value)
    setEditedQuestionContentHelperText('')

    const { error } = schema.validate({
      content: state.editedQuestionContent
    })

    if (error) {
      setEditedQuestionContentHelperText('content must be at least 8 characters long')
    }

  }

  /**
   * Updates editedQuestionTags to user input, validates the title
   * Updates editedQuestionTagsHelperText to an error message if validation fails, otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedTags = (event) => {
    const tags = event.target.value
    setEditedQuestionTags(tags)
    setEditedQuestionTagsHelperText('')

    const { error } = schema.validate({
      tags: tags
    })

    if (error) {
      setEditedQuestionTagsHelperText('tags must be words, separated by commas, such "hello, world"')
    }
  }

  const handleQuestionUpdate = async () => {

    const tags = state.editedQuestionTags.split(',')
      .map(tag => tag.replace(/^\s+|\s+$/gm, ''))
      .filter(tag => tag.length > 0)

    const updatedQuestion = {
      title: state.editedQuestionTitle,
      content: state.editedQuestionContent,
      solved: state.isQuestionSolved,
      tags: tags
    }

    // validating only these two to allow empty tags, maybe refactor this later
    const { error } = schema.validate({
      title: state.editedQuestionTitle,
      content: state.editedQuestionContent,
    })

    if (error || state.editedQuestionTagsHelperText) {
      setErrorMessage('All fields are required, if a field is red, fix it')
    } else {
      const response = await questionService.updateQuestion(state.question.id, updatedQuestion)

      if (!response || response.error) {
        setErrorMessage('error: could not update the question')
      } else {
        setQuestion({
          ...state.question,
          title: updatedQuestion.title,
          content: updatedQuestion.content,
          tags: updatedQuestion.tags
        })
        setShowEditFields(false)
      }
    }
  }

  const handleClipboardSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setClipboardSnackbarOpen(false)
  }

  const handleShareQuestion = () => {
    setClipboardSnackbarOpen(true)
  }

  return (
    <QuestionView
      user={user}
      state={state}
      dispatch={dispatch}
      handleUpvoteQuestion={handleUpvoteQuestion}
      handleShareQuestion={handleShareQuestion}
      handleQuestionUpdate={handleQuestionUpdate}
      handleEditedTitle={handleEditedTitle}
      handleEditedTags={handleEditedTags}
      handleEditedContent={handleEditedContent}
      handleDownvoteQuestion={handleDownvoteQuestion}
      handleDeleteQuestion={handleDeleteQuestion}
      handleCommentPost={handleCommentPost}
      handleClipboardSnackbar={handleClipboardSnackbar}
      handleDeleteComment={handleDeleteComment}
      handleDownvoteComment={handleDownvoteComment}
      handleUpvoteComment={handleUpvoteComment}
    />
  )
}

export default Question
