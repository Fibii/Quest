import React, { useState } from 'react'
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
import UserContext from './userContext'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 24
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
        likes: 1
      },
      {
        content: 'second comment',
        likes: 2
      },
    ]
  },
  {
    title: 'How to un-commit last un-pushed git commit without losing the changes',
    content: ' there a way to revert a commit so that my local copy keeps the changes made in that commit, but they become non-committed changes in my working copy?',
    tags: ['git'],
    likes: 123,
    id: 2
  },
]


const InteractiveList = ({ user }) => {
  const classes = useStyles()
  const [dense, setDense] = useState(false)

  return (

    <div className={classes.root}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes.title}>
        </Typography>
        <div>
          <List dense={dense}>
            {initialQuestion.map(question =>
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
                    {user ?
                      <IconButton edge="end" aria-label="delete"
                                  onClick={() => alert('delete this question')}>
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

  return (
    <UserContext.Provider value={user}>
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
        <Route path='/question/:id' render={() => <Question/>}/>
      </Switch>
    </UserContext.Provider>
  )
}

export default MainApp
