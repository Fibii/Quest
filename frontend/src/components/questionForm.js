import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import UserContext from './userContext'
import Copyright from './copyrights'

const useStyles = makeStyles(theme => ({
  root: {
    width: 600,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 24
  },

  paper: {
    minWidth: 340,
    prefWidth: 600,
    width: 600,
    padding: 16,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  item: {
    marginTop: 8
  }
}))


const QuestionForm = () => {
  const classes = useStyles()

  const [questionTitle, setQuestionTitle] = useState('')
  const [questionContent, setQuestionContent] = useState('')
  const [questionTags, setQuestionTags] = useState('')

  const user = useContext(UserContext)

  const handleQuestionPost = () => {
    const tags = questionTags.split(',')
      .map(tag => {
        return tag.replace(/^\s+|\s+$/gm, '')
      })
  }

  const handleClearButton = (event) => {
    setQuestionContent('')
    setQuestionTitle('')
    setQuestionTags('')
  }


  return (
    <div id='container' style={{
      position: 'relative',
      minHeight: '100vh'
    }}
    >
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingBotton: '3.5 rem'
      }}>
        <Paper className={classes.paper}>
          <Grid container justify='flex-start' direction='column' className={classes.root}>
            <Grid item className={classes.item}>
              <TextField
                placeholder="Title"
                multiline={true}
                fullWidth
                variant="outlined"
                value={questionTitle}
                onChange={(event) => setQuestionTitle(event.target.value)}
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextField
                placeholder="Content"
                multiline={true}
                rows={3}
                rowsMax={8}
                fullWidth
                variant="outlined"
                value={questionContent}
                onChange={(event) => setQuestionContent(event.target.value)}
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextField
                placeholder="Tags"
                multiline={true}
                fullWidth
                variant="outlined"
                value={questionTags}
                onChange={(event) => setQuestionTags(event.target.value)}
              />
            </Grid>
            <Grid container justify='flex-end' className={classes.item}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearButton}
                style={{
                  marginRight: 8
                }}>
                clear
              </Button>
              <Button
                variant="outlined"
                color='primary'
                onClick={handleQuestionPost}>
                submit
              </Button>
            </Grid>
          </Grid>
        </Paper>

      </div>
      <Copyright/>

    </div>
  )
}

export default QuestionForm
