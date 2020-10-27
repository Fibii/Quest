import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    outline: 'none',
    '&:visited': {
      color: 'inherit',
    },
  },
}))

const QLink = ({ to, children, testId }) => {
  const classes = useStyles()
  return (
    <Link to={to} variant="body2" className={classes.link} data-testid={testId}>
      <Typography variant="body2">{ children }</Typography>
    </Link>
  )
}

export default QLink
