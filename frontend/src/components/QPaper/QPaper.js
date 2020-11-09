import React from 'react'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import grey from '@material-ui/core/colors/grey'
import { Link } from 'react-router-dom'
import validator from '../../services/validator'
import utils from '../../services/utils'
import QuestionIcons from '../QuestionIcons/QuestionIcons'
import config from '../../config'

const useStyles = makeStyles((theme) => ({

  questionContent: {
    width: '90%',
  },

  paper: {
    width: '90%',
    marginBottom: 8,
  },

  font: {
    [theme.breakpoints.between('lg', 'xl')]: {
      fontSize: '1.4rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem',
    },
  },

  upvoteBoxContainer: {
    width: '5%',
    margin: '4 4 4 0',
    [theme.breakpoints.down('md')]: {
      marginRight: 6,
    },
    [theme.breakpoints.down('xs')]: {
      marginRight: 8,
      width: '7%',
    },
  },

  upvoteBox: {
    backgroundColor: grey[200],
    fontSize: '1.6rem',
    borderWidth: '2',
    borderRadius: '52',
  },

}))

const QPaper = ({ user, question, handleDelete }) => {
  const classes = useStyles()
  const { urls } = config

  const path = `${urls.question}/${question.id}`

  return (
    <Grid container justify="center" data-testid="qpaper-container">
      <Paper className={classes.paper}>
        <Grid
          container
          direction="column"
          style={{
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          <Grid container justify="space-between">
            <Link
              to={path}
              style={{
                textDecoration: 'none',
                width: '80%',
              }}
            >
              <Typography
                variant="h5"
                align="left"
                className={classes.font}
                style={{
                  overflowWrap: 'break-word',
                  marginLeft: 32,
                }}
                data-testid="title"
              >
                {question.title}
              </Typography>
            </Link>
            <Grid item>
              {utils.iff(validator.isAuthor(user, question),
                <QuestionIcons
                  handleDelete={handleDelete}
                  path={path}
                  direction="row"
                />,
                <QuestionIcons
                  path={path}
                  direction="row"
                />)}
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Divider style={{
            width: '92%',
          }}
          />
        </Grid>
        <Grid container justify="flex-start">
          <Grid
            container
            direction="column"
            alignItems="center"
            className={classes.upvoteBoxContainer}
            data-testid="likes"
          >
            <KeyboardArrowUpIcon className={classes.upvoteBox} />
            {utils.getLikes(question)}
          </Grid>
          <Typography
            style={{
              width: '90%',
            }}
            data-testid="content"
          >
            {`${question.content.substr(0, 100)}...`}
          </Typography>
        </Grid>
        <Grid container justify="flex-end">
          <Typography
            variant="caption"
            style={{
              color: 'grey',
              marginRight: 8,
            }}
            data-testid="postedBy"
          >
            posted by:
            {question && question.postedBy && question.postedBy.username}
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default QPaper
