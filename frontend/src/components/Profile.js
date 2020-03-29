import React, { useState, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { useParams } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import users from '../services/users'
import Notification from './Notification'
import IconButton from '@material-ui/core/IconButton'
import { LocationOn } from '@material-ui/icons'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  container: {
    width: '60%',
  },
  questionList: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  }
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
        console.log('user', user)
        setUser(user)
      } else {
        setError('Couldn\'t get this user')
      }
    }
    getUser()
  }, [])

  if (error) {
    return <Notification severity={'error'} title={'Error'} message={error}/>
  }

  const formateDate = (date) => {
    const dateObj = new Date(date)
    return dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear()
  }
  return (
    <Grid container justify={'center'}>
      <Grid container direction={'column'} alignItems={'center'} className={classes.container}>
        <Typography>{user.fullname}</Typography>
        <Typography>@({user.username})</Typography>
        <Typography>{user.location &&
        <IconButton><LocationOn/>{user.location}</IconButton>}</Typography>
        <Grid container direction={'row'} justify={'space-between'}>
          <Typography>Joined: {formateDate(user.registerDate)}</Typography>
          <Typography>Last Seen: {formateDate(user.lastSignedInDate)}</Typography>
        </Grid>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Posted Questions ({user.questions && user.questions.length}):
            </ListSubheader>
          }
          className={classes.questionList}
        >
          {user.questions && user.questions.map(question => <ListItem button key={question.id}>
            <Link to={`/question/${question.id}`}><ListItemText primary={question.title}/></Link>
          </ListItem>)}
        </List>
      </Grid>
    </Grid>
  )
}

export default Profile
