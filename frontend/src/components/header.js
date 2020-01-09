import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import UserContext from './userContext'

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
  console.log(user)
  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Grid container justify='space-between' id='container'>
          <Grid container justify={'center'} direction={'column'} xs={1}>
            <Link to={'/'}>
              <Button variant="outlined" size="small">
                Home
              </Button>
            </Link>
          </Grid>
          <Grid container justify={'center'} direction={'column'} xs={1}>
            <Typography
              component="h2"
              variant="h4"
              color="inherit"
              align="center"
              noWrap
              className={classes.toolbarTitle}
              color={grey[300]}
            >
              QA
            </Typography>
          </Grid>
          <Grid container justify={'center'} direction={'column'} style={{
            opacity: user ? '100%' : '0%'
          }} xs={2}>
            <Grid item>
              <Link to={'/question/new'}>
                <Button variant="outlined" size="small">
                  New
                </Button>
              </Link>
              <Button variant="outlined" size="small" onClick={() => setUser(null)}
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
