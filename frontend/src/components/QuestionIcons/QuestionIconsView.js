import Grid from '@material-ui/core/Grid'
import React, { useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import QuestionIcons from './QuestionIcons'
import validator from '../../services/validator'
import utils from '../../services/utils'
import UserContext from '../UserContext/UserContext'
import questionService from '../../services/questions'
import { setErrorMessage, setQuestion, setShowEditFields } from '../../actions/questionActions'
import config from '../../config'

const QuestionIconsView = ({
  dispatch, state,
}) => {
  const { id } = useParams()
  const history = useHistory()
  const {
    question, showEditFields,
  } = state
  const [user] = useContext(UserContext)
  const isMobile = useMediaQuery('(max-width:600px)')
  const { urls } = config
  /**
   * deletes a question form the database
   * */
  const handleDeleteQuestion = async () => {
    const response = await questionService.deleteQuestion(id)
    if (response) {
      history.push(urls.root)
    } else {
      setTimeout(() => dispatch(setErrorMessage('')), 5000)
      dispatch(setErrorMessage('error: couldn\'t delete the question'))
    }
  }

  const handleQuestionUpdate = async () => {
    const tags = state.editedQuestionTags.split(' ')
      .map((tag) => tag.replace(/^\s+|\s+$/gm, ''))
      .filter((tag) => tag.length > 0)

    const updatedQuestion = {
      title: state.editedQuestionTitle,
      content: state.editedQuestionContent,
      solved: state.isQuestionSolved,
      tags,
    }

    if (!validator.questionFormValidator({ title: state.editedQuestionTitle })
      || !validator.questionFormValidator({ content: state.editedQuestionContent })
      || state.editedQuestionTagsHelperText) {
      dispatch(setErrorMessage('All fields are required, if a field is red, fix it'))
    } else {
      const response = await questionService.updateQuestion(state.question.id, updatedQuestion)

      if (!response || response.error) {
        dispatch(setErrorMessage('error: could not update the question'))
      } else {
        dispatch(setQuestion({
          ...state.question,
          title: updatedQuestion.title,
          content: updatedQuestion.content,
          tags: updatedQuestion.tags,
        }))
        dispatch(setShowEditFields(false))
      }
    }
  }

  return (
    <Grid
      item
      style={{
        marginTop: 8,
        marginRight: 10,
        flexGrow: 1,
      }}
    >
      {utils.iff(validator.isAuthor(user, question), <QuestionIcons
        handleDelete={() => handleDeleteQuestion(question.id)}
        handleEdit={() => dispatch(setShowEditFields(!showEditFields))}
        handleUpdate={showEditFields && handleQuestionUpdate}
        path={`question/${question.id}`}
        question={question}
        direction="row"
      />,
        <div
          edge="end"
          aria-label="icons"
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'flex-end',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <QuestionIcons
            path={urls.question}
            question={question}
            direction="row"
          />
        </div>)}
    </Grid>
  )
}

export default QuestionIconsView
