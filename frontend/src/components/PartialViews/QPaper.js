import React, { useState } from 'react'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import QuestionIcons from './QuestionIcons'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import grey from '@material-ui/core/colors/grey'
import { Link } from 'react-router-dom'
import { getLikes } from '../../services/utils'
import validator from '../../services/validator'
import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const useStyles = makeStyles(theme => ({

  questionContent: {
    width: '90%',
  },

  paper: {
    width: '90%',
    marginBottom: 8
  },

  font: {
    [theme.breakpoints.between('lg', 'xl')]: {
      fontSize: '1.4rem'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem'
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
      width: '7%'
    }
  },

  upvoteBox: {
    backgroundColor: grey[200],
    fontSize: '1.6rem',
    borderWidth: '2',
    borderRadius: '52'
  }

}))

const QPaper = ({ user, question, handleDelete }) => {
  const classes = useStyles()
  const [openAlertWindow, setOpenAlertWindow] = useState(false)
  const path = `question/${question.id}`

  return (
    <Grid container justify={'center'}>
      <Paper className={classes.paper}>
        <Grid container direction={'column'} style={{
          marginTop: 4,
          marginBottom: 4,
        }}>
          <Grid container justify={'space-between'}>
            <Link to={path} style={{
              textDecoration: 'none',
              width: '80%'
            }}>
              <Typography variant="h5" align={'left'} className={classes.font} style={{
                overflowWrap: 'break-word',
                marginLeft: 32,
              }}>
                {question.title}
              </Typography>
            </Link>
            <Grid item>
              {validator.isAuthor(user, question) ?
                <QuestionIcons
                  handleDelete={() => setOpenAlertWindow(true)}
                  path={path}
                  direction={'row'}
                  alertCallback={handleDelete}
                  alertOpen={openAlertWindow}
                  alertSetOpen={setOpenAlertWindow}
                />
                :
                <CopyToClipboard text={`${window.location.origin}/${path}`}>
                  <IconButton size={'small'}>
                    <ShareIcon/>
                  </IconButton>
                </CopyToClipboard>
              }

            </Grid>
          </Grid>
        </Grid>
        <Grid container justify={'center'}>
          <Divider style={{
            width: '92%'
          }}/>
        </Grid>
        <Grid container justify={'flex-start'}>
          <Grid container direction={'column'} alignItems={'center'}
                className={classes.upvoteBoxContainer}>
            <KeyboardArrowUpIcon className={classes.upvoteBox}/>
            {getLikes(question.likes)}
          </Grid>
          <Typography style={{
            width: '90%'
          }}>
            {question.content.substr(0, 100) + '...'}
          </Typography>
        </Grid>
        <Grid container justify={'flex-end'}>
          <Typography variant='caption' style={{
            color: 'grey',
            marginRight: 8
          }}>
            posted by:{question && question.postedBy && question.postedBy.username}
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default QPaper
