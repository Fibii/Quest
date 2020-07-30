import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import { lightBlue } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import QuestLogo from './QuestLogo'

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    outline: 'none',
  },
  toolbar: {
    background: lightBlue[600],
  },
}))

const UnauthenticatedHeader = () => {
  const classes = useStyles()
  return (
    <div data-testid="header-container">
      <AppBar position="relative">
        <Toolbar className={classes.toolbar}>
          <QuestLogo />
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default UnauthenticatedHeader
