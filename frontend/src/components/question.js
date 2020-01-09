import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Box from '@material-ui/core/Box'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Copyright from './copyrights'
import { useParams } from 'react-router'
import UserContext from './userContext'
import questionService from '../services/questions'
import userService from '../services/users'
import validator from '../services/validator'
import { useHistory } from 'react-router-dom'
import Notification from './notification'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    position: 'relative',
    minHeight: '100vh',
    height: '100%',
  },

  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    paddingTop: 8,
    height: '100%',
    marginBottom: '4rem'
  },
  gridList: {
    prefWidth: 800,
    height: '100%',
    padding: 0
  },

  questionContent: {
    maxWidth: 600
  },

  item: 0,

  likes: {
    padding: 0,
    margin: '0 auto'
  },

  textArea: {
    transition: 'none',
  },

  paper: {
    prefWidth: 800,
    margin: 2,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    displayDirection: 'column',
  },

  svg: {
    '&:hover': {
      fill: 'grey'
    }
  }


}))

const Question = () => {

  const classes = useStyles()

  const [dense, setDense] = useState(false)
  const [question, setQuestion] = useState({})
  const [commentContent, setCommentContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { id } = useParams()
  const user = useContext(UserContext)
  const history = useHistory()

  useEffect(() => {

    const getQuestion = async () => {
      const question = await questionService.get(id)
      if (!question || question.error) {
        setErrorMessage('error: cannot connect to the server')
      } else {
        setQuestion(question)
      }
    }
    getQuestion()
  }, [])

  const handleCommentPost = async (event) => {
    if (commentContent.length === 0) {
      setErrorMessage('comment must not be empty')
    } else {
      const comment = {
        content: commentContent,
        postedBy: user,
        likes: 0
      }

      const newComment = await questionService.addComment(id, comment)
      if (!newComment || newComment.error) {
        setErrorMessage('error: couldn\'t add a new comment, try again later')
      } else {
        setQuestion({
          ...question,
          comments: question.comments.concat({
            ...comment,
            id: newComment.id
          })
        })
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

  const handleUpvote = async () => {
    if (!user) {
      setErrorMessage('you must be a logged in to upvote')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    const response = await questionService.upvoteQuestion(id)
    if (response) {
      let value = 1
      if (question.likes) {
        const userLikes = question.likes.filter(like => like.likedBy == user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = 2
        }
      }
      setQuestion({
        ...question,
        likes: question.likes.concat({
          value: value,
          likedBy: user.id
        })
      })
    } else {
      setErrorMessage('error: could not upvote')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleDownvote = async () => {
    if (!user) {
      setErrorMessage('you must be a logged in to downvote')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    const response = await questionService.downvoteQuestion(id)
    if (response) {
      let value = -1
      if (question.likes) {
        const userLikes = question.likes.filter(like => like.likedBy == user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = -2
        }
      }
      setQuestion({
        ...question,
        likes: question.likes.concat({
          value: value,
          likedBy: user.id
        })
      })
    } else {
      setErrorMessage('error: could not downvote')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  /**
   * returns the number of likes if likes array is not empty, zero otherwise
   * @return integer
   * */
  const getQuestionLikes = () => {
    if (question && question.likes && question.likes.length > 0) {
      return question.likes.map(like => like.value).reduce((a,b) => a+b)
    }
    return 0
  }

  const likes = getQuestionLikes()

  return (
    <div>
      <Notification message={errorMessage}/>
      <div className={classes.container}>
        <div className={classes.root} style={{
          paddingBottom: '3 rem'
        }}>
          <CssBaseline/>
          <Paper className={classes.paper} elevation={14} style={{
            marginBottom: 16,
            marginTop: 0
          }}>
            <Grid container justify='space-between' direction='column'>
              <Grid container>
                <Grid container justify='center' direction='column' style={{
                  width: 40
                }}>
                  <Box className={classes.root} mr={2} id='likesBox' style={{
                    padding: 0,
                    margin: '0 auto'
                  }}>
                    <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                         className={classes.svg} onClick={handleUpvote}>
                      <path
                        d="M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z"/>
                    </svg>
                    <Typography variant="body1" display='block' gutterBottom
                                className={classes.likes}>
                      {likes}
                    </Typography>
                    <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                         className={classes.svg} onClick={handleDownvote}>
                      <path
                        d="M14.496 5.975l-.001 14.287-6.366-6.367L6 16.021l10.003 10.004L26 16.029 23.871 13.9l-6.366 6.368V5.977z"/>
                    </svg>
                  </Box>
                </Grid>
                <Grid item style={{
                  marginRight: 8
                }}>
                  <Typography variant="h5" gutterBottom className={classes.questionContent}>
                    {question.title}
                  </Typography>
                  <Typography variant="body1"
                              className={classes.questionContent}
                              display='block'
                              paragraph={true}
                              key={question.content}
                              gutterBottom>
                    {question.content}
                  </Typography>

                </Grid>

                <Grid item style={{
                  position: 'relative',
                  top: '50%',
                  marginRight: 16
                }}>
                  {validator.isAuthor(user, question) ?
                    <IconButton edge="end" aria-label="delete" onClick={handleDeleteQuestion}>
                      <DeleteIcon/>
                    </IconButton> : ''}
                </Grid>

              </Grid>

              <Grid item style={{
                position: 'relative'
              }}>
                <ButtonGroup size="small" aria-label="small outlined button group" style={{
                  marginBottom: 6,
                  marginLeft: 18,
                }}>
                  {question && question.tags && question.tags.map(tag => <Button key={tag} style={{
                    maxHeight: '20px',
                    minWidth: '60px',
                    minHeight: '20px',
                    fontSize: 10,
                  }}>{tag}</Button>)}
                </ButtonGroup>

                <Typography variant='caption' style={{
                  color: 'grey',
                  marginRight: 8,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}>
                  posted by: {question && question.postedBy && question.postedBy.username}
                </Typography>
              </Grid>

            </Grid>
          </Paper>
          <Grid container justify='center' direction='column'>
            <Grid item>
              <List dense={dense} className={classes.gridList}>
                {question && question.comments && question.comments.map(comment =>
                  <Paper className={classes.paper} key={comment.content + comment.likes}>
                    <Grid container justify='space-between' direction='column'>

                      <Grid container>
                        <ListItem key={comment.content} alignItems='center' disableGutters>

                          <Grid item>
                            <Grid container justify='center' direction='column' style={{
                              width: 40
                            }}>
                              <Box className={classes.root} mr={2} id='likesBox' style={{
                                padding: 0,
                                margin: '0 auto'
                              }}>
                                <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                                     className={classes.svg} onClick={() => alert('vote')}>
                                  <path
                                    d="M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z"/>
                                </svg>
                                <Typography variant="body1" display='block' gutterBottom
                                            className={classes.likes}>
                                  {comment.likes}
                                </Typography>
                                <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                                     className={classes.svg} onClick={() => alert('downvote')}>
                                  <path
                                    d="M14.496 5.975l-.001 14.287-6.366-6.367L6 16.021l10.003 10.004L26 16.029 23.871 13.9l-6.366 6.368V5.977z"/>
                                </svg>

                              </Box>
                            </Grid>
                          </Grid>

                          <Grid item>
                            <ListItemText
                              primary={comment.content}
                            />

                            {validator.isAuthor(user, comment) ? <ListItemSecondaryAction>
                              <IconButton edge="end" aria-label="delete"
                                          onClick={() => alert('delete this')}>
                                <DeleteIcon/>
                              </IconButton>
                            </ListItemSecondaryAction> : ''}
                          </Grid>

                        </ListItem>
                      </Grid>

                      <Grid item>
                        <Typography variant='caption' style={{
                          float: 'right',
                          marginRight: 8,
                          color: 'grey'
                        }}>
                          posted by: {comment.postedBy.username}
                        </Typography>
                      </Grid>

                    </Grid>


                  </Paper>
                )
                }
                {user ? <ListItem>
                  <TextField
                    placeholder="Add a comment"
                    multiline={true}
                    rows={3}
                    rowsMax={8}
                    fullWidth
                    variant="outlined"
                    onChange={(event) => setCommentContent(event.target.value)}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleCommentPost}>
                    submit
                  </Button>
                </ListItem> : ''}
              </List>
            </Grid>

            <Grid item>
            </Grid>
          </Grid>
        </div>
        <Copyright/>
      </div>
    </div>
  )
}

export default Question
