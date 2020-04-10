import questionActions from '../actions/questionAction'

export const initialState = {
  question: {},
  commentContent: '',
  errorMessage: '',
  showEditFields: false,
  editedQuestionTitle: null,
  editedQuestionContent: null,
  editedQuestionTags: null,
  isQuestionSolved: false,
  editedQuestionTitleHelperText: '',
  editedQuestionContentHelperText: '',
  editedQuestionTagsHelperText: '',
  clipboardSnackbarOpen: false,
}

export const questionReducer = (state, action) => {
  switch (action.type) {
    case questionActions.SET_QUESTION:
      return {
        ...state,
        question: action.question,
      }
    case questionActions.SET_COMMENT_CONTENT:
      return {
        ...state,
        commentContent: action.commentContent,
      }
    case questionActions.SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.errorMessage,
      }
    case questionActions.SET_SHOW_EDIT_FIELDS:
      return {
        ...state,
        showEditFields: action.showEditFields,
      }
    case questionActions.SET_EDITED_QUESTION_TITLE:
      return {
        ...state,
        editedQuestionTitle: action.editedQuestionTitle,
      }
    case questionActions.SET_EDITED_QUESTION_CONTENT:
      return {
        ...state,
        editedQuestionContent: action.editedQuestionContent,
      }
    case questionActions.SET_EDITED_QUESTION_TAGS:
      return {
        ...state,
        editedQuestionTags: action.editedQuestionTags,
      }
    case questionActions.SET_EDITED_QUESTION_TITLE_HELPER_TEXT:
      return {
        ...state,
        editedQuestionTitleHelperText: action.editedQuestionTitleHelperText,
      }
    case questionActions.SET_EDITED_QUESTION_CONTENT_HELPER_TEXT:
      return {
        ...state,
        editedQuestionContentHelperText: action.editedQuestionContentHelperText,
      }
    case questionActions.SET_EDITED_QUESTION_TAGS_HELPER_TEXT:
      return {
        ...state,
        editedQuestionTagsHelperText: action.editedQuestionTagsHelperText,
      }
    case questionActions.SET_IS_QUESTION_SOLVED:
      return {
        ...state,
        isQuestionSolved: action.isQuestionSolved,
      }
    case questionActions.SET_CLIPBOARD_SNACKBAR_OPEN:
      return {
        ...state,
        clipboardSnackbarOpen: action.clipboardSnackbarOpen,
      }
    default:
      throw new Error('unknown action')
  }
}
