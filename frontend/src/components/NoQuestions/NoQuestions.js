import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { lightBlue } from '@material-ui/core/colors'
import { useHistory } from 'react-router-dom'
import noQuestionsImg from '../../resources/images/no-questions.png'
import config from '../../config'
import VHContainer from '../Containers/VHContainer/VHContainer'

const AddQuestionButton = withStyles({
  root: {
    backgroundColor: lightBlue[700],
    border: '1px solid',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: lightBlue[800],
      boxShadow: 'none',
    },
  },
})(Button)

const useStyles = makeStyles((theme) => ({
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
    paddingBottom: 16,
  },
  image: {
    width: '60%',
  },

}))

const NoQuestions = () => {
  const classes = useStyles()
  const history = useHistory()
  const { urls } = config

  return (
    (
      <VHContainer>
        <Paper className={classes.paper}>
          <Grid container direction="column">
            <Grid container justify="center">
              <img src={noQuestionsImg} className={classes.image} alt={noQuestionsImg} />
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
                No questions exist, be the first one that asks a question
              </Typography>
              <AddQuestionButton
                variant="contained"
                color="primary"
                disableElevation
                endIcon={<AddIcon>send</AddIcon>}
                onClick={() => history.push(urls.newQuestion)}
              >
                Ask a Question
              </AddQuestionButton>
            </Grid>
          </Grid>
        </Paper>
      </VHContainer>
    )
  )
}

export default NoQuestions
