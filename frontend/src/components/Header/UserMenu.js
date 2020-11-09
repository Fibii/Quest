import React, { useContext } from 'react'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import UserContext from '../UserContext/UserContext'
import config from '../../config'

const useStyles = makeStyles(() => ({
  userMenu: {
    display: 'flex',
  },
}))

const UserMenu = ({ state, dispatch }) => {
  const classes = useStyles()
  const [user, setUser] = useContext(UserContext)
  const { anchorEl } = state
  const history = useHistory()
  const { urls } = config

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('qa_userLoggedIn')
    window.sessionStorage.removeItem('qa_user')
  }

  const isMenuOpen = Boolean(anchorEl)
  const handleProfileMenuOpen = (event) => {
    dispatch({ type: 'SET_ANCHOREL', anchorEl: event.currentTarget })
  }

  const handleMenuClose = () => {
    dispatch({ type: 'SET_ANCHOREL', anchorEl: null })
  }

  const handleLogoutClick = () => {
    handleLogout()
    handleMenuClose()
  }

  const handleProfileMenu = () => {
    history.push(`${urls.user}/${user.id}`)
    handleMenuClose()
  }

  const menuId = 'primary-search-account-menu'
  return (
    <div className={classes.userMenu}>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
        data-testid="avatarDesktop-button"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfileMenu}>
          <Typography variant="body1">
            Profile
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogoutClick} data-testid="logoutHeader-button">
          <Typography variant="body1">
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default UserMenu
