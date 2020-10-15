import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
  },
}))

/**
 * A Grid that centers it's child vertically then horizontally
 * */
const VHContainer = ({ children, style, dataTestId }) => {
  const classes = useStyles()
  return (
    <Grid container direction="column" justify="center" className={classes.container} style={style} data-testid={dataTestId}>
      <Grid container direction="row" justify="center">
        {children}
      </Grid>
    </Grid>
  )
}

export default VHContainer
