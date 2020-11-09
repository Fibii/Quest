import React from 'react'
import { useHistory } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { lightBlue } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import questions from '../../resources/images/questions.png'
import VHContainer from '../Containers/VHContainer/VHContainer'
import HVContainer from '../Containers/HVContainer/HVContainer'
import config from '../../config'

const useStyles = makeStyles((theme) => ({
  typographyContainer: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '60%',
    },
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-end',
    },
  },
  firstHeader: {
    fontFamily: 'Volkhov',
    fontSize: '42px',
    [theme.breakpoints.down('lg')]: {
      fontSize: '32px',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '28px',
    },
  },
  secondHeader: {
    fontFamily: 'Volkhov',
    fontSize: '48px',
    [theme.breakpoints.down('lg')]: {
      fontSize: '38px',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '34px',
    },
  },
  body: {
    fontFamily: 'Alegreya Sans',
    fontSize: '32px',
    [theme.breakpoints.down('lg')]: {
      fontSize: '22px',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '18px',
    },
  },
  imageContainer: {
    width: '60%',
    display: 'flex',
    alignItems: 'flex-end',
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 8,
      width: '100%',
    },
  },
  buttonsContainer: {
    marginTop: 12,
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
    },
  },
}))

const SignInButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#ffffff',
    border: '1px solid',
    boxShadow: 'none',
    marginRight: 12,
    width: 140,
    height: 50,
    fontSize: '14px',
    '&:hover': {
      backgroundColor: '#ebebeb',
      boxShadow: 'none',
    },
    [theme.breakpoints.down('md')]: {
      width: 100,
    },
    [theme.breakpoints.down('sm')]: {
      width: 80,
      height: 40,
      fontSize: '12px',
    },
  },
}))(Button)

const SignUpButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#f9c138',
    border: '1px solid',
    boxShadow: 'none',
    width: 140,
    height: 50,
    fontSize: '14px',
    '&:hover': {
      backgroundColor: '#d69f37',
      boxShadow: 'none',
    },
    [theme.breakpoints.down('md')]: {
      width: 100,
    },
    [theme.breakpoints.down('sm')]: {
      width: 80,
      height: 40,
      fontSize: '12px',
    },
  },
}))(Button)

const DesktopView = () => {
  const history = useHistory()
  const classes = useStyles()
  const { urls } = config
  console.log(urls)
  return (
    (
      <Grid container style={{ width: '70%', marginTop: '1rem' }}>
        <Grid container direction="row" justify="center" wrap="nowrap">
          <Grid item className={classes.typographyContainer}>
            <Grid container direction="column" justify="flex-end">
              <Typography className={classes.firstHeader}>Ask Question, Get</Typography>
              <Typography className={classes.secondHeader}>Answers</Typography>
              <Typography className={classes.body}>
                Quest is a question/answer webapp where users ask questions,
                and other users answer those questions
              </Typography>
              <Grid container direction="row" style={{ marginTop: 12 }}>
                <SignInButton
                  className={classes.button}
                  onClick={() => history.push(urls.login)}
                >
                  Sign In
                </SignInButton>
                <SignUpButton
                  className={classes.button}
                  onClick={() => history.push(urls.register)}
                >
                  Sign Up
                </SignUpButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.imageContainer}>
            <img src={questions} alt="Quest logo" style={{ width: '100%' }} />
          </Grid>
        </Grid>
      </Grid>
    )
  )
}
const Welcome = () => {
  const history = useHistory()
  const classes = useStyles()
  const isMobile = useMediaQuery('(max-width:700px)')
  const { urls } = config

  if (isMobile) {
    return (
      <HVContainer outerStyle={{ background: lightBlue[600] }}>
        <VHContainer>
          <Grid item style={{ width: '80%' }}>
            <Typography className={classes.firstHeader}>Ask Question, Get</Typography>
            <Typography className={classes.secondHeader}>Answers</Typography>
            <Typography className={classes.body}>
              Quest is a question/answer webapp where users ask questions,
              and other users answer those questions
            </Typography>
            <Grid item className={classes.imageContainer}>
              <img src={questions} alt="Quest logo" style={{ width: '100%' }} />
            </Grid>
            <Grid container direction="row" className={classes.buttonsContainer}>
              <SignInButton
                className={classes.button}
                onClick={() => history.push(urls.login)}
              >
                Sign In
              </SignInButton>
              <SignUpButton
                className={classes.button}
                onClick={() => history.push(urls.register)}
              >
                Sign Up
              </SignUpButton>
            </Grid>
          </Grid>
        </VHContainer>
      </HVContainer>
    )
  }

  return (
    <VHContainer outerStyle={{ background: lightBlue[600] }}>
      <DesktopView />
    </VHContainer>
  )
}

export default Welcome
