import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem'
import HomeIcon from '@material-ui/icons/Home'
import ListItemText from '@material-ui/core/ListItemText'
import AddBoxIcon from '@material-ui/icons/AddBox'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { grey, lightBlue } from '@material-ui/core/colors'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
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

const Drawer = ({ open, handleLogout, handleDrawerClose }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
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
        <ListItem button key="logout" onClick={handleLogout} data-testid="logoutDrawer-button">
          <ExitToAppIcon className={classes.icons} />
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  )
}

export default Drawer
