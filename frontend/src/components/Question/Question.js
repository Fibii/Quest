import React, { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import questionService from '../../services/questions'

import QuestionView from './QuestionView'
import { questionReducer, initialState } from '../../reducers/QuestionReducer'
import {
  setQuestion,
  setEditedQuestionContent,
  setEditedQuestionTags,
  setEditedQuestionTitle,
  setErrorMessage,
} from '../../actions/questionActions'


const Question = () => {
  const [state, dispatch] = useReducer(questionReducer, initialState)
  const { id } = useParams()


  /**
   * fetches the question from the backend and updates the question variable if no error,
   * otherwise it displays an error message
   * updates editedQuestionTitle and editedQuestionContent to the title, content of the question
   * respectively if they were empty, otherwise it won't because the rerender will be a side effect
   * of changing the state of those when the client edits one of them
   * */
  useEffect(() => {
    const getQuestion = async () => {
      const question = await questionService.get(id)
      if (!question || question.error) {
        dispatch(setErrorMessage('error: cannot connect to the server'))
      } else {
        dispatch(setQuestion(question))
        if (state.editedQuestionTitle === null) { // if this is the first time loading the page
          dispatch(setEditedQuestionTitle(question.title))
        }

        if (state.editedQuestionContent === null) {
          dispatch(setEditedQuestionContent(question.content))
        }

        if (state.editedQuestionTags === null && question.tags) {
          dispatch(setEditedQuestionTags(question.tags.join(', ')))
        }
      }
    }
    getQuestion()
  }, [id])

  return (
    <QuestionView
      state={state}
      dispatch={dispatch}
    />
  )
}

export default Question
