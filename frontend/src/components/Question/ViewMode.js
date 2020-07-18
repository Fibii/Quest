import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useParams } from 'react-router-dom'
import React, { useContext } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import UserContext from '../UserContext/UserContext'
import utils from '../../services/utils'
import { setErrorMessage, setQuestion } from '../../actions/questionActions'
import questionService from '../../services/questions'
import QuestionIconsView from '../QuestionIcons/QuestionIconsView'
import UpvoteBox from '../UpvoteBox/UpvoteBox'
import QuestionFooter from './QuestionFooter'
import AddCommentForm from './AddCommentForm'
import CommentView from './CommentView'


const useStyles = makeStyles((theme) => ({
  font: {
    [theme.breakpoints.between('lg', 'xl')]: {
      fontSize: '1.4rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem',
    },
  },
}))

const TitleView = ({ title }) => {
  const classes = useStyles()
  return (
    <Grid
      container
      justify="center"
      direction="column"
      style={{
        marginLeft: 20,
        flexGrow: 3,
      }}
    >
      <Typography
        variant="h5"
        align="left"
        className={classes.font}
        style={{
          overflowWrap: 'break-word',
        }}
        data-testid="title"
      >
        { title }
      </Typography>
    </Grid>
  )
}

const ContentView = ({ content }) => (
  <Grid
    item
    style={{
      marginRight: 12,
    }}
  >
    <Typography
      variant="body1"
      display="block"
      paragraph
      key={content}
      gutterBottom
      align="left"
      style={{
        overflowWrap: 'break-word',
        width: '100%',
      }}
      data-testid="content"
    >
      {content}
    </Typography>

  </Grid>
)


const ViewMode = ({ state, dispatch }) => {
  const { question } = state
  const { id } = useParams()
  const [user] = useContext(UserContext)
  const isMobile = useMediaQuery('(max-width:600px)')
  const questionLikes = utils.getLikes(question)


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

  return (
    <div>
      <Paper elevation={2}>
        <Grid container justify="space-between" wrap="nowrap">
          <TitleView title={question && question.title} />
          { !isMobile && <QuestionIconsView state={state} dispatch={dispatch} /> }
        </Grid>
        <Divider style={{
          width: '90%', margin: '0 auto', marginTop: 4, marginBottom: 2,
        }}
        />
        <Grid container wrap="nowrap">
          <UpvoteBox
            handleUpvote={() => handleUpvoteQuestion(question.id)}
            handleDownvote={() => handleDownvoteQuestion(question.id)}
            likes={questionLikes}
          />
          <ContentView content={question && question.content} />
        </Grid>
        <QuestionFooter state={state} dispatch={dispatch} />
      </Paper>

      <Grid>
        <List>
          {question && question.comments && question.comments.map((comment) => (
            <CommentView state={state} dispatch={dispatch} comment={comment} key={comment.id} />
          ))}
        </List>
        <AddCommentForm state={state} dispatch={dispatch} />
      </Grid>
    </div>
  )
}

export default ViewMode
