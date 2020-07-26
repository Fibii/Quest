import React from 'react'
import EditMode from './EditMode'
import ViewMode from './ViewMode'
import QuestionContainer from './QuestionContainer'

const QuestionView = ({ state, dispatch }) => {
  const { showEditFields } = state
  if (showEditFields) {
    return (
      <QuestionContainer state={state}>
        <EditMode state={state} dispatch={dispatch} />
      </QuestionContainer>
    )
  }

  return (
    <QuestionContainer state={state}>
      <ViewMode state={state} dispatch={dispatch} />
    </QuestionContainer>
  )
}

export default QuestionView
