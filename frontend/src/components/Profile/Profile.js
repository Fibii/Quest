import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { useParams, Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { LocationOn } from '@material-ui/icons'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Notification from '../Notification/Notification'
import users from '../../services/users'
import utils from '../../services/utils'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import config from '../../config'

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    height: '100%',
  },
  container: {
    width: '60%',
    [theme.breakpoints.up('xs')]: {
      width: '90%',
    },
    marginTop: 32,
  },
  questionList: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  fullname: {
    fontSize: '3rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem',
    },
  },
  username: {
    fontSize: '2rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
    },
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    outline: 'none',
  },
  date: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
}))

const Profile = () => {
  const { id } = useParams()
  const [user, setUser] = useState({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const classes = useStyles()
  const { urls } = config

  useEffect(() => {
    const getUser = async () => {
      const user = await users.getUser(id)
      if (user) {
        setUser(user)
        setIsLoading(false)
      } else {
        setError('Couldn\'t get this user')
      }
      setIsLoading(false)
    }
    getUser()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <Notification severity="error" title="Error" message={error} />
    )
  }

  return (
    <Grid container justify="center" data-testid="profile-container" className={classes.mainContainer}>
      <Grid container direction="column" alignItems="center" className={classes.container}>
        <Typography className={classes.fullname} data-testid="fullname">{user.fullname}</Typography>
        <Typography className={classes.username} data-testid="username">
          @(
          {user.username}
          )
        </Typography>
        <Typography variant="h6" data-testid="location">
          {user.location
          && (
            <IconButton>
              <LocationOn />
              {user.location}
            </IconButton>
          )}
        </Typography>
        <Grid container direction="row" justify="space-between">
          <Typography className={classes.date} data-testid="Joined">
            Joined:
            {utils.formatDate(user.registerDate)}
          </Typography>
          <Typography className={classes.date} data-testid="lastSignedInDate">
            Last
            Seen:
            {utils.formatDate(user.lastSignedInDate)}
          </Typography>
        </Grid>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={(
            <ListSubheader component="div" id="nested-list-subheader">
              Posted Questions (
              {user.questions && user.questions.length}
              ):
            </ListSubheader>
          )}
          className={classes.questionList}
        >
          {user.questions && user.questions.map((question) => (
            <Link to={`${urls.question}/${question.id}`} className={classes.link} key={question.id}>
              <ListItem button>
                <ListItemText
                  primary={question.title}
                  data-testid="question"
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </Grid>
    </Grid>
  )
}

export default Profile
