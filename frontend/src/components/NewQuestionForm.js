import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { useHistory } from 'react-router-dom'
import UserContext from './UserContext'
import Copyright from './Copyrights'
import Notification from './Notification'
import questionService from '../services/questions'
import validator from '../services/validator'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 24,
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
    marginTop: 8,
  },
}))


const NewQuestionForm = () => {
  const classes = useStyles()

  const [questionTitle, setQuestionTitle] = useState('')
  const [questionContent, setQuestionContent] = useState('')
  const [questionTags, setQuestionTags] = useState('')
  const [titleHelperText, setTitleHelperText] = useState('')
  const [contentHelperText, setContentHelperText] = useState('')
  const [tagsHelperText, setTagsHelperText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [user] = useContext(UserContext)
  const history = useHistory()


  /**
   * Updates questionTitle to user input, validates the title
   * Updates tagsHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const titleOnChange = (event) => {
    setQuestionTitle(event.target.value)
    setTitleHelperText('')

    if (!validator.questionFormValidator({ title: questionTitle })) {
      setTitleHelperText('title must be 6 characters long at least and 64 at most')
    }
  }

  /**
   * Updates questionContent to user input, validates the title
   * Updates contentHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const contentOnChange = (event) => {
    setQuestionContent(event.target.value)
    setContentHelperText('')

    if (!validator.questionFormValidator({ content: questionContent })) {
      setContentHelperText('content must be at least 8 characters long')
    }
  }

  /**
   * Updates questionTags to user input, validates the title
   * Updates tagsHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const tagsOnChange = (event) => {
    const tags = event.target.value
    setQuestionTags(tags)
    setTagsHelperText('')

    if (!validator.questionFormValidator({ tags })) {
      setTagsHelperText('tags must be words, separated by space, like in "hello world"')
    }
  }

  /**
   * Adds a new Question to the database
   *
   * Sends a post request to backend to add a question, if success, the user
   * is redirected to the /question/id, otherwise an error is shown
   *
   * @see questionService
   * */
  const handleQuestionPost = async () => {
    const tags = questionTags.split(' ')
      .map((tag) => tag.replace(/^\s+|\s+$/gm, ''))
      .filter((tag) => tag.length > 0)

    const question = {
      title: questionTitle,
      content: questionContent,
      tags,
    }

    // validating only these two to allow empty tags, maybe refactor this later
    const valid = validator.questionFormValidator({
      title: questionTitle,
      content: questionContent,
    })

    if (!valid || tagsHelperText) {
      setErrorMessage('All fields are required, if a field is red, fix it')
    } else {
      const newQuestion = await questionService.addQuestion(question)

      if (!newQuestion || newQuestion.error) {
        setErrorMessage('error: could not create a new question')
      } else {
        history.push(`/question/${newQuestion.id}`)
      }
    }
  }

  /**
   * helper function that clears all the textfields
   * */
  const clearAll = () => {
    setQuestionContent('')
    setQuestionTitle('')
    setQuestionTags('')
    setTitleHelperText('')
    setContentHelperText('')
    setTagsHelperText('')
  }

  /**
   * clears all the textfields when "clear" button is clicked
   * */
  const handleClearButton = () => {
    clearAll()
  }

  if (!user) {
    return (
      <Notification title="Error" message="you must be logged in" severity="error" />
    )
  }

  return (
    <div
      id="container"
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
      data-testid="questionForm-container"
    >
      <Notification title="Error" message={errorMessage} severity="error" data-testid="error-message" />
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingBotton: '3.5 rem',
      }}
      >
        <Paper className={classes.paper}>
          <Grid container justify="flex-start" direction="column" className={classes.root}>
            <Grid item className={classes.item}>
              <TextField
                error={titleHelperText.length > 0}
                helperText={titleHelperText}
                placeholder="Title"
                multiline
                fullWidth
                variant="outlined"
                value={questionTitle}
                onChange={titleOnChange}
                inputProps={{
                  'data-testid': 'title-input',
                }}
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextField
                error={contentHelperText.length > 0}
                helperText={contentHelperText}
                placeholder="Content"
                multiline
                rows={3}
                rowsMax={8}
                fullWidth
                variant="outlined"
                value={questionContent}
                onChange={contentOnChange}
                inputProps={{
                  'data-testid': 'content-input',
                }}
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextField
                error={tagsHelperText.length > 0}
                helperText={tagsHelperText}
                placeholder="Tags"
                multiline
                fullWidth
                variant="outlined"
                value={questionTags}
                onChange={tagsOnChange}
                inputProps={{
                  'data-testid': 'tags-input',
                }}
              />
            </Grid>
            <Grid container justify="flex-end" className={classes.item}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearButton}
                style={{
                  marginRight: 8,
                }}
                data-testid="clear-button"
              >
                clear
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleQuestionPost}
                data-testid="submit-button"
              >
                submit
              </Button>
            </Grid>
          </Grid>
        </Paper>

      </div>
      <Copyright />

    </div>
  )
}

export default NewQuestionForm
