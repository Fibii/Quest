import React, { useState } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Copyright from './copyrights'
import Header from './header'
import userService from '../services/users'
import Notification from './notification'
import questionService from '../services/questions'

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const SignIn = ({ setUser }) => {
  const classes = useStyles()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [rememberUser, setRememberUser] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const formHandler = async (event) => {
    event.preventDefault()
    const user = await userService.login({
      username: username,
      password: password
    })
    if (!user || user.error) {
      setErrorMessage('error, incorrect username or password')
      setTimeout(() => setErrorMessage(''), 5000)
    } else {
      setUser(user)
      setRedirect(true)
      questionService.setToken(user.token)
      userService.setToken(user.token)

      if (rememberUser) {
        window.localStorage.setItem('qa_userLoggedIn', JSON.stringify(user))
      }
    }
  }

  return (
    <div>
      <Notification message={errorMessage}/>
      <div style={{
        position: 'relative',
        minHeight: '80vh'
      }}>
        <Container component="main" maxWidth="xs" style={{
          paddingBottom: '3 rem'
        }}>
          <CssBaseline/>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
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
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary"/>}
                label="Remember me"
                onChange={() => setRememberUser(!rememberUser)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {'Don\'t have an account? Sign Up'}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Switch>
            <Route exact path="/login" render={() => (
              redirect ? (
                <Redirect to="/"/>
              ) : (
                ''
              )
            )}/>
          </Switch>
        </Container>
        <Copyright/>
      </div>

    </div>
  )
}

export default SignIn
