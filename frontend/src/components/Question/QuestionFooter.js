import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import QuestionIconsView from '../QuestionIcons/QuestionIconsView'

const TagsView = ({ tags }) => {
  if (!tags) {
    return ''
  }

  return (
    <ButtonGroup
      size="small"
      aria-label="small outlined button group"
      style={{
        marginBottom: 6,
        marginLeft: 18,
      }}
    >
      {tags && tags.map((tag) => (
        <Button
          key={tag}
          style={{
            maxHeight: '20px',
            minWidth: '60px',
            minHeight: '20px',
            fontSize: 10,
          }}
        >
          {tag}
        </Button>
      ))}
    </ButtonGroup>
  )
}

const PostedByView = ({ username }) => (
  <Grid
    container
    direction="column"
    justify="flex-end"
    style={{
      marginRight: 8,
      bottom: 0,
      width: 'auto',
    }}
  >
    <Typography
      variant="caption"
      style={{
        color: 'grey',
      }}
    >
      posted by:
      {' '}
      {username}
    </Typography>
  </Grid>
)

const QuestionFooter = ({ state, dispatch }) => {
  const { question } = state
  const isMobile = useMediaQuery('(max-width:600px)')
  if (isMobile) {
    return (
      <Grid container justify="space-between" wrap="nowrap">
        <QuestionIconsView state={state} dispatch={dispatch} />
        <PostedByView username={question && question.postedBy && question.postedBy.username} />
      </Grid>
    )
  }

  return (
    <Grid container justify="space-between" wrap="nowrap">
      <TagsView tags={question.tags} />
      <PostedByView username={question && question.postedBy && question.postedBy.username} />
    </Grid>
  )
}

export default QuestionFooter
