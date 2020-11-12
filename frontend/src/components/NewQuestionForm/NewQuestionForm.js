import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { lightBlue, pink } from '@material-ui/core/colors'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import UserContext from '../UserContext/UserContext'
import Notification from '../Notification/Notification'
import questionService from '../../services/questions'
import validator from '../../services/validator'
import QuestionInstructions from './QuestionInstructions'
import QuestionInstructionSmall from './QuestionInstructionSmall'
import VHContainer from '../Containers/VHContainer/VHContainer'
import config from '../../config'

const initialState = {
  questionTitle: '',
  questionContent: '',
  questionTags: '',
  titleHelperText: '',
  contentHelperText: '',
  tagsHelperText: '',
}

const useStyles = makeStyles((theme) => ({

  paper: {
    [theme.breakpoints.down('md')]: {
      width: '80%',
      marginRight: 0,
      marginBottom: 32,
    },
    padding: 16,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginRight: 20,
    marginBottom: 16,
  },
  instructionPaper: {
    width: 300,
    height: 100,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 64,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  item: {
    marginTop: 8,
  },
}))

const SubmitButton = withStyles({
  root: {
    border: '1px solid',
    boxShadow: 'none',
    borderColor: lightBlue[600],
    color: lightBlue[700],
    '&:hover': {
      borderColor: lightBlue[400],
      backgroundColor: lightBlue[100],
    },
  },
})(Button)

const ClearButton = withStyles({
  root: {
    border: '1px solid',
    boxShadow: 'none',
    borderColor: pink[600],
    color: pink[700],
    '&:hover': {
      borderColor: pink[400],
      backgroundColor: pink[100],
    },
  },
})(Button)

const TextFields = ({ state, setState }) => {
  const classes = useStyles()
  const {
    questionTitle, questionContent, questionTags,
    contentHelperText, titleHelperText, tagsHelperText,
  } = state

  /**
   * Updates questionTitle to user input, validates the title
   * Updates tagsHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const titleOnChange = (event) => {
    event.persist()
    setState((previousState) => ({
      ...previousState,
      questionTitle: event.target.value,
      titleHelperText: '',
    }))
    if (!validator.questionFormValidator({ title: questionTitle })) {
      setState((previousState) => ({
        ...previousState,
        titleHelperText: 'title must be 6 characters long at least and 64 at most',
      }))
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
    event.persist()
    setState((previousState) => ({
      ...previousState,
      questionContent: event.target.value,
      contentHelperText: '',
    }))

    if (!validator.questionFormValidator({ content: questionContent })) {
      setState((previousState) => ({
        ...previousState,
        contentHelperText: 'content must be at least 8 characters long',
      }))
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
    setState((previousState) => ({
      ...previousState,
      questionTags: tags,
      tagsHelperText: '',
    }))

    if (!validator.questionFormValidator({ tags })) {
      setState((previousState) => ({
        ...previousState,
        tagsHelperText: 'tags must be words, separated by space, like in "hello world"',
      }))
    }
  }

  return (
    <Grid container direction="column" className={classes.mobileContainer}>
      <Grid>
        <Typography variant="h6">Title</Typography>
        <Typography variant="subtitle2" style={{ marginBottom: 2 }}>
          Be specific and imagine you’re asking a question to another person
        </Typography>
        <TextField
          error={titleHelperText.length > 0}
          helperText={titleHelperText}
          id="title"
          margin="dense"
          placeholder="Ex: how do i undo git commit without losing changes?"
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
        <Typography variant="h6">Body</Typography>
        <Typography variant="subtitle2" style={{ marginBottom: 2 }}>
          Include all the information someone would need to answer your question
        </Typography>
        <TextField
          error={contentHelperText.length > 0}
          helperText={contentHelperText}
          id="content"
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
        <Typography variant="h6">Tags</Typography>
        <Typography variant="subtitle2" style={{ marginBottom: 2 }}>
          Add tags to describe what your question is about (tags are separated by space)
        </Typography>
        <TextField
          error={tagsHelperText.length > 0}
          helperText={tagsHelperText}
          id="tags"
          placeholder="Ex: Java Spring_boot"
          margin="dense"
          fullWidth
          variant="outlined"
          value={questionTags}
          onChange={tagsOnChange}
          inputProps={{
            'data-testid': 'tags-input',
          }}
        />
      </Grid>
    </Grid>
  )
}

const Buttons = ({ state, setState, setErrorMessage }) => {
  const classes = useStyles()
  const history = useHistory()
  const {
    questionTitle, questionContent, questionTags, tagsHelperText,
  } = state
  const { urls } = config

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
      setTimeout(() => setErrorMessage(''), 5000)
    } else {
      const newQuestion = await questionService.addQuestion(question)

      if (!newQuestion || newQuestion.error) {
        setErrorMessage('error: could not create a new question')
      } else {
        history.push(`${urls.question}/${newQuestion.id}`)
      }
    }
  }

  /**
   * helper function that clears all the textfields
   * */
  const clearAll = () => {
    setState(initialState)
  }

  /**
   * clears all the textfields when "clear" button is clicked
   * */
  const handleClearButton = () => {
    clearAll()
  }

  return (
    <Grid container justify="flex-end" className={classes.item}>
      <ClearButton
        variant="outlined"
        color="secondary"
        onClick={handleClearButton}
        style={{
          marginRight: 8,
        }}
        data-testid="clear-button"
      >
        clear
      </ClearButton>
      <SubmitButton
        variant="outlined"
        color="primary"
        onClick={handleQuestionPost}
        data-testid="submit-button"
      >
        submit
      </SubmitButton>
    </Grid>
  )
}
const NewQuestionForm = () => {
  const classes = useStyles()
  const [user] = useContext(UserContext)
  const [errorMessage, setErrorMessage] = useState('')
  const isMobile = useMediaQuery('(max-width:600px)')
  const [state, setState] = useState(initialState)

  if (!user) {
    return (
      <Notification title="Error" message="you must be logged in" severity="error" />
    )
  }

  if (isMobile) {
    return (
      <VHContainer outerStyle={{ marginTop: 16, marginBottom: 16, height: 'inherit' }}>
        <Notification
          title="Error"
          message={errorMessage}
          severity="error"
          style={{
            marginTop: 16,
            marginBottom: 16,
            width: '80%',
          }}
        />
        <QuestionInstructionSmall />
        <Paper className={classes.paper}>
          <Grid item>
            <TextFields state={state} setState={setState} />
          </Grid>
          <Buttons state={state} setState={setState} setErrorMessage={setErrorMessage} />
        </Paper>
      </VHContainer>
    )
  }

  return (
    <VHContainer>
      <Notification
        title="Error"
        message={errorMessage}
        severity="error"
        style={{
          marginTop: 16,
          marginBottom: 16,
          width: '80%',
        }}
      />
      <Grid item>
        <Paper className={classes.paper}>
          <TextFields state={state} setState={setState} />
          <Buttons state={state} setState={setState} setErrorMessage={setErrorMessage} />
        </Paper>
      </Grid>
      <Grid item>
        <Paper className={classes.instructionPaper}>
          <QuestionInstructions />
        </Paper>
      </Grid>
    </VHContainer>
  )
}

export default NewQuestionForm
