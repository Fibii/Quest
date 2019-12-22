import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import SignUpForm from './components/signupForm'
import SignIn from './components/signInForm'
import MainApp from './components/questions'

const App = () => {
  return (
    <BrowserRouter>
      <MainApp />

    </BrowserRouter>
  )
}

export default App
