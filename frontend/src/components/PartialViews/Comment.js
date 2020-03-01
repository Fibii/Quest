import React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import UpvoteBox from './UpvoteBox'

const useStyles = makeStyles(theme => ({
  likes: {
    [theme.breakpoints.up('xs')]: {
      backgroundColor: theme.palette.primary1Color,
      fontSize: '1rem'
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      fontSize: '1.2rem'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
      width: '90%'
    },
    [theme.breakpoints.down('300')]: {
      fontSize: '0.6rem',
    }
  },
  grid: {
    marginTop: 8,
    marginBottom: 8
  }
}))


const Comment = ({ content, likes, postedBy }) => {
  const classes = useStyles()
  return (
    <Paper>
      <Grid container justify={'flex-start'}>
        <UpvoteBox likes={likes}/>
        <Grid item xs={10} className={classes.grid}>
          <Typography className={classes.likes}>
            {content}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify={'flex-end'}>
        <Typography variant='caption' style={{
          marginRight: 8,
          color: 'grey'
        }}>
          posted by: {postedBy}
        </Typography>
      </Grid>
    </Paper>
  )
}

export default Comment
