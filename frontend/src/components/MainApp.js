import React, { useEffect, useState } from 'react'
import UserContext from './UserContext'
import { Route, Switch } from 'react-router-dom'

import Header from './Header'
import Welcome from './Welcome'
import SignIn from './SignInForm'
import SignupForm from './SignupForm'
import NewQuestionForm from './NewQuestionForm'
import Question from './Question'
import Questions from './Questions'

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
        <Route path='/register' component={SignupForm}/>
        <Route path='/question/new' exact render={() => <NewQuestionForm/>}/>
        <Route path='/question/:id' exact render={() => <Question/>}/>
      </Switch>
    </UserContext.Provider>
  )
}

export default MainApp
