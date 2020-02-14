import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Copyright from './Copyrights'
import Notification from './Notification'
import { useHistory } from 'react-router-dom'
import userService from '../services/users'

import validator from '../services/validator'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

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

  const history = useHistory()


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
    if (!validator.signupFormValidator({ username: username })) {
      setUserNameHelperText('only alphanumerics are allowed\nlength must be between 3 and 32')
    } else {
      setUserNameHelperText('')
    }
  }

  const emailOnChange = (event) => {
    const email = event.target.value
    setEmail(email)
    if (!validator.signupFormValidator({ email: email })) {
      setEmailHelperText('invalid email')
    } else {
      setEmailHelperText('')
    }
  }

  const passwordOnChange = (event) => {
    const password = event.target.value
    setPassword(password)
    if (!validator.signupFormValidator({ password: password })) {
      setPasswordHelperText('must be between 8 to 32 characters long, must include one lowercase letter, one uppercase letter and no spaces')
    } else {
      setPasswordHelperText('')
    }
  }

  const dateOfBirthOnChange = (event) => {
    const dateOfBirth = event.target.value
    setDateOfBirth(dateOfBirth)
    if (!validator.signupFormValidator({ dateOfBirth: dateOfBirth })) {
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
      username: username,
      password: password,
      email: email,
      dateOfBirth: new Date(dateOfBirth)
    }

    if (!validator.signupFormValidator(user)) {
      setErrorMessage('All fields are required, if a field is red, then fix it, make sure dob is valid')
    } else {

      const newUser = await userService.createUser(user)
      if (!newUser || newUser.error) {
        setErrorMessage('error: couldn\'t connect to the server')
      } else {
        history.push('/login')
      }
    }
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh'
    }}>
      <Notification title={'Error'} message={errorMessage} severity={'error'}/>
      <Container component="main" maxWidth="xs" style={{
        paddingBottom: '3 rem'
      }}>
        <CssBaseline/>
        <div className={classes.paper}>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <form className={classes.form} noValidate onSubmit={formOnSubmitHandler}>

            <Grid container spacing={2}>

              <Grid item xs={12} sm={6}>
                <TextField
                  error={fullNameHelperText.length > 0}
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
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  error={usernameHelperText.length > 0}
                  helperText={usernameHelperText}
                  onChange={userNameOnChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={emailHelperText.length > 0}
                  helperText={emailHelperText}
                  onChange={emailOnChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={passwordHelperText.length > 0}
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
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={dateOfBirthHelperText.length > 0}
                  helperText={dateOfBirthHelperText}
                  onChange={dateOfBirthOnChange}
                  variant="outlined"
                  id="dateOfBirth"
                  label="Birthday"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>

            <Grid container justify="flex-end">
              <Grid item>
                <Link variant="body2" onClick={() => history.push('/login')}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>

          </form>
        </div>
      </Container>
      <Copyright/>
    </div>

  )

}
export default SignupForm
