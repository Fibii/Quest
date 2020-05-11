import React from 'react'
import { useHistory } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import grey from '@material-ui/core/colors/grey'
import Copyright from './Copyrights'

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  buttons: {
    backgroundColor: grey[600],
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}))

const Welcome = () => {
  const classes = useStyles()
  const history = useHistory()
  return (
    <div className={classes.heroContent} data-testid="welcome">
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          gutterBottom
          style={{
            color: grey[800],
          }}
        >
          Welcome to QA
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Question Answer webapp, made using react for the frontend and expressjs for the backend,
          alongside mongodb as a database choice, or we can just say made using mern stack :)
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary">
          * you must be logged in to see how the app works, either *
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.buttons}
                onClick={() => history.push('/register')}
              >
                SignUp
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" onClick={() => history.push('/login')}>
                Login
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
      <Copyright />
    </div>
  )
}

export default Welcome
