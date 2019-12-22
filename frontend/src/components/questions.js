import React, { useState } from 'react'
import { Route, Switch,  Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

import FolderIcon from '@material-ui/icons/Folder'
import DeleteIcon from '@material-ui/icons/Delete'
import Copyright from './copyrights'
import SignIn from './signInForm'
import SignUpForm from './signupForm'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },

  welcome: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',

  }
}))


const initialQuestion = [
  {
    title: 'is this a valid proof?',
    content: 'prove that for all x < x^3 => x^2 < x^4\nmy solution is: (x < x^3 ) * x QED',
    tags: ['proof', 'analysis']
  },
  {
    title: 'How to un-commit last un-pushed git commit without losing the changes',
    content: ' there a way to revert a commit so that my local copy keeps the changes made in that commit, but they become non-committed changes in my working copy?',
    tags: ['git']
  },
]


const InteractiveList = ({user}) => {
  const classes = useStyles()
  const [dense, setDense] = useState(false)
  const [secondary, setSecondary] = React.useState(false)
  console.log(user)
  return (

    <div className={classes.root}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes.title}>
        </Typography>
        <div className={classes.demo}>
          <List dense={dense}>
            {initialQuestion.map(question =>
              <ListItem key={question.title}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={question.title}
                  secondary={question.content}
                />
                {user ? <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon/>
                  </IconButton>
                </ListItemSecondaryAction> : null}
              </ListItem>
            )
            }
          </List>
        </div>
      </Grid>
      <Copyright/>
    </div>
  )
}

const Welcome = ({setUser}) => {

  const { welcome } = useStyles()

  return (
    <div >

      <Typography>
        It looks like you're not logged in, to view the main app, either
      </Typography>

      <Link href="/login">
        Login
      </Link>

      <Typography>
        or
      </Typography>

      <Link href="/register" >
        Sign Up
      </Link>
    </div>
  )
}
const MainApp = () => {
  const [user, setUser] = useState(null)

  return (
  <Switch>
    <Route exact path="/" render={() => (
      user ? (
        <InteractiveList user={user}/>
      ) : (
        <Welcome />
      )
    )}/>
    <Route path='/welcome' component={Welcome} />
    <Route path='/login' render={() => <SignIn setUser={setUser} />} />
    <Route path='/register' component={SignUpForm} />
  </Switch>
  )
}
export default MainApp
