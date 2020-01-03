import React, { useEffect, useState } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import DeleteIcon from '@material-ui/icons/Delete'
import Copyright from './copyrights'
import SignIn from './signInForm'
import SignUpForm from './signupForm'
import Question from './question'
import QuestionForm from './questionForm'
import UserContext from './userContext'
import questionService from '../services/questions'
import Notification from './notification'
import userService from '../services/users'
import Header from './header'
import validator from '../services/validator'

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
const InteractiveList = ({ user }) => {
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
                      <Box style={{
                        padding: 0,
                        margin: '0 auto',
                      }}>
                        <Typography variant='h6'>
                          {question.likes}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={10}>
                      <ListItemText
                        primary={
                          <Link
                            to={`/question/${question.id}`} style={{
                            textDecoration: 'none',
                          }}>
                            <Typography variant='h6'>
                              {question.title}
                            </Typography>
                          </Link>
                        }
                        secondary={question.content.length > 100 ? question.content.substr(0, 100)
                          .concat('...') : question.content}
                        display='block'
                        key={question.content}
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

const Welcome = () => {

  return (
    <div>

      <Typography>
        It looks like you're not logged in, to view the main app, either
      </Typography>

      <Link to={'/login'}>
        Login
      </Link>

      <Typography>
        or
      </Typography>

      <Link to={'/register'}>
        Sign Up
      </Link>
    </div>
  )
}
const MainApp = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('qa_userLoggedIn')
    if (loggedUser) {
      setUser(loggedUser)
      questionService.setToken(loggedUser.token)
      userService.setToken(loggedUser.token)
    }
  }, [])
  return (
    <UserContext.Provider value={user}>
      <Header/>
      <Switch>
        <Route exact path="/" render={() => (
          user ? (
            <InteractiveList user={user}/>
          ) : (
            <Welcome/>
          )
        )}/>
        <Route path='/welcome' render={() => <Welcome/>}/>
        <Route path='/login' render={() => <SignIn setUser={setUser}/>}/>
        <Route path='/register' component={SignUpForm}/>
        <Route path='/question/new' exact render={() => <QuestionForm/>}/>
        <Route path='/question/:id' exact render={() => <Question/>}/>
      </Switch>
    </UserContext.Provider>
  )
}

export default MainApp
