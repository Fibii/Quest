import React, { useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

/**
 * shows a confirmation window (alert) for the user
 * @param title: title of the alert
 * @param content: message of the alert
 * @param cancelButton: value of cancel/no/abort button
 * @param confirmButton: value of the confirm button
 * @param callback: function to be executed if the alert is confirmed
 *
 */
const AlertWindow = ({
  open, setOpen, title, content, cancelButton, confirmButton, callback,
}) => {
  let isMounted = false

  useEffect(() => {
    // componentDidMount
    isMounted = true // used to prevent a memory leak after the component is unmounted

    // componentWillUnmount
    return () => {
      isMounted = false
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const onClick = async () => {
    await callback()
    if (isMounted && setOpen) {
      setOpen(false)
    }
  }

  return (
    <div data-testid="alert-container">
      <Dialog
        open={open || false}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" data-testid="title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-dsescription" data-testid="content">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" data-testid="cancel-button">
            {cancelButton}
          </Button>
          <Button onClick={onClick} color="primary" autoFocus data-testid="confirm-button">
            {confirmButton}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AlertWindow
