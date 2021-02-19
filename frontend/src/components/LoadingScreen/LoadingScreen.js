import React from 'react'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

const LoadingScreen = () => (
  <Grid container justify="center" alignItems="center" style={{height: '100vh'}}>
    <CircularProgress color="secondary" />
  </Grid>
)

export default LoadingScreen
