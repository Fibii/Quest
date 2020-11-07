import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
  },
}))

/**
 * A Grid that centers it's child horizontally then vertically
 *
 * @param children: react components
 * @param outerStyle: css style of the first Grid
 * @param innerStyle: css style of the second Grid
 * */
const HVContainer = ({ children, outerStyle, innerStyle }) => {
  const classes = useStyles()
  return (
    <Grid container direction="row" justify="center" className={classes.container} style={outerStyle} >
      <Grid container direction="column" justify="center" style={innerStyle}>
        {children}
      </Grid>
    </Grid>
  )
}

export default HVContainer
