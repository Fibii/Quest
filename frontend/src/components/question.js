import React, { useContext, useState } from 'react'
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

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    prefWidth: 800,
    height: 400,
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

const initialQuestion = [
  {
    title: 'is this a valid proof?',
    content: 'prove that for all x < x^3 => x^2 < x^4\nmy solution is: (x < x^3 ) * x QED',
    tags: ['proof', 'analysis'],
    likes: 10,
    id: 1,
    comments: [
      {
        content: 'first comment',
        likes: 1,
        postedBy: 'fibi'
      },
      {
        content: 'second comment',
        likes: 2,
        postedBy: 'fibbba'
      },
    ],
    postedBy: 'fibi'
  },
  {
    title: 'How to un-commit last un-pushed git commit without losing the changes',
    content: ' there a way to revert a commit so that my local copy keeps the changes made in that commit, but they become non-committed changes in my working copy?',
    tags: ['git'],
    likes: 123,
    id: 2,
    comments: [
      {
        content: 'first comment',
        likes: 1,
        postedBy: 'fibi'
      },
      {
        content: 'second comment',
        likes: 2,
        postedBy: 'fibbba'
      },
    ],
    postedBy: 'fibi'
  },
]

const Question = () => {

  const classes = useStyles()
  const [dense, setDense] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const { id } = useParams()
  // get json from id and show it
  const question = initialQuestion.filter(question => question.id == id)[0]
  const user = useContext(UserContext)

  const handleCommentPost = (event) => {
    // validate content
    alert(commentContent)
  }

  return (
    <div className={classes.container}>
      <div className={classes.root}>
        <CssBaseline/>
        <Paper className={classes.paper} elevation={14} style={{
          marginBottom: 16
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
                       className={classes.svg} onClick={() => alert('upvote')}>
                    <path
                      d="M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z"/>
                  </svg>
                  <Typography variant="body1" display='block' gutterBottom
                              className={classes.likes}>
                    {question.likes}
                  </Typography>
                  <svg height='24' width='24' viewBox="0 0 32 32" aria-hidden="true"
                       className={classes.svg} onClick={() => alert('downvote')}>
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
                {user ?
                  <IconButton edge="end" aria-label="delete" onClick={() => alert('delete this')}>
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
                {question.tags.map(tag => <Button key={tag} style={{
                  maxWidth: '60px',
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
                posted by: {question.postedBy}
              </Typography>
            </Grid>

          </Grid>
        </Paper>
        <Grid container justify='center' direction='column'>
          <Grid item>
            <List dense={dense} className={classes.gridList}>
              {question.comments.map(comment =>
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
                                   className={classes.svg} onClick={() => alert('upvote')}>
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

                          {user ? <ListItemSecondaryAction>
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
                        posted by: {comment.postedBy}
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
  )
}

export default Question
