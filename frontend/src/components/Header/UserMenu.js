import React, { useContext } from 'react'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import UserContext from '../UserContext/UserContext'

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    outline: 'none',
  },
  userMenu: {
    display: 'flex',
  },
}))

const UserMenu = ({ state, dispatch }) => {
  const classes = useStyles()
  const [user, setUser] = useContext(UserContext)
  const { anchorEl } = state

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('qa_userLoggedIn')
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
        <MenuItem onClick={handleMenuClose}>
          <Link
            className={classes.link}
            to={`/user/${user.id}`}
            data-testid="profile-button"
          >
            Profile
          </Link>
        </MenuItem>
        <MenuItem onClick={handleLogoutClick} data-testid="logoutHeader-button">Logout</MenuItem>
      </Menu>
    </div>
  )
}

export default UserMenu
