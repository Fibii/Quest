import React from 'react'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

const Welcome = () => {

  return (
    <div>
      <Typography>
        It looks like you're not logged in, to view the main app, either
      </Typography>

      <Link to={'/login'}>
        Login
      </Link>

      <Typography>
        or
      </Typography>

      <Link to={'/register'}>
        Sign Up
      </Link>
    </div>
  )
}

export default Welcome
