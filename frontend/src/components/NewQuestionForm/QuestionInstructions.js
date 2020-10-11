import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const { useState } = require('react')

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
  },
  title: {
    margin: 8,
  },
}))

const QuestionInstructions = () => {
  const classes = useStyles()
  const [firstExpanded, setFirstExpanded] = useState(false)
  const [secondExpanded, setSecondExpanded] = useState(false)

  const firstOnChange = (event, expanded) => {
    setFirstExpanded(expanded)
    setSecondExpanded(false)
  }

  const secondOnChange = (event, expanded) => {
    setSecondExpanded(expanded)
    setFirstExpanded(false)
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6" align="center" className={classes.title}>Tips on getting good answers quickly</Typography>
      <Accordion expanded={firstExpanded} onChange={firstOnChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Summarize the problem</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            <li><Typography variant="body2">Include details about your goal</Typography></li>
            <li><Typography variant="body2">Describe expected and actual results</Typography></li>
            <li><Typography variant="body2">Include any error messages</Typography></li>
            <li><Typography variant="body2">Make sure your question has not been asked already</Typography></li>
            <li><Typography variant="body2">Keep your question short and to the point</Typography></li>
            <li><Typography variant="body2">Double-check grammar and spelling</Typography></li>
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={secondExpanded} onChange={secondOnChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Describe what you&apos;ve tried</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Show what you’ve tried and tell us what you found (on this site or elsewhere) and
            why it didn’t meet your needs. You can get better answers when you provide research.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default QuestionInstructions
