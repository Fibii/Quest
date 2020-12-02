import React, { useContext, useReducer } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { lightBlue } from '@material-ui/core/colors'
import UserContext from '../UserContext/UserContext'
import SearchBar from '../SearchBar/SearchBar'
import Sidebar from './Sidebar'
import { headerReducer, initialState } from '../../reducers/HeaderReducer'
import UnauthenticatedHeader from './UnautheticatedHeader'
import QuestLogo from './QuestLogo'
import UserMenu from './UserMenu'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
  },
  toolbar: {
    background: lightBlue[600],
  },
}))

const Header = () => {
  const classes = useStyles()
  const [user] = useContext(UserContext)
  const [state, dispatch] = useReducer(headerReducer, initialState)

  if (!user) {
    return <UnauthenticatedHeader />
  }

  const handleDrawerOpen = () => {
    dispatch({ type: 'OPEN_DRAWER' })
  }

  return (
    <div data-testid="header-container">
      <AppBar position="relative">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={() => handleDrawerOpen()}
            data-testid="open-drawer"
          >
            <MenuIcon />
          </IconButton>
          <QuestLogo />
          <SearchBar />
          <div className={classes.grow} />
          <UserMenu state={state} dispatch={dispatch} />
        </Toolbar>
      </AppBar>
      <Sidebar state={state} dispatch={dispatch} />
    </div>
  )
}

export default Header
