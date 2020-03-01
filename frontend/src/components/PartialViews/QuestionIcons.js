import React from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'
import EditIcon from '@material-ui/icons/Edit'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import AlertWindow from '../AlertWindow'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const QuestionIcons = ({ direction, handleUpdate, handleEdit, handleDelete, handleShare, alertCallback, alertOpen, alertSetOpen }) => {
  return (
    <Grid container justify={'flex-start'} direction={direction} style={{
      width: direction === 'row' ? '7.5rem' : '2rem'
    }}>
      <IconButton onClick={handleUpdate} size={'small'}>
        <CheckCircleOutlineIcon/>
      </IconButton>

      <IconButton onClick={handleEdit} size={'small'}>
        <EditIcon/>
      </IconButton>

      <IconButton onClick={handleDelete} size={'small'}>
        <DeleteIcon/>
      </IconButton>
      <AlertWindow
        title={'Confirm Deletion'}
        content={'Are you sure you want to delete this question?'}
        cancelButton={'NO'}
        confirmButton={'YES'}
        callback={alertCallback}
        open={alertOpen}
        setOpen={alertSetOpen}/>

      <CopyToClipboard text={window.location.href}>
        <IconButton onClick={handleShare} size={'small'}>
          <ShareIcon/>
        </IconButton>
      </CopyToClipboard>
    </Grid>
  )
}

export default QuestionIcons
