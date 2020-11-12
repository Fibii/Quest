import React, { useContext, useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { lightBlue } from '@material-ui/core/colors'
import userService from '../../services/users'

import validator from '../../services/validator'
import SignContainer from '../Containers/SignContainer/SignContainer'
import loginImg from '../../resources/images/login.png'
import QLink from '../QLink/QLink'
import UserContext from '../UserContext/UserContext'
import Notification from '../Notification/Notification'
import config from '../../config'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const SignUpButton = withStyles({
  root: {
    backgroundColor: lightBlue[700],
    border: '1px solid',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: lightBlue[800],
      boxShadow: 'none',
    },
  },
})(Button)

const SignupForm = () => {
  const classes = useStyles()

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState(null)
  const [fullNameHelperText, setFullNameHelperText] = useState('')
  const [usernameHelperText, setUserNameHelperText] = useState('')
  const [emailHelperText, setEmailHelperText] = useState('')
  const [passwordHelperText, setPasswordHelperText] = useState('')
  const [dateOfBirthHelperText, setDateOfBirthHelperText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [user] = useContext(UserContext)
  const history = useHistory()
  const { urls } = config

  if (user) {
    setTimeout(() => history.push(urls.root), 5000)
    return (
      <Notification
        title="Already logged in"
        message="You're already logged in, you'll be redirected to the homepage in 5 seconds"
        severity="info"
      />
    )
  }

  const fullNameOnChange = (event) => {
    const fullName = event.target.value
    setFullName(fullName)
    if (!validator.signupFormValidator({ fullname: fullName })) {
      setFullNameHelperText('only characters are allowed\nlength must be between 3 and 32')
    } else {
      setFullNameHelperText('')
    }
  }

  const userNameOnChange = (event) => {
    const username = event.target.value
    setUsername(username)
    if (!validator.signupFormValidator({ username })) {
      setUserNameHelperText('only alphanumerics are allowed\nlength must be between 3 and 32')
    } else {
      setUserNameHelperText('')
    }
  }

  const emailOnChange = (event) => {
    const email = event.target.value
    setEmail(email)
    if (!validator.signupFormValidator({ email })) {
      setEmailHelperText('invalid email')
    } else {
      setEmailHelperText('')
    }
  }

  const passwordOnChange = (event) => {
    const password = event.target.value
    setPassword(password)
    if (!validator.signupFormValidator({ password })) {
      setPasswordHelperText('must be between 8 to 32 characters long, must include one lowercase letter, one uppercase letter and no spaces')
    } else {
      setPasswordHelperText('')
    }
  }

  const dateOfBirthOnChange = (event) => {
    const dateOfBirth = event.target.value
    setDateOfBirth(dateOfBirth)
    if (!validator.signupFormValidator({ dateOfBirth })) {
      setDateOfBirthHelperText('Birthday must be between 1900 and 2018')
    } else {
      setDateOfBirthHelperText('')
    }
  }

  /**
   * Adds a new user to the database, and validates the input, if filed is wrong, nothing is added
   * and an error message is shown
   *
   * @param event: react form event
   * @see userService
   * */
  const formOnSubmitHandler = async (event) => {
    event.preventDefault()

    const user = {
      fullname: fullName,
      username,
      password,
      email,
      dateOfBirth: new Date(dateOfBirth),
    }

    if (!validator.signupFormValidator(user)) {
      setErrorMessage('All fields are required, if a field is red, then fix it, make sure dob is valid')
    } else {
      const newUser = await userService.createUser(user)
      if (!newUser || newUser.error) {
        setErrorMessage(newUser.error)
        setTimeout(() => setErrorMessage(''), 5000)
      } else {
        history.push(urls.login)
      }
    }
  }

  return (
    <SignContainer errorMessage={errorMessage} image={loginImg} title="Sign up">
      <form className={classes.form} noValidate onSubmit={formOnSubmitHandler}>
        <TextField
          error={fullNameHelperText.length > 0}
          margin="dense"
          helperText={fullNameHelperText}
          autoComplete="fname"
          name="fullName"
          variant="outlined"
          required
          fullWidth
          id="fullName"
          label="Full Name"
          autoFocus
          onChange={fullNameOnChange}
          inputProps={{
            'data-testid': 'fullname-input',
          }}
        />

        <TextField
          error={usernameHelperText.length > 0}
          margin="dense"
          helperText={usernameHelperText}
          onChange={userNameOnChange}
          variant="outlined"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          inputProps={{
            'data-testid': 'username-input',
          }}
        />

        <TextField
          error={emailHelperText.length > 0}
          margin="dense"
          helperText={emailHelperText}
          onChange={emailOnChange}
          variant="outlined"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          inputProps={{
            'data-testid': 'email-input',
          }}
        />

        <TextField
          error={passwordHelperText.length > 0}
          margin="dense"
          helperText={passwordHelperText}
          onChange={passwordOnChange}
          variant="outlined"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          inputProps={{
            'data-testid': 'password-input',
          }}
        />

        <TextField
          error={dateOfBirthHelperText.length > 0}
          margin="dense"
          helperText={dateOfBirthHelperText}
          onChange={dateOfBirthOnChange}
          variant="outlined"
          id="dateOfBirth"
          label="Birthday"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            'data-testid': 'dateOfBirth-input',
          }}
        />

        <SignUpButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          data-testid="submit-button"
        >
          Sign Up
        </SignUpButton>

        <Grid container justify="flex-end">
          <Grid item>
            <QLink to={urls.login} testId="login-link">
              Already have an account? Sign in
            </QLink>
          </Grid>
        </Grid>

      </form>

    </SignContainer>
  )
}
export default SignupForm
