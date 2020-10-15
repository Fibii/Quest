import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import noPage from '../../resources/images/404.png'
import VHContainer from '../Containers/VHContainer/VHContainer'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: 'red',
    height: '100%',
  },
  innerContainer: {
    height: '50%',
  },
  paper: {
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.up('sm')]: {
      width: 500,
    },
    [theme.breakpoints.up('md')]: {
      width: 600,
    },
    paddingBottom: 2,
    paddingTop: 64,
  },
  image: {
    width: '60%',
  },

}))

const NoPage = () => {
  const classes = useStyles()

  return (
    <VHContainer>
      <Paper className={classes.paper}>
        <VHContainer>
          <img src={noPage} className={classes.image} alt={noPage} />
          <Typography
            variant="body1"
            display="block"
            paragraph
            gutterBottom
            align="center"
            style={{
              overflowWrap: 'break-word',
              width: '90%',
            }}
            data-testid="content"
          >
            Page doesn&apos;t exist
          </Typography>

        </VHContainer>
      </Paper>
    </VHContainer>
  )
}

export default NoPage
