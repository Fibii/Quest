import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
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
import validator from '../services/validator'
import { useHistory } from 'react-router-dom'
import Notification from './notification'
import Divider from '@material-ui/core/Divider'
import grey from '@material-ui/core/colors/grey'
import ShareIcon from '@material-ui/icons/Share'
import EditIcon from '@material-ui/icons/Edit'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

const Joi = require('@hapi/joi')

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
    backgroundColor: grey[100],
    paddingTop: 8,
    height: '100%',
    marginBottom: '4rem'
  },
  likeBox: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'hidden',
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
    width: 800,
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
  const [showEditFields, setShowEditFields] = useState(false)
  const [editedQuestionTitle, setEditedQuestionTitle] = useState(null)
  const [editedQuestionContent, setEditedQuestionContent] = useState(null)
  const [editedQuestionTags, setEditedQuestionTags] = useState(null)
  const [editedQuestionTitleHelperText, setEditedQuestionTitleHelperText] = useState('')
  const [editedQuestionContentHelperText, setEditedQuestionContentHelperText] = useState('')
  const [editedQuestionTagsHelperText, setEditedQuestionTagsHelperText] = useState('')

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
        setErrorMessage('error: cannot connect to the server')
      } else {
        setQuestion(question)
        if (editedQuestionTitle === null) { // if this is the first time loading the page
          setEditedQuestionTitle(question.title)
        }

        if (editedQuestionContent === null) {
          setEditedQuestionContent(question.content)
        }

        if (editedQuestionTags === null) {
          setEditedQuestionTags(question.tags.join(', '))
        }
      }
    }
    getQuestion()
  }, [showEditFields, editedQuestionTitle, editedQuestionContent, editedQuestionTags])

  const handleCommentPost = async (event) => {
    if (commentContent.length === 0) {
      setErrorMessage('comment must not be empty')
    } else {
      const comment = {
        content: commentContent,
        postedBy: user,
      }

      const newComment = await questionService.addComment(id, comment)
      if (!newComment || newComment.error) {
        setErrorMessage('error: couldn\'t add a new comment, try again later')
      } else {
        setQuestion({
          ...question,
          comments: question.comments.concat({
            ...comment,
            id: newComment.data.id,
            likes: [],
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

  const handleUpvoteQuestion = async () => {
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

  const handleDownvoteQuestion = async () => {
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
        const userLikes = comment.likes.filter(like => like.likedBy == user.id)
        if (userLikes.length > 0) { // user already downvoted
          value = 2
        }
      }

      console.log(question.comments)
      // update the comments array
      const newComments = question.comments
      newComments.forEach(questionComment => {
        if (questionComment.id == comment.id) {
          questionComment.likes.push({
            value: value,
            likedBy: user.id
          })
        }
      })

      setQuestion({
        ...question,
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
        const userLikes = comment.likes.filter(like => like.likedBy == user.id)
        if (userLikes.length > 0) { // user already upvoted
          value = -2
        }
      }

      // update the comments array
      const newComments = question.comments
      newComments.forEach(questionComment => {
        if (questionComment.id == comment.id) {
          questionComment.likes.push({
            value: value,
            likedBy: user.id
          })
        }
      })

      setQuestion({
        ...question,
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
      const newComments = question.comments.filter(comment => comment.id !== commentId)
      setQuestion({
        ...question,
        comments: newComments
      })
    } else {
      setErrorMessage('error: couldn\'t connect to the server')
    }
  }


  /**
   * returns the number of likes if likes array is not empty, zero otherwise
   * @param likeable, an object that has likes array
   * @return number
   * */
  const getLikes = (likeable) => {
    if (likeable && likeable.likes && likeable.likes.length > 0) {
      return likeable.likes.map(like => like.value)
        .reduce((a, b) => a + b)
    }
    return 0
  }

  const questionLikes = getLikes(question)

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
      title: editedQuestionTitle
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
      content: editedQuestionContent
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

    const tags = editedQuestionTags.split(',')
      .map(tag => tag.replace(/^\s+|\s+$/gm, ''))
      .filter(tag => tag.length > 0)

    const updatedQuestion = {
      title: editedQuestionTitle,
      content: editedQuestionContent,
      tags: tags
    }

    // validating only these two to allow empty tags, maybe refactor this later
    const { error } = schema.validate({
      title: editedQuestionTitle,
      content: editedQuestionContent,
    })

    if (error || editedQuestionTagsHelperText) {
      setErrorMessage('All fields are required, if a field is red, fix it')
    } else {
      const response = await questionService.updateQuestion(id, updatedQuestion)

      if (!response || response.error) {
        setErrorMessage("error: could not update the question")
      } else {
        setQuestion({
          ...question,
          title: updatedQuestion.title,
          content: updatedQuestion.content,
          tags: updatedQuestion.tags
        })
      }
    }
  }

  return (
    <div>
      <Notification message={errorMessage}/>
      <div className={classes.container}>
        <div className={classes.root} style={{
          paddingBottom: '3 rem'
        }}>
          <CssBaseline/>
          <Paper className={classes.paper} elevation={2} style={{
            marginBottom: 32,
            marginTop: 0
          }}>
            <Grid container justify='space-between' direction='column'>
              <Grid container justify='space-between'>
                {showEditFields ?
                  <TextField
                    helperText={editedQuestionTitleHelperText}
                    error={editedQuestionTitleHelperText.length > 0}
                    id="editedQuestionTitle"
                    label="Title"
                    variant="outlined"
                    value={editedQuestionTitle}
                    onChange={handleEditedTitle}
                    style={{
                      width: 560,
                      margin: 8
                    }}/>
                  :
                  <Grid container justify={'center'} direction={'column'} style={{
                    marginLeft: 20,
                    width: 600
                  }}>
                    <Typography variant="h5" align={'left'} style={{
                      width: 600,
                      overflowWrap: 'break-word',
                    }}>
                      {question.title}
                    </Typography>
                  </Grid>
                }
                <Grid item style={{
                  marginRight: 16,
                  marginTop: 8
                }}>
                  {validator.isAuthor(user, question) ?
                    <div edge="end" aria-label="icons">

                      {showEditFields &&
                      <IconButton onClick={handleQuestionUpdate}>
                        <CheckCircleOutlineIcon/>
                      </IconButton>}

                      <IconButton onClick={() => setShowEditFields(!showEditFields)}>
                        <EditIcon/>
                      </IconButton>

                      <IconButton onClick={handleDeleteQuestion}>
                        <DeleteIcon onClick={handleDeleteQuestion}/>
                      </IconButton>

                      <IconButton onClick={() => alert('share')}>
                        <ShareIcon/>
                      </IconButton>
                    </div>
                    : <IconButton onClick={() => alert('share')}>
                      <ShareIcon/>
                    </IconButton>
                  }
                </Grid>

              </Grid>
              <Divider style={{
                width: 760,
                margin: '0 auto',
                marginTop: 8,
                marginBottom: showEditFields ? 20 : 8
              }}/>
              <Grid container>
                <Grid container justify='center' direction='column' style={{
                  width: 40,
                  display: showEditFields ? 'none' : 'flex'
                }}>
                  <Box className={classes.likeBox} mr={2} id='likesBox' style={{
                    padding: 0,
                    margin: '0 auto',
                  }}>
                    <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                         className={classes.svg} onClick={handleUpvoteQuestion}>
                      <path
                        d="M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z"/>
                    </svg>
                    <Typography variant="body1" display='block' gutterBottom
                                className={classes.likes}>
                      {questionLikes}
                    </Typography>
                    <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                         className={classes.svg} onClick={handleDownvoteQuestion}>
                      <path
                        d="M14.496 5.975l-.001 14.287-6.366-6.367L6 16.021l10.003 10.004L26 16.029 23.871 13.9l-6.366 6.368V5.977z"/>
                    </svg>
                  </Box>
                </Grid>
                <Grid item style={{
                  marginRight: 8
                }}>
                  {showEditFields ?
                    <TextField
                      helperText={editedQuestionContentHelperText}
                      error={editedQuestionContentHelperText.length > 0}
                      id="editedQuestionContent"
                      label="Content"
                      variant="outlined"
                      value={editedQuestionContent}
                      multiline={true}
                      rows={3}
                      rowsMax={8}
                      fullWidth
                      onChange={handleEditedContent}
                      style={{
                        width: 740,
                        marginLeft: 8
                      }}
                    />
                    :
                    <Grid item>
                      <Typography
                        variant="body1"
                        className={classes.questionContent}
                        display='block'
                        paragraph={true}
                        key={question.content}
                        gutterBottom
                        align={'left'}
                        style={{
                          overflowWrap: 'break-word'
                        }}
                      >
                        {question.content}
                      </Typography>

                    </Grid>
                  }

                </Grid>

                <Grid item style={{
                  position: 'relative',
                  top: '50%',
                  marginRight: 16
                }}>

                </Grid>

              </Grid>

              <Grid item style={{
                position: 'relative',
                marginTop: 16
              }}>
                {showEditFields ?
                  <TextField
                    helperText={editedQuestionTagsHelperText}
                    error={editedQuestionTagsHelperText.length > 0}
                    id="editedQuestionTags"
                    label="Tags"
                    variant="outlined"
                    value={editedQuestionTags}
                    onChange={handleEditedTags}
                    style={{
                      width: 740,
                      margin: 8,
                      marginBottom: 26
                    }}/>
                  :
                  <ButtonGroup size="small" aria-label="small outlined button group" style={{
                    marginBottom: 6,
                    marginLeft: 18,
                  }}>
                    {question && question.tags && question.tags.map(tag => <Button key={tag}
                                                                                   style={{
                                                                                     maxHeight: '20px',
                                                                                     minWidth: '60px',
                                                                                     minHeight: '20px',
                                                                                     fontSize: 10,
                                                                                   }}>{tag}</Button>)}
                  </ButtonGroup>
                }

                <Typography variant='caption' style={{
                  color: 'grey',
                  marginRight: 8,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  marginBottom: 2,
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
                  <Paper className={classes.paper} key={comment.content + comment.likes} style={{
                    marginTop: 8
                  }}>
                    <Grid container justify='space-between' direction='column'>

                      <Grid container>
                        <ListItem key={comment.content} alignItems='center' disableGutters>
                          <Grid container justify='center' direction='column' style={{
                            width: 40,
                            height: '100%',
                            marginRight: 8,
                          }}>
                            <Box className={classes.likeBox} mr={2} id='likesBox' style={{
                              padding: 0,
                              margin: '0 auto',
                              float: 'top'
                            }}>
                              <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                                   className={classes.svg}
                                   onClick={() => handleUpvoteComment(comment)}>
                                <path
                                  d="M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z"/>
                              </svg>
                              <Typography variant="body1" display='block' gutterBottom
                                          className={classes.likes}>
                                {getLikes(comment)}
                              </Typography>
                              <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                                   className={classes.svg}
                                   onClick={() => handleDownvoteComment(comment)}>
                                <path
                                  d="M14.496 5.975l-.001 14.287-6.366-6.367L6 16.021l10.003 10.004L26 16.029 23.871 13.9l-6.366 6.368V5.977z"/>
                              </svg>
                            </Box>
                          </Grid>

                          <Grid item>
                            <Typography variant={'subtitle1'} style={{
                              width: 700
                            }}>
                              {comment.content}
                            </Typography>

                            {validator.isAuthor(user, comment) ? <ListItemSecondaryAction>
                              <IconButton edge="end" aria-label="delete"
                                          onClick={() => handleDeleteComment(comment.id)}>
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
                          marginBottom: 2,
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
          </Grid>
        </div>
        <Copyright/>
      </div>
    </div>
  )
}

export default Question
