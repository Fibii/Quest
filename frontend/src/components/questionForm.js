import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import UserContext from './userContext'
import Copyright from './copyrights'
import Notification from './notification'
import questionService from '../services/questions'
import { useHistory } from 'react-router-dom'

const Joi = require('@hapi/joi')

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
  const [titleHelperText, setTitleHelperText] = useState('')
  const [contentHelperText, setContentHelperText] = useState('')
  const [tagsHelperText, setTagsHelperText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const user = useContext(UserContext)
  const history = useHistory()

  const schema = Joi.object({
    title: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9_." "-]*'))
      .min(6)
      .max(64),
    content: Joi.string()
      .min(6),
    tags: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9,_ ]*$'))
  })
    .or('title', 'content', 'tags')

  /**
   * Updates questionTitle to user input, validates the title
   * Updates tagsHelperText to an error message if validation fails, otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const titleOnChange = (event) => {
    setQuestionTitle(event.target.value)
    setTitleHelperText('')

    const { error } = schema.validate({
      title: questionTitle
    })

    if (error) {
      setTitleHelperText('title must be 6 characters long at least and 64 at most')
    }

  }

  /**
   * Updates questionContent to user input, validates the title
   * Updates contentHelperText to an error message if validation fails, otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const contentOnChange = (event) => {
    setQuestionContent(event.target.value)
    setContentHelperText('')

    const { error } = schema.validate({
      content: questionContent
    })

    if (error) {
      setContentHelperText('content must be at least 6 characters long')
    }

  }

  /**
   * Updates questionTags to user input, validates the title
   * Updates tagsHelperText to an error message if validation fails, otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const tagsOnChange = (event) => {
    const tags = event.target.value
    setQuestionTags(tags)
    setTagsHelperText('')

    const { error } = schema.validate({
      tags: tags
    })

    if (error) {
      setTagsHelperText('tags must be words, separated by commas, such "hello, world"')
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
    const tags = questionTags.split(',')
      .map(tag => {
        return tag.replace(/^\s+|\s+$/gm, '')
      })

    const question = {
      title: questionTitle,
      content: questionContent,
      tags: tags
    }

    // validating only these two to allow empty tags, maybe refactor this later
    const { error } = schema.validate({
      title: questionTitle,
      content: questionContent,
    })

    if (error || tagsHelperText) {
      setErrorMessage('All fields are required, if a field is red, fix it')
    } else {
      const newQuestion = await questionService.addQuestion(question)

      if (!newQuestion || newQuestion.error) {
        setErrorMessage(newQuestion.error)
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
  }

  /**
   * clears all the textfields when "clear" button is clicked
   * */
  const handleClearButton = () => {
    clearAll()
  }

  if (!user) {
    return (
      <Notification message={'you must be logged in'} />
    )
  }

  return (
    <div id='container' style={{
      position: 'relative',
      minHeight: '100vh'
    }}
    >
      <Notification message={errorMessage} />
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
                error={titleHelperText.length > 0}
                helperText={titleHelperText}
                placeholder="Title"
                multiline={true}
                fullWidth
                variant="outlined"
                value={questionTitle}
                onChange={titleOnChange}
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextField
                error={contentHelperText.length > 0}
                helperText={contentHelperText}
                placeholder="Content"
                multiline={true}
                rows={3}
                rowsMax={8}
                fullWidth
                variant="outlined"
                value={questionContent}
                onChange={contentOnChange}
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextField
                error={tagsHelperText.length > 0}
                helperText={tagsHelperText}
                placeholder="Tags"
                multiline={true}
                fullWidth
                variant="outlined"
                value={questionTags}
                onChange={tagsOnChange}
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
