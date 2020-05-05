import React, { useContext } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MoreIcon from '@material-ui/icons/MoreVert'
import AddBoxIcon from '@material-ui/icons/AddBox'
import HomeIcon from '@material-ui/icons/Home'
import { Link } from 'react-router-dom'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { grey, lightBlue } from '@material-ui/core/colors'
import UserContext from './UserContext'
import SearchBar from './PartialViews/SearchBar'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    backgroundColor: 'red',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: grey[100],
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'center',
    color: lightBlue[600],
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    outline: 'none',
  },
  toolbar: {
    background: lightBlue[600],
  },
  icons: {
    color: lightBlue[800],
    marginRight: 16,
  },

}))

const Header = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = useContext(UserContext)
  const theme = useTheme()

  if (!user) {
    return (
      <div className={classes.grow} data-testid="header-container">
        <AppBar position="relative" style={{ marginBottom: '5%' }}>
          <Toolbar className={classes.toolbar}>
            <Link to="/" className={classes.link} data-testid="logo">
              <Typography variant="h5" noWrap>
                Quest
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    )
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('qa_userLoggedIn')
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const handleLogoutClick = () => {
    handleLogout()
    handleMenuClose()
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
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
        >
          Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        Profile
      </MenuItem>
    </Menu>
  )

  return (
    <div className={classes.grow} data-testid="header-container">
      <AppBar position="relative" style={{ marginBottom: '5%' }}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            data-testid="open-drawer"
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" className={classes.link} data-testid="logo">
            <Typography className={classes.title} variant="h6" noWrap>
              Quest
            </Typography>
          </Link>
          <SearchBar />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader} data-testid="drawer-container">
          <Typography variant="h4">Quest</Typography>
          <IconButton onClick={handleDrawerClose} data-testid="close-drawer">
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to="/" className={classes.link}>
            <ListItem button key="home" data-testid="home-button">
              <HomeIcon className={classes.icons} />
              <ListItemText primary="Home" />
            </ListItem>
          </Link>
          <Link to="/question/new" className={classes.link} data-testid="newQuestion-button">
            <ListItem button key="newQuestion">
              <AddBoxIcon className={classes.icons} />
              <ListItemText primary="New Question" />
            </ListItem>
          </Link>
          <ListItem button key="logout" onClick={() => handleLogout()} data-testid="logout-button">
            <ExitToAppIcon className={classes.icons} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      {renderMobileMenu}
      {renderMenu}
    </div>
  )
}

export default Header
