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
import Notification from './Notification'
import users from '../services/users'


const useStyles = makeStyles((theme) => ({
  container: {
    width: '60%',
    [theme.breakpoints.up('xs')]: {
      width: '90%',
    },

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
  const classes = useStyles()

  useEffect(() => {
    const getUser = async () => {
      const user = await users.getUser(id)
      if (user) {
        setUser(user)
      } else {
        setError('Couldn\'t get this user')
      }
    }
    getUser()
  }, [])

  if (error) {
    return <Notification severity="error" title="Error" message={error} />
  }

  const formateDate = (date) => {
    const dateObj = new Date(date)
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`
  }
  return (
    <Grid container justify="center">
      <Grid container direction="column" alignItems="center" className={classes.container}>
        <Typography className={classes.fullname}>{user.fullname}</Typography>
        <Typography className={classes.username}>
          @(
          {user.username}
          )
        </Typography>
        <Typography variant="h6">
          {user.location
          && (
            <IconButton>
              <LocationOn />
              {user.location}
            </IconButton>
          )}
        </Typography>
        <Grid container direction="row" justify="space-between">
          <Typography className={classes.date}>
            Joined:
            {formateDate(user.registerDate)}
          </Typography>
          <Typography className={classes.date}>
            Last
            Seen:
            {formateDate(user.lastSignedInDate)}
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
            <ListItem button key={question.id}>
              <Link to={`/question/${question.id}`} className={classes.link}>
                <ListItemText
                  primary={question.title}
                />
              </Link>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  )
}

export default Profile
