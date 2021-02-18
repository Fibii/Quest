import { useParams } from 'react-router-dom'
import React, { useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import UserContext from '../UserContext/UserContext'
import { setCommentContent, setErrorMessage, setQuestion } from '../../actions/questionActions'
import questionService from '../../services/questions'

const AddCommentForm = ({ state, dispatch }) => {
  const { id } = useParams()
  const [user] = useContext(UserContext)
  const { commentContent } = state
  /**
   * wrappers for useState setter functions
   * */
  const handleCommentChange = (event) => {
    event.preventDefault()
    const { value } = event.target
    dispatch(setCommentContent(value))
  }

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

  if (user) {
    return (
      <Grid
        container
        justify="center"
        style={{
          marginTop: 32,
          marginBottom: 32,
        }}
      >
        <Grid container direction="column" justify="center">
          <TextField
            placeholder="Add a comment"
            multiline
            rows={3}
            rowsMax={8}
            fullWidth
            variant="outlined"
            value={commentContent}
            onChange={(event) => handleCommentChange(event)}
          />
          <Grid
            container
            justify="flex-end"
            style={{
              marginTop: 8,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => dispatch(setCommentContent(''))}
            >
              clear
            </Button>
            <Button
              variant="outlined"
              onClick={handleCommentPost}
              style={{
                marginLeft: 8,
              }}
            >
              submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }
  return ''
}

export default AddCommentForm
