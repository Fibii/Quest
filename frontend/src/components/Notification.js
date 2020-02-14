import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

/**
 * Renders an Alert, used for notifications
 * @param title: title of alert
 * @param message: message to be displayed in alert
 * @param severity: icon to be displayed in alert, one of:
 *    - error
 *    - warning
 *    - info
 *    - success
 * */
const Notification = ({ title, message, severity }) => {
  const classes = useStyles()

  if (!message) {
    return null
  }

  return (
    <div className={classes.root}>
      <Alert severity={severity} variant="filled" style={{
        minWidth: '90%'
      }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </div>
  )
}

export default Notification
