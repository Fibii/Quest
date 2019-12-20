import React, { useState } from 'react'
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
const Joi = require('@hapi/joi')

const Copyright = () => {
  return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="#">
          QA
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
  )
}

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
}));

const SignUpForm = () => {

    const classes = useStyles();

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


  const schema = Joi.object({
      fullName: Joi.string()
          .pattern(new RegExp('^[a-zA-Z ]*$'))
          .min(3)
          .max(32),
      username: Joi.string()
          .alphanum()
          .min(3)
          .max(32),
      email: Joi.string()
          .email( {tlds: false}),

      password: Joi.string()
          .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{8,32}$')),
      dateOfBirth: Joi.date()
          .less('2018-1-1')
          .greater('1900-1-1')

    }).or('fullName', 'username', 'password', 'email', 'dateOfBirth')

    const fullNameOnChange = (event) => {
      const fullName = event.target.value
      const { error } = schema.validate({
        fullName: fullName
      })
      setFullName(fullName)
      if (error) {
        setFullNameHelperText('only characters are allowed\nlength must be between 3 and 32')
      } else {
        setFullNameHelperText('')
      }
    }

    const userNameOnChange = (event) => {
      const username = event.target.value
      const { error } = schema.validate({
        username: username
      })
      setUsername(username)
      if (error) {
        setUserNameHelperText('only alphanumerics are allowed\nlength must be between 3 and 32')
      } else {
        setUserNameHelperText('')
      }
    }

  const emailOnChange = (event) => {
    const email = event.target.value
    const { error } = schema.validate({
      email: email
    })
    setEmail(email)
    if (error) {
      setEmailHelperText('invalid email')
    } else {
      setEmailHelperText('')
    }
  }

  const passwordOnChange = (event) => {
    const password = event.target.value
    const { error } = schema.validate({
      password: password
    })
    setPassword(password)
    if (error) {
      setPasswordHelperText('must be between 8 to 32 characters long, must include one lowercase letter, one uppercase letter and no spaces')
    } else {
      setPasswordHelperText('')
    }
  }

  const dateOfBirthOnChange = (event) => {
    const dateOfBirth = event.target.value
    const { error } = schema.validate({
      dateOfBirth: dateOfBirth
    })
    setDateOfBirth(dateOfBirth)
    if (error) {
      setDateOfBirthHelperText('Birthday must be between 1900 and 2018')
    } else {
      setDateOfBirthHelperText('')
    }
  }

  const formOnSubmitHandler = (event) => {
    event.preventDefault()
    const user = {
      fullname: fullName,
      username,
      password,
      email,
      dateOfBirth
    }
    console.log('should post')
    console.log(user)
  }


    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>

            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
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
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>

            </form>
          </div>

          <Box mt={5}>
            <Copyright />
          </Box>

        </Container>
    )

}
export default SignUpForm