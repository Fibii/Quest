import React from 'react'
import Paper from '@material-ui/core/Paper'
import red from '@material-ui/core/colors/red'

const errorCSS = {
  color: 'red',
  background: red[100],
  border: `1px solid ${red[400]}`,
  margin: 8,
  minHeight: '10vh',
  fontSize: '26px',
  textAlign: 'center',
}

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <Paper style={errorCSS}>
      {message}
    </Paper>
  )
}

export default Notification
