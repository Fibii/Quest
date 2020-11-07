import Grid from '@material-ui/core/Grid'
import React from 'react'
import Notification from '../Notification/Notification'

const QuestionContainer = ({ state, children }) => {
  const { errorMessage } = state
  return (
    <Grid
      container
      justify="center"
      data-testid="question-container"
      style={{
        marginTop: 32,
        marginBottom: 16,
      }}
    >
      <Grid
        container
        direction="column"
        justify="flex-start"
        style={{
          width: '90%',
          minWidth: '90%',
        }}
      >
        <Notification title="Error" message={errorMessage} severity="error" style={{ marginBottom: 16 }} />
        { children }
      </Grid>
    </Grid>
  )
}

export default QuestionContainer
