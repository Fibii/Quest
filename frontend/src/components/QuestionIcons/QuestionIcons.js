import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'
import EditIcon from '@material-ui/icons/Edit'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Snackbar from '@material-ui/core/Snackbar'
import grey from '@material-ui/core/colors/grey'
import AlertWindow from '../AlertWindow/AlertWindow'
import utils from '../../services/utils'

/**
 *
 * @param direction: direction of the grid
 * @param alert*, handle*: callbacks for IconButton onClick
 * @return clickable icons, an icon is returned if its callback is truthy
 * */
const QuestionIcons = ({
  direction, handleUpdate, handleEdit, handleDelete, path,
}) => {
  const [clipboardSnackbarOpen, setClipboardSnackbarOpen] = useState(false)
  const [currentMode, setCurrentMode] = useState('NONE')
  const [openAlertWindow, setOpenAlertWindow] = useState(false)

  const UPDATE = 'UPDATE'
  const DELETE = 'DELETE'

  // the width of this component depending on the rendered icons
  const width = [path, handleDelete, handleUpdate, handleEdit]
    .filter((handler) => handler).length * 1.9

  const handleClipboardSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setClipboardSnackbarOpen(false)
  }

  const handleShareButton = () => {
    setClipboardSnackbarOpen(true)
  }

  const handleUpdateButton = () => {
    setOpenAlertWindow(true)
    setCurrentMode(UPDATE)
  }

  const handleDeleteButton = () => {
    setOpenAlertWindow(true)
    setCurrentMode(DELETE)
  }

  return (
    <Grid
      container
      justify="flex-start"
      direction={direction}
      style={{
        width: direction === 'row' ? `${width}rem` : '2rem',
      }}
      data-testid="questionIcons-container"
    >
      {handleUpdate && (
        <IconButton onClick={handleUpdateButton} size="small" data-testid="update-button">
          <CheckCircleOutlineIcon />
        </IconButton>
      )}

      {handleEdit && (
        <IconButton onClick={handleEdit} size="small" data-testid="edit-button">
          <EditIcon />
        </IconButton>
      )}

      {handleDelete && (
        <IconButton onClick={handleDeleteButton} size="small" data-testid="delete-button">
          <DeleteIcon />
        </IconButton>
      )}
      <AlertWindow
        title={`Confirm ${utils.iff(currentMode === DELETE, 'Delete', 'Update')}`}
        content={`Are you sure you want to ${utils.iff(currentMode === DELETE, 'delete', 'update')} this question?`}
        cancelButton="NO"
        confirmButton="YES"
        callback={utils.iff(currentMode === UPDATE, handleUpdate, handleDelete)}
        open={openAlertWindow}
        setOpen={setOpenAlertWindow}
      />

      {path
      && (
        <CopyToClipboard text={path ? `${window.location.origin}${path}` : window.location.href}>
          <IconButton onClick={handleShareButton} size="small" data-testid="share-button">
            <ShareIcon />
          </IconButton>
        </CopyToClipboard>
      )}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={clipboardSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleClipboardSnackbar}
        message="copied to clipboards"
        color={grey[300]}
        data-testid="snackbar"
      />
    </Grid>
  )
}

export default QuestionIcons
