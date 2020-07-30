import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    outline: 'none',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}))

const QuestLogo = () => {
  const classes = useStyles()
  return (
    <Link to="/" className={classes.link} data-testid="logo">
      <Typography className={classes.title} variant="h6" noWrap>
        Quest
      </Typography>
    </Link>
  )
}

export default QuestLogo
