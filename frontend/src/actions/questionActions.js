import questionActions from './questionAction'

export const setQuestion = (question) => ({
  type: questionActions.SET_QUESTION,
  question,
})

export const setErrorMessage = (errorMessage) => ({
  type: questionActions.SET_ERROR_MESSAGE,
  errorMessage,
})

export const setCommentContent = (commentContent) => ({
  type: questionActions.SET_COMMENT_CONTENT,
  commentContent,
})

export const setShowEditFields = (showEditFields) => ({
  type: questionActions.SET_SHOW_EDIT_FIELDS,
  showEditFields,
})

export const setEditedQuestionTitle = (editedQuestionTitle) => ({
  type: questionActions.SET_EDITED_QUESTION_TITLE,
  editedQuestionTitle,
})

export const setEditedQuestionContent = (editedQuestionContent) => ({
  type: questionActions.SET_EDITED_QUESTION_CONTENT,
  editedQuestionContent,
})

export const setEditedQuestionTags = (editedQuestionTags) => ({
  type: questionActions.SET_EDITED_QUESTION_TAGS,
  editedQuestionTags,
})

export const setEditedQuestionTitleHelperText = (editedQuestionTitleHelperText) => ({
  type: questionActions.SET_EDITED_QUESTION_TITLE_HELPER_TEXT,
  editedQuestionTitleHelperText,
})

export const setEditedQuestionContentHelperText = (editedQuestionContentHelperText) => ({
  type: questionActions.SET_EDITED_QUESTION_CONTENT_HELPER_TEXT,
  editedQuestionContentHelperText,
})

export const setEditedQuestionTagsHelperText = (editedQuestionTagsHelperText) => ({
  type: questionActions.SET_EDITED_QUESTION_TAGS_HELPER_TEXT,
  editedQuestionTagsHelperText,
})

export const setIsQuestionSolved = (isQuestionSolved) => ({
  type: questionActions.SET_IS_QUESTION_SOLVED,
  isQuestionSolved,
})

export const setClipboardSnackbarOpen = (clipboardSnackbarOpen) => ({
  type: questionActions.SET_CLIPBOARD_SNACKBAR_OPEN,
  clipboardSnackbarOpen,
})
