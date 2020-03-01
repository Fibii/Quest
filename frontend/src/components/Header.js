import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import UserContext from './UserContext'

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `2px solid ${grey[400]}`,
    background: grey[300],
  },
  toolbarTitle: {
    flex: 1,
    color: grey[700],
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}))


const Header = () => {
  const classes = useStyles()
  const [user, setUser] = useContext(UserContext)

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('qa_userLoggedIn')
  }
  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Grid container justify={user ? 'space-between' : 'center'} id='container'>
          <Grid container justify={'center'} direction={'column'} xs={1} item={true} style={{
            display: user ? 'flex' : 'none'
          }}>
            <Link to={'/'}>
              <Button variant="outlined" size="small">
                Home
              </Button>
            </Link>
          </Grid>
          <Grid container justify={'center'} direction={'column'} xs={1} item={true}>
            <Typography
              component="h2"
              variant="h4"
              color="inherit"
              align="center"
              noWrap
              className={classes.toolbarTitle}
              style={{
                color: grey[600]
              }}
            >
              QA
            </Typography>
          </Grid>
          <Grid container justify={'center'} direction={'column'} style={{
            display: user ? 'flex' : 'none'
          }} xs={2} item={true}>
            <Grid item>
              <Link to={'/question/new'}>
                <Button variant="outlined" size="small">
                  New
                </Button>
              </Link>
              <Button variant="outlined" size="small" onClick={handleLogout}
                      style={{
                        marginLeft: 8
                      }}>
                Logout
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </React.Fragment>
  )
}


export default Header
