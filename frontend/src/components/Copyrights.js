import React from 'react'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import grey from '@material-ui/core/colors/grey'

const useStyles = makeStyles(theme => ({
  copyright: {
    paddingBottom: '2.5 rem',
    background: grey[400],
    bottom: 0,
    position: 'absolute',
    width: '100%'
  }
}))

const Copyright = () => {
  const classes = useStyles()

  return (
    <Grid container justify='center' className={classes.copyright}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="#">
          QA
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Grid>
  )
}

export default Copyright
