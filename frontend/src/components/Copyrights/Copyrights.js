import React from 'react'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import blue from '@material-ui/core/colors/blue'

const useStyles = makeStyles(() => ({
  copyright: {
    flexShrink: 0,
    paddingBottom: '2.5 rem',
    background: blue[200],
    bottom: 0,
    width: '100%',
  },
}))

const Copyright = () => {
  const classes = useStyles()

  return (
    <Grid container justify="center" className={classes.copyright}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="/">
          QA
        </Link>
        {' '}
        {new Date().getFullYear()}
        .
      </Typography>
    </Grid>
  )
}

export default Copyright
