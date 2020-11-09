import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem'
import HomeIcon from '@material-ui/icons/Home'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import ListItemText from '@material-ui/core/ListItemText'
import AddBoxIcon from '@material-ui/icons/AddBox'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import React, { useContext } from 'react'
import { grey, lightBlue } from '@material-ui/core/colors'
import Paper from '@material-ui/core/Paper'
import UserContext from '../UserContext/UserContext'
import config from '../../config'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
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
  icons: {
    color: lightBlue[800],
    marginRight: 16,
  },
  itemPaper: {
    marginTop: 4,
    marginLeft: 4,
    marginRight: 4,
  },

}))

const Sidebar = ({ state, dispatch }) => {
  const [user, setUser] = useContext(UserContext)
  const { drawerIsOpen } = state
  const classes = useStyles()
  const theme = useTheme()
  const { urls } = config

  const handleDrawerClose = () => {
    dispatch({ type: 'CLOSE_DRAWER' })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('qa_userLoggedIn')
  }

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerIsOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader} data-testid="drawer-container">
          <Typography variant="h4">Quest</Typography>
          <IconButton onClick={() => handleDrawerClose()} data-testid="close-drawer">
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to={urls.root} className={classes.link}>
            <Paper className={classes.itemPaper}>
              <ListItem button key="home" data-testid="home-button">
                <HomeIcon className={classes.icons} />
                <ListItemText primary="Home" />
              </ListItem>
            </Paper>
          </Link>
          <Link to={urls.newQuestion} className={classes.link} data-testid="newQuestion-button">
            <Paper className={classes.itemPaper}>
              <ListItem button key="newQuestion">
                <AddBoxIcon className={classes.icons} />
                <ListItemText primary="New Question" />
              </ListItem>
            </Paper>
          </Link>
          <Link to={`${urls.user}/${user.id}`} className={classes.link} data-testid="newQuestion-button">
            <Paper className={classes.itemPaper}>
              <ListItem button key="myProfile">
                <AccountBoxIcon className={classes.icons} />
                <ListItemText primary="My Profile" />
              </ListItem>
            </Paper>
          </Link>
          <Paper onClick={() => handleLogout()} className={classes.itemPaper}>
            <ListItem button key="logout" data-testid="logoutDrawer-button">
              <ExitToAppIcon className={classes.icons} />
              <ListItemText primary="Logout" />
            </ListItem>
          </Paper>
        </List>
      </Drawer>
    </>
  )
}

export default Sidebar
