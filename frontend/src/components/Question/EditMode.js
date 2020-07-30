import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import {
  setEditedQuestionContent,
  setEditedQuestionContentHelperText,
  setEditedQuestionTags,
  setEditedQuestionTagsHelperText,
  setEditedQuestionTitle,
  setEditedQuestionTitleHelperText,
} from '../../actions/questionActions'
import validator from '../../services/validator'
import QuestionIconsView from '../QuestionIcons/QuestionIconsView'


const EditTitleView = ({ text, helperText, onChange }) => (
  <Grid container justify="space-between">
    <TextField
      helperText={helperText}
      error={helperText.length > 0}
      id="title"
      label="Title"
      variant="outlined"
      value={text}
      onChange={onChange}
      style={{
        margin: 8,
        marginLeft: 16,
        width: '94%',
      }}
      inputProps={{
        'data-testid': 'title-input',
      }}
    />
  </Grid>
)

const EditContentView = ({ text, helperText, onChange }) => (
  (
    <TextField
      helperText={helperText}
      error={helperText.length > 0}
      id="content"
      label="Content"
      variant="outlined"
      value={text}
      multiline
      rows={3}
      rowsMax={8}
      fullWidth
      onChange={onChange}
      style={{
        marginLeft: 16,
        width: '94%',
      }}
      inputProps={{
        'data-testid': 'content-input',
      }}
    />
  )
)

const EditTagsView = ({ text, helperText, onChange }) => (
  <TextField
    helperText={helperText}
    error={helperText.length > 0}
    id="tags"
    label="Tags"
    variant="outlined"
    value={text}
    onChange={onChange}
    style={{
      margin: 8,
      marginBottom: 26,
      marginLeft: 16,
      width: '94%',
    }}
    inputProps={{
      'data-testid': 'tags-input',
    }}
  />
)

const EditMode = ({ state, dispatch }) => {
  const {
    editedQuestionTitle, editedQuestionContent, editedQuestionTags,
    editedQuestionTitleHelperText, editedQuestionContentHelperText, editedQuestionTagsHelperText,
  } = state

  /**
   * Updates editedQuestionTitle to user input, validates the title
   * Updates editedTitleHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedTitle = (event) => {
    dispatch(setEditedQuestionTitle(event.target.value))
    dispatch(setEditedQuestionTitleHelperText(''))

    if (!validator.questionFormValidator({ title: state.editedQuestionTitle })) {
      dispatch(setEditedQuestionTitleHelperText('title must be 6 characters long at least and 64 at most'))
    }
  }

  /**
   * Updates editedQuestionContent to user input, validates the title
   * Updates editedQuestionContentHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedContent = (event) => {
    dispatch(setEditedQuestionContent(event.target.value))
    dispatch(setEditedQuestionContentHelperText(''))

    if (!validator.questionFormValidator({ content: state.editedQuestionContent })) {
      dispatch(setEditedQuestionContentHelperText('content must be at least 8 characters long'))
    }
  }

  /**
   * Updates editedQuestionTags to user input, validates the title
   * Updates editedQuestionTagsHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedTags = (event) => {
    const tags = event.target.value
    dispatch(setEditedQuestionTags(tags))
    dispatch(setEditedQuestionTagsHelperText(''))

    if (!validator.questionFormValidator({ tags })) {
      dispatch(setEditedQuestionTagsHelperText('tags must be words, separated by space, like in "hello world"'))
    }
  }

  return (
    <Paper>
      <Grid container justify="space-between" wrap="nowrap">
        <EditTitleView
          onChange={handleEditedTitle}
          text={editedQuestionTitle}
          helperText={editedQuestionTitleHelperText}
        />
        <QuestionIconsView state={state} dispatch={dispatch} />
      </Grid>
      <EditContentView
        onChange={handleEditedContent}
        text={editedQuestionContent}
        helperText={editedQuestionContentHelperText}
      />
      <EditTagsView
        onChange={handleEditedTags}
        text={editedQuestionTags}
        helperText={editedQuestionTagsHelperText}
      />
    </Paper>
  )
}

export default EditMode
