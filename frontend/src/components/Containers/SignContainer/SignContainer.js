import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { blue, lightBlue } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core'
import Notification from '../../Notification/Notification'
import VHContainer from '../VHContainer/VHContainer'

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 32,
    width: 400,
    [theme.breakpoints.down('md')]: {
      width: 300,
    },
    [theme.breakpoints.down('sm')]: {
      width: '74%',
      marginTop: 16,
      marginBottom: 16,
    },
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: lightBlue[800],
    borderLeft: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    [theme.breakpoints.down('md')]: {
      width: 400,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  image: {
    width: '80%',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '40%',
    },
  },
  smallScreenImage: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
}))

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
})

const SignContainer = ({
  errorMessage, children, image, title,
}) => {
  const classes = useStyles()
  return (
    <VHContainer>
      <Notification
        title="Error"
        message={errorMessage}
        severity="error"
        style={{
          width: '70%',
          margin: '0 auto',
          marginTop: 16,
          marginBottom: 16,
        }}
      />
      <Grid
        container
        direction="row"
        justify="center"
      >
        <Grid className={classes.imageContainer}>
          <img src={image} className={classes.image} alt={image} />
        </Grid>
        <Paper className={classes.paper} elevation={2}>
          <Grid
            item
            className={classes.smallScreenImage}
          >
            <img src={image} className={classes.image} alt={image} />
          </Grid>
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          <ThemeProvider theme={theme}>
            { children }
          </ThemeProvider>
        </Paper>
      </Grid>
    </VHContainer>
  )
}

export default SignContainer
