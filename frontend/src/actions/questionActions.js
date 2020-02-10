import questionActions from './questionAction'

export const setQuestion = (question) => {
  return {
    type: questionActions.SET_QUESTION,
    question: question
  }
}

export const setErrorMessage = (errorMessage) => {
  return {
    type: questionActions.SET_ERROR_MESSAGE,
    errorMessage: errorMessage
  }
}

export const setCommentContent = (commentContent) => {
  return {
    type: questionActions.SET_COMMENT_CONTENT,
    commentContent: commentContent
  }
}

export const setShowEditFields = (showEditFields) => {
  return {
    type: questionActions.SET_SHOW_EDIT_FIELDS,
    showEditFields: showEditFields
  }
}

export const setEditedQuestionTitle = (editedQuestionTitle) => {
  return {
    type: questionActions.SET_EDITED_QUESTION_TITLE,
    editedQuestionTitle: editedQuestionTitle
  }
}

export const setEditedQuestionContent = (editedQuestionContent) => {
  return {
    type: questionActions.SET_EDITED_QUESTION_CONTENT,
    editedQuestionContent: editedQuestionContent
  }
}

export const setEditedQuestionTags = (editedQuestionTags) => {
  return {
    type: questionActions.SET_EDITED_QUESTION_TAGS,
    editedQuestionTags: editedQuestionTags
  }
}

export const setEditedQuestionTitleHelperText = (editedQuestionTitleHelperText) => {
  return {
    type: questionActions.SET_EDITED_QUESTION_TITLE_HELPER_TEXT,
    editedQuestionTitleHelperText: editedQuestionTitleHelperText
  }
}

export const setEditedQuestionContentHelperText = (editedQuestionContentHelperText) => {
  return {
    type: questionActions.SET_EDITED_QUESTION_CONTENT_HELPER_TEXT,
    editedQuestionContentHelperText: editedQuestionContentHelperText
  }
}

export const setEditedQuestionTagsHelperText = (editedQuestionTagsHelperText) => {
  return {
    type: questionActions.SET_EDITED_QUESTION_TAGS_HELPER_TEXT,
    editedQuestionTagsHelperText: editedQuestionTagsHelperText
  }
}

export const setIsQuestionSolved = (isQuestionSolved) => {
  return {
    type: questionActions.SET_IS_QUESTION_SOLVED,
    isQuestionSolved: isQuestionSolved
  }
}

export const setClipboardSnackbarOpen = (clipboardSnackbarOpen) => {
  return {
    type: questionActions.SET_CLIPBOARD_SNACKBAR_OPEN,
    clipboardSnackbarOpen: clipboardSnackbarOpen
  }
}
