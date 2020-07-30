import { useParams } from 'react-router-dom'
import React, { useContext } from 'react'
import UserContext from '../UserContext/UserContext'
import { setErrorMessage, setQuestion } from '../../actions/questionActions'
import questionService from '../../services/questions'
import Comment from '../Comment/Comment'

const CommentView = ({ state, dispatch, comment }) => {
  const { id } = useParams()
  const [user] = useContext(UserContext)

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
  return (
    <div
      style={{
        marginTop: 8,
      }}
      key={comment.id}
    >
      <Comment
        user={user}
        comment={comment}
        handleUpvote={() => handleUpvoteComment(comment)}
        handleDownVote={() => handleDownvoteComment(comment)}
        handleDelete={() => handleDeleteComment(comment.id)}
      />
    </div>
  )
}

export default CommentView
