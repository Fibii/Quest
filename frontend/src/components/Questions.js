import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import DeleteIcon from '@material-ui/icons/Delete'
import Copyright from './Copyrights'
import Notification from './Notification'
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown'

import questionService from '../services/questions'
import validator from '../services/validator'
import userService from '../services/users'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 24,
    position: 'relative',
    minHeight: '100vh'
  },
  gridList: {
    width: 500,
    height: 450,
  },

  welcome: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  paper: {
    prefWidth: 800,
    margin: 2,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 4
  },
}))

/**
 * returns a list of questions
 *
 * @see validator
 * */
const Questions = ({ user }) => {
  const classes = useStyles()
  const [dense, setDense] = useState(false)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await questionService.getAll()
      if (!questions) {
        setError(true)
      } else {
        setQuestions(questions)
      }
    }
    getQuestions()


  }, [])

  if (error) {
    return (
      <Notification message={'error: cannot connect to the server'}/>
    )
  }

  /**
   * deletes a question form the database
   * @param int: the id of the question to be deleted
   * */
  const handleDeleteQuestion = async (id) => {
    const response = await questionService.deleteQuestion(id)
    if (response) {
      const newQuestion = questions.filter(question => question.id !== id)
      setQuestions(newQuestion)
    } else {
      setErrorMessage('error: couldn\'t delete the question')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  return (
    <div>
      <Notification message={errorMessage}/>
      <div className={classes.root}>
        <Grid item xs={12} md={6} style={{
          paddingBottom: '3 rem'
        }}>
          <Typography variant="h6" className={classes.title}>
          </Typography>
          <div>
            <List dense={dense}>
              {questions.map(question =>
                <Paper elevation={4} className={classes.paper} key={question.title}>
                  <Grid container>

                    <Grid container justify='center' direction='column' style={{
                      width: 60,
                    }}>
                      <Grid container justify='center' direction='column'>
                        <Box style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          overflow: 'hidden',
                          paddingTop: 8,
                          height: '100%',
                          marginBottom: '4rem',
                          padding: 0,
                          margin: '0 auto',
                        }}>
                          <Typography variant='h6'>
                            {question.likes.length === 0 ? 0 :
                              question.likes.map(like => like.value)
                                .reduce((a, b) => a + b)}
                          </Typography>
                          <ThumbsUpDownIcon style={{
                            fontSize: 16,
                            marginTop: 4,
                            marginLeft: 8,
                            color: 'grey',
                          }}/>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid item xs={10}>
                      <ListItemText
                        primary={
                          <Link
                            to={`/question/${question.id}`} style={{
                            textDecoration: 'none',
                          }}>
                            <Typography variant='h6' style={{
                              overflowWrap: 'break-word'
                            }}>
                              {question.title}
                            </Typography>
                          </Link>
                        }
                        secondary={question.content.length > 60 ? question.content.substr(0, 60)
                          .concat('...') : question.content}
                        display='block'
                        key={question.content}
                        style={{
                          overflowWrap: 'break-word'
                        }}
                      />
                    </Grid>

                    <Grid item>
                      {validator.isAuthor(user, question) ?
                        <IconButton edge="end" aria-label="delete"
                                    onClick={() => handleDeleteQuestion(question.id)}>
                          <DeleteIcon/>
                        </IconButton>
                        : null}
                    </Grid>
                  </Grid>
                </Paper>
              )
              }
            </List>
          </div>
        </Grid>
        <Copyright/>
      </div>
    </div>

  )
}


export default Questions
