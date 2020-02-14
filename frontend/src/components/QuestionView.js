import React, { useState } from 'react'
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
import Copyright from './Copyrights'

import Notification from './Notification'
import Divider from '@material-ui/core/Divider'
import ShareIcon from '@material-ui/icons/Share'
import EditIcon from '@material-ui/icons/Edit'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import Snackbar from '@material-ui/core/Snackbar'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'

import validator from '../services/validator'
import questionActions from '../actions/questionAction'
import {
  setClipboardSnackbarOpen,
  setEditedQuestionContent,
  setEditedQuestionContentHelperText,
  setEditedQuestionTags,
  setEditedQuestionTagsHelperText,
  setEditedQuestionTitle,
  setEditedQuestionTitleHelperText
} from '../actions/questionActions'
import AlertWindow from './AlertWindow'


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

const QuestionView = ({ user, state, dispatch, handleDeleteQuestion, handleQuestionUpdate, handleDeleteComment, handleUpvoteQuestion, handleDownvoteQuestion, handleUpvoteComment, handleDownvoteComment, handleCommentPost }) => {
  const classes = useStyles()
  const [dense, setDense] = useState(false)
  const { question, editedQuestionTags, editedQuestionContent, editedQuestionTitle, errorMessage, showEditFields, clipboardSnackbarOpen, editedQuestionContentHelperText, editedQuestionTagsHelperText, editedQuestionTitleHelperText } = state
  const [openAlertWindow, setOpenAlertWindow] = useState(false)
  /**
   * wrappers for useState setter functions
   * */
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

  /**
   * Updates editedQuestionTitle to user input, validates the title
   * Updates editedTitleHelperText to an error message if validation fails, otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedTitle = (event) => {
    dispatch(setEditedQuestionTitle(event.target.value))
    dispatch(setEditedQuestionTitleHelperText(''))

    if (!validator.questionValidator({ title: state.editedQuestionTitle })) {
      dispatch(setEditedQuestionTitleHelperText('title must be 6 characters long at least and 64 at most'))
    }

  }

  /**
   * Updates editedQuestionContent to user input, validates the title
   * Updates editedQuestionContentHelperText to an error message if validation fails, otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedContent = (event) => {
    dispatch(setEditedQuestionContent(event.target.value))
    dispatch(setEditedQuestionContentHelperText(''))

    if (!validator.questionValidator({ content: state.editedQuestionContent })) {
      dispatch(setEditedQuestionContentHelperText('content must be at least 8 characters long'))
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
    dispatch(setEditedQuestionTags(tags))
    dispatch(setEditedQuestionTagsHelperText(''))

    if (!validator.questionValidator({ tags: tags })) {
      dispatch(setEditedQuestionTagsHelperText('tags must be words, separated by commas, such "hello, world"'))
    }
  }

  const handleClipboardSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(setClipboardSnackbarOpen(false))
  }

  const handleShareQuestion = () => {
    dispatch(setClipboardSnackbarOpen(true))
  }

  const questionLikes = getLikes(question)

  return (
    <div>
      <Notification title={'Error'} message={errorMessage} severity={'error'}/>
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

                      <IconButton onClick={() => setOpenAlertWindow(true)}>
                        <DeleteIcon/>
                      </IconButton>
                      <AlertWindow
                        title={'Confirm Deletion'}
                        content={'Are you sure you want to delete this question?'}
                        cancelButton={'NO'}
                        confirmButton={'YES'}
                        callback={() => handleDeleteQuestion(question.id)}
                        open={openAlertWindow}
                        setOpen={setOpenAlertWindow}/>

                      <CopyToClipboard text={window.location.href}>
                        <IconButton onClick={() => handleShareQuestion(question.id)}>
                          <ShareIcon/>
                        </IconButton>
                      </CopyToClipboard>
                    </div>
                    :
                    <CopyToClipboard text={window.location.href}>
                      <IconButton onClick={() => handleShareQuestion(question.id)}>
                        <ShareIcon/>
                      </IconButton>
                    </CopyToClipboard>
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
                         className={classes.svg} onClick={() => handleUpvoteQuestion(question.id)}>
                      <path
                        d="M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z"/>
                    </svg>
                    <Typography variant="body1" display='block' gutterBottom
                                className={classes.likes}>
                      {questionLikes}
                    </Typography>
                    <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                         className={classes.svg}
                         onClick={() => handleDownvoteQuestion(question.id)}>
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
                  (question && question.tags && question.tags.length > 0) &&
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
                  </ButtonGroup>}

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
                                          onClick={() => setOpenAlertWindow(true)}>
                                <DeleteIcon/>
                              </IconButton>
                            </ListItemSecondaryAction> : ''}
                            <AlertWindow
                              title={'Confirm Deletion'}
                              content={'Are you sure you want to delete this question?'}
                              cancelButton={'NO'}
                              confirmButton={'YES'}
                              callback={() => handleDeleteComment(comment.id)}
                              open={openAlertWindow}
                              setOpen={setOpenAlertWindow}/>
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
                    // todo: make a function for this, so that you clear the text when the comment is posted
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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={clipboardSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleClipboardSnackbar}
        message="copied to clipboards"
        color={grey[300]}
      />
    </div>
  )
}

export default QuestionView
