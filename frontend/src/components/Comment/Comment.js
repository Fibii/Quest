import React from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import UpvoteBox from '../UpvoteBox/UpvoteBox'
import QuestionIcons from '../QuestionIcons/QuestionIcons'
import validator from '../../services/validator'
import utils from '../../services/utils'

const useStyles = makeStyles((theme) => ({
  likes: {
    [theme.breakpoints.up('xs')]: {
      backgroundColor: theme.palette.primary1Color,
      fontSize: '1rem',
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      fontSize: '1.2rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
      width: '90%',
    },
    [theme.breakpoints.down(330)]: {
      fontSize: '0.6rem',
    },
  },

  icons: {
    marginLeft: 20,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 12,
    },
  },

  grid: {
    width: '90%',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },

}))


const Comment = ({
  user, comment, handleEdit, handleDelete, handleShare, handleUpdate, handleUpvote, handleDownVote,
}) => {
  const classes = useStyles()

  return (
    <Paper>
      <Grid container justify="flex-start" data-testid="comment-container" wrap="nowrap">
        <UpvoteBox
          likes={utils.getLikes(comment)}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownVote}
        />
        <Grid item className={classes.grid}>
          <Typography className={classes.likes} data-testid="comment-content">
            {comment.content}
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify="space-between">
        <Grid item className={classes.icons}>
          {validator.isAuthor(user, comment)
            ? (
              <QuestionIcons
                handleUpdate={handleUpdate}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleShare={handleShare}
                direction="row"
              />
            )
            : null}
        </Grid>
        <Typography
          variant="caption"
          style={{
            marginRight: 8,
            marginTop: 8,
            color: 'grey',
          }}
        >
          posted by:
          {' '}
          {comment.postedBy && comment.postedBy.username}
        </Typography>
      </Grid>
    </Paper>
  )
}

export default Comment
