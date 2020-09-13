import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  instructionPaperSmall: {
    width: '80%',
    display: 'none',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
}))

/**
 * Question instruction for small screens
 * */
const QuestionInstructionSmall = () => {
  const classes = useStyles()
  return (
    <Paper className={classes.instructionPaperSmall}>
      <Typography variant="h6" style={{ marginLeft: 8 }}>Tips on getting good answers quickly</Typography>
      <ul>
        <li><Typography variant="body2">Include details about your goal</Typography></li>
        <li><Typography variant="body2">Make sure your question has not been asked already</Typography></li>
        <li><Typography variant="body2">Keep your question short and to the point</Typography></li>
        <li><Typography variant="body2">Double-check grammar and spelling</Typography></li>
      </ul>
    </Paper>
  )
}

export default QuestionInstructionSmall
