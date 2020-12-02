import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import config from '../../config'

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    outline: 'none',
    [theme.breakpoints.down('sm')]: {
      marginRight: 16,
    },
  },
  title: {
    display: 'block',
  },
}))

const QuestLogo = () => {
  const classes = useStyles()
  const { urls } = config
  return (
    <Link to={urls.root} className={classes.link} data-testid="logo">
      <Typography className={classes.title} variant="h6" noWrap>
        Quest
      </Typography>
    </Link>
  )
}

export default QuestLogo
