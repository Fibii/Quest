import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded'


const useStyles = makeStyles((theme) => ({
  upvoteBox: {
    [theme.breakpoints.up('xs')]: {
      width: '4rem',
      fontSize: '2rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
      width: '3rem',
    },
    [theme.breakpoints.down(300)]: {
      fontSize: '1rem',
      width: '2rem',
    },
    [theme.breakpoints.down(200)]: {
      fontSize: '0.4rem',
      width: '1rem',
    },
  },
}))

const UpvoteBox = ({ likes, handleUpvote, handleDownvote }) => {
  const classes = useStyles()
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      className={classes.upvoteBox}
    >
      <IconButton onClick={handleUpvote} size="small">
        <ArrowUpwardRoundedIcon className={classes.upvoteBox} />
      </IconButton>
      <Typography className={classes.likes}>{likes}</Typography>
      <IconButton onClick={handleDownvote} size="small">
        <ArrowDownwardRoundedIcon className={classes.upvoteBox} />
      </IconButton>
    </Grid>
  )
}

export default UpvoteBox
