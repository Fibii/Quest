import React, { useEffect, useState } from 'react'
import {
  Route, Switch, useLocation, useHistory,
} from 'react-router-dom'
import grey from '@material-ui/core/colors/grey'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import UserContext from '../UserContext/UserContext'

import Header from '../Header/Header'
import Welcome from '../Welcome/Welcome'
import SignIn from '../SignInForm/SignInForm'
import SignupForm from '../SignupForm/SignupForm'
import NewQuestionForm from '../NewQuestionForm/NewQuestionForm'
import Question from '../Question/Question'
import Questions from '../Questions/Questions'

import questionService from '../../services/questions'
import userService from '../../services/users'
import { setErrorMessage } from '../../actions/questionActions'
import Profile from '../Profile/Profile'
import Notification from '../Notification/Notification'
import Footer from '../Footer/Footer'

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: grey[100],
    minHeight: '100%',
  },
  content: {
    flex: '1 0 auto',
    marginTop: 32,
  },
  footer: {
    flexShrink: 0,
  },
}))

const MainApp = () => {
  const [user, setUser] = useState(null)
  const location = useLocation()
  const history = useHistory()
  const classes = useStyles()

  useEffect(() => {
    try {
      const loggedUser = JSON.parse(window.localStorage.getItem('qa_userLoggedIn'))
      if (loggedUser) {
        setUser(loggedUser)
        questionService.setToken(loggedUser.token)
        userService.setToken(loggedUser.token)
      }
    } catch (error) {
      setErrorMessage('error while loading the saved in user')
    }
  }, [])

  if (user) {
    if (location.pathname === '/login' || location.pathname === '/register') {
      setTimeout(() => history.push('/'), 5000)
      return (
        <Notification
          title="Already logged in"
          message="You're already logged in, you'll be redirected to the homepage in 5 seconds"
          severity="info"
        />
      )
    }
  }

  return (
    <Grid container direction="column" className={classes.container}>
      <UserContext.Provider value={[user, setUser]}>
        <Header />
        <Grid className={classes.content}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                user ? (
                  <Questions user={user} />
                ) : (
                  <Welcome />
                )
              )}
            />
            <Route path="/welcome" render={() => <Welcome />} />
            <Route path="/login" render={() => <SignIn setUser={setUser} />} />
            <Route path="/register" component={SignupForm} />
            <Route path="/question/new" exact render={() => <NewQuestionForm />} />
            <Route path="/question/:id" exact render={() => <Question />} />
            <Route path="/user/:id" exact render={() => <Profile />} />
          </Switch>
        </Grid>
      </UserContext.Provider>
      <Grid className={classes.footer}>
        <Footer />
      </Grid>
    </Grid>
  )
}

export default MainApp
