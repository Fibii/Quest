import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { lightBlue } from '@material-ui/core/colors'
import userService from '../../services/users'
import SignContainer from '../Containers/SignContainer/SignContainer'
import loginImg from '../../resources/images/login.png'
import QLink from '../QLink/QLink'
import UserContext from '../UserContext/UserContext'
import Notification from '../Notification/Notification'
import config from '../../config'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textDecoration: 'none',
    outline: 'none',
    '&:visited': {
      color: 'inherit',
    },
  },
}))

const SignInButton = withStyles({
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

const BlueCheckbox = withStyles({
  root: {
    color: lightBlue[800],
    '&$checked': {
      color: lightBlue[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />)

const SignIn = () => {
  const classes = useStyles()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberUser, setRememberUser] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useContext(UserContext)
  const { urls } = config

  const history = useHistory()

  if (user && user.id && history.action === 'POP') {
    setTimeout(() => history.push(urls.root), 5000)
    return (
      <Notification
        title="Already logged in"
        message="You're already logged in, you'll be redirected to the homepage in 5 seconds"
        severity="info"
        style={{ marginTop: 32 }}
      />
    )
  }

  const formHandler = async (event) => {
    event.preventDefault()
    if (username.length < 3 || password.length < 3) {
      setErrorMessage('username and password must have a minimum length of 3')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }
    const user = await userService.login({
      username,
      password,
      rememberMe: rememberUser,
    })
    if (!user || user.error) {
      setErrorMessage(user.error)
      setTimeout(() => setErrorMessage(''), 5000)
    } else {
      setUser(user)
      if (rememberUser) {
        window.localStorage.setItem('qa_userRememberMe', JSON.stringify(user))
      }
      window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(user))
      history.push(urls.root)
    }
  }

  return (
    <SignContainer errorMessage={errorMessage} image={loginImg} title="Sign in">
      <form className={classes.form} noValidate onSubmit={formHandler}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          onChange={(event) => setUsername(event.target.value)}
          inputProps={{
            'data-testid': 'username-input',
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          inputProps={{
            'data-testid': 'password-input',
          }}
        />
        <FormControlLabel
          control={<BlueCheckbox value="remember" color="primary" />}
          label="Remember me"
          onChange={() => setRememberUser(!rememberUser)}
        />
        <SignInButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          data-testid="submit-button"
        >
          Sign In
        </SignInButton>
        <Grid container>
          <Grid item xs>
            <QLink to={urls.root}>
              Forgot password?
            </QLink>
          </Grid>
          <Grid item>
            <QLink to={urls.register}>
              Don&apos;t have an account? Sign Up
            </QLink>
          </Grid>
        </Grid>
      </form>
    </SignContainer>
  )
}

export default SignIn
