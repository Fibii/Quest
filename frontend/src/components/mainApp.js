import React, { useEffect, useState} from 'react'
import UserContext from './userContext'
import { Route, Switch, Link } from 'react-router-dom'

import Header from './header'
import Welcome from './welcome'
import SignIn from './signInForm'
import SignUpForm from './signupForm'
import QuestionForm from './questionForm'
import Question from './question'
import Questions from './questions'

import questionService from '../services/questions'
import userService from '../services/users'

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
    <UserContext.Provider value={[user, setUser]}>
      <Header/>
      <Switch>
        <Route exact path="/" render={() => (
          user ? (
            <Questions user={user}/>
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
