import React from 'react'
import {
  render, waitForElement, cleanup, fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import question from '../__mocks__/question'
import utils from '../services/utils'
import Question from '../components/Question'
import UserContext from '../components/UserContext'
import user from '../__mocks__/user'
import inputHelper from '../services/testHelpers/inputHelper'

jest.mock('axios')
afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const baseUrl = 'http://localhost:3001/api'
const url = `${baseUrl}/questions/${question.id}`


describe('question tests', () => {
  test('displays an error message', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: undefined,
    })

    const { getByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={['question/badId']}>
          <Route path="question/:id">
            <Question />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )

    await waitForElement(() => getByTestId('question-container'))
    expect(getByTestId('notification').textContent)
      .toContain('cannot connect to the server')
  })


  test('loads and displays a question', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: question,
    })

    const { getByTestId, getAllByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={[`question/${question.id}`]}>
          <Route path="question/:id">
            <Question />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )


    await waitForElement(() => getAllByTestId('question-container'))

    const comments = getAllByTestId('comment-content').map((comment) => comment.textContent)
    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(axiosMock.get).toHaveBeenCalledWith(url)
    expect(getByTestId('title').textContent).toBe(question.title)
    expect(getByTestId('content').textContent).toBe(question.content)
    expect(parseInt(getAllByTestId('upvoteBox-likes')[0].textContent, 10)).toBe(utils.getLikes(question.likes))
    expect(comments).toEqual(question.comments.map((comment) => comment.content))
  })

  test('displays edit page and edits (update) a question', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: question,
    })

    const { getByTestId, getAllByTestId } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={[`question/${question.id}`]}>
          <Route path="question/:id">
            <Question />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>,
    )

    await waitForElement(() => getAllByTestId('question-container'))
    fireEvent.click(getByTestId('edit-button'))

    // to be refactored into expect(edit-container) to in the document
    // after exporting edit view to its own component
    expect(getByTestId('title-input'))
      .toBeInTheDocument()
    expect(getByTestId('content-input'))
      .toBeInTheDocument()
    expect(getByTestId('tags-input'))
      .toBeInTheDocument()

    // jest.clearAllMocks()
    const editedQuestion = {
      title: 'edited question title',
      content: 'edited question content',
      tags: 'edited, tags',
      solved: question.solved,
    }

    const updatedQuestion = {
      ...editedQuestion,
      tags: editedQuestion.tags.split(', '),
    }

    axiosMock.put.mockResolvedValueOnce({
      data: {
        ...question,
        title: editedQuestion.title,
        content: editedQuestion.content,
        tags: editedQuestion.tags,
      },
    })


    fireEvent.change(getByTestId('title-input'), inputHelper.parseValue(editedQuestion.title))
    fireEvent.change(getByTestId('content-input'), inputHelper.parseValue(editedQuestion.content))
    fireEvent.change(getByTestId('tags-input'), inputHelper.parseValue('edited,tags'))

    fireEvent.click(getByTestId('update-button'))
    fireEvent.click(getByTestId('confirm-button')) // confirm the alertWindow
    await waitForElement(() => getAllByTestId('question-container'))
    expect(axiosMock.put).toBeCalledTimes(1)
    expect(axiosMock.put).toBeCalledWith(url, updatedQuestion, null)
  })
})
