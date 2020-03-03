import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'
import EditIcon from '@material-ui/icons/Edit'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import AlertWindow from '../AlertWindow'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Snackbar from '@material-ui/core/Snackbar'
import grey from '@material-ui/core/colors/grey'

/**
 *
 * @param direction: direction of the grid
 * @param alert*, handle*: callbacks for IconButton onClick
 * @return clickable icons, an icon is returned if its callback is truthy
 * */
const QuestionIcons = ({ direction, handleUpdate, handleEdit, handleDelete, path, alertCallback, alertOpen, alertSetOpen }) => {

  const [clipboardSnackbarOpen, setClipboardSnackbarOpen] = useState(false)

  // the width of this component depending on the rendered icons
  const width = [path, handleDelete, handleUpdate, handleEdit].filter(handler => handler).length * 1.9

  const handleClipboardSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setClipboardSnackbarOpen(false)
  }

  const handleShareButton = () => {
    setClipboardSnackbarOpen(true)
  }

  return (
    <Grid container justify={'flex-start'} direction={direction} style={{
      width: direction === 'row' ? `${width}rem` : '2rem'
    }}>
      {handleUpdate && <IconButton onClick={handleUpdate} size={'small'}>
        <CheckCircleOutlineIcon/>
      </IconButton>}

      {handleEdit && <IconButton onClick={handleEdit} size={'small'}>
        <EditIcon/>
      </IconButton>}

      {handleDelete && <IconButton onClick={handleDelete} size={'small'}>
        <DeleteIcon/>
      </IconButton>}
      <AlertWindow
        title={'Confirm Deletion'}
        content={'Are you sure you want to delete this question?'}
        cancelButton={'NO'}
        confirmButton={'YES'}
        callback={alertCallback}
        open={alertOpen}
        setOpen={alertSetOpen}/>

      {path &&
      <CopyToClipboard text={path ? `${window.location.origin}/${path}` : window.location.href}>
        <IconButton onClick={handleShareButton} size={'small'}>
          <ShareIcon/>
        </IconButton>
      </CopyToClipboard>}

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
      />
    </Grid>
  )
}

export default QuestionIcons
